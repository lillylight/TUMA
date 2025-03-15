// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title DocumentPayment
 * @dev Smart contract for handling document exchange payments with tiered pricing
 * Enhanced security with OpenZeppelin contracts and additional security measures
 */
contract DocumentPayment is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    
    // USDC token contract
    IERC20 public usdcToken;
    
    // Base fee in wei (for ETH payments)
    uint256 public baseFee;
    
    // Document payment status
    enum PaymentStatus { Unpaid, Paid, Refunded }
    
    // File size tiers in bytes
    enum FileSizeTier { Small, Medium, Large }
    
    // Tier thresholds in bytes
    uint256 public constant SMALL_TIER_MAX = 20 * 1024 * 1024; // 20MB
    uint256 public constant MEDIUM_TIER_MAX = 50 * 1024 * 1024; // 50MB
    uint256 public constant MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    
    // Fee multipliers for each tier (in basis points, 100 = 1%)
    uint256 public smallTierMultiplier = 100; // $1.00
    uint256 public mediumTierMultiplier = 200; // $2.00
    uint256 public largeTierMultiplier = 300; // $3.00
    
    // Arweave storage fee percentage (in basis points, 100 = 1%)
    uint256 public arweaveStorageFeePercentage = 6000; // 60% of total fee
    
    // Payment currency enum
    enum PaymentCurrency { ETH, USDC }
    
    // Document payment record
    struct Payment {
        address sender;
        address recipient;
        string documentId;
        uint256 amount;
        uint256 fileSize;
        FileSizeTier tier;
        uint256 timestamp;
        PaymentStatus status;
        PaymentCurrency currency;
    }
    
    // Mapping from document ID to payment
    mapping(string => Payment) public payments;
    
    // Mapping from address to ENS/Base name
    mapping(address => string) public addressToName;
    mapping(string => address) public nameToAddress;
    
    // Mapping to track if a document ID has been used
    mapping(string => bool) public documentExists;
    
    // Contract pause state
    bool public paused = false;
    
    // Events
    event PaymentReceived(string documentId, address sender, address recipient, uint256 amount, uint256 fileSize, FileSizeTier tier, PaymentCurrency currency);
    event PaymentRefunded(string documentId, address sender, uint256 amount, PaymentCurrency currency);
    event FeeUpdated(uint256 newBaseFee);
    event MultiplierUpdated(FileSizeTier tier, uint256 multiplier);
    event NameRegistered(address indexed addr, string name);
    event USDCTokenUpdated(address newTokenAddress);
    event ContractPaused(address pauser);
    event ContractUnpaused(address unpauser);
    
    // Modifiers
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier documentNotExists(string memory documentId) {
        require(!documentExists[documentId], "Document ID already exists");
        _;
    }
    
    modifier documentDoesExist(string memory documentId) {
        require(documentExists[documentId], "Document payment does not exist");
        _;
    }
    
    modifier onlySender(string memory documentId) {
        require(payments[documentId].sender == msg.sender, "Only sender can call this function");
        _;
    }
    
    modifier validFileSize(uint256 fileSize) {
        require(fileSize > 0, "File size must be greater than 0");
        require(fileSize <= MAX_FILE_SIZE, "File size exceeds maximum allowed");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _baseFee Initial base fee for document exchange in wei
     * @param _usdcToken Address of the USDC token contract
     */
    constructor(uint256 _baseFee, address _usdcToken) Ownable(msg.sender) {
        baseFee = _baseFee;
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Calculate fee based on file size
     * @param fileSize Size of the file in bytes
     * @return fee The calculated fee
     * @return tier The file size tier
     */
    function calculateFee(uint256 fileSize) public view validFileSize(fileSize) returns (uint256 fee, FileSizeTier tier) {
        if (fileSize <= SMALL_TIER_MAX) {
            return (baseFee.mul(smallTierMultiplier).div(100), FileSizeTier.Small);
        } else if (fileSize <= MEDIUM_TIER_MAX) {
            return (baseFee.mul(mediumTierMultiplier).div(100), FileSizeTier.Medium);
        } else {
            return (baseFee.mul(largeTierMultiplier).div(100), FileSizeTier.Large);
        }
    }
    
    /**
     * @dev Pay for document exchange and storage using ETH
     * @param documentId Unique identifier for the document
     * @param recipient Address of the document recipient
     * @param fileSize Size of the file in bytes
     */
    function payForDocumentWithETH(
        string memory documentId, 
        address recipient, 
        uint256 fileSize
    ) 
        external 
        payable 
        whenNotPaused 
        documentNotExists(documentId)
        validFileSize(fileSize)
        nonReentrant 
    {
        require(recipient != address(0), "Invalid recipient address");
        
        (uint256 requiredFee, FileSizeTier tier) = calculateFee(fileSize);
        require(msg.value >= requiredFee, "Payment amount must be at least the calculated fee");
        
        // Store payment record
        payments[documentId] = Payment({
            sender: msg.sender,
            recipient: recipient,
            documentId: documentId,
            amount: msg.value,
            fileSize: fileSize,
            tier: tier,
            timestamp: block.timestamp,
            status: PaymentStatus.Paid,
            currency: PaymentCurrency.ETH
        });
        
        // Mark document as existing
        documentExists[documentId] = true;
        
        emit PaymentReceived(documentId, msg.sender, recipient, msg.value, fileSize, tier, PaymentCurrency.ETH);
    }
    
    /**
     * @dev Pay for document exchange and storage using USDC
     * @param documentId Unique identifier for the document
     * @param recipient Address of the document recipient
     * @param fileSize Size of the file in bytes
     * @param amount Amount of USDC tokens to pay
     */
    function payForDocumentWithUSDC(
        string memory documentId, 
        address recipient, 
        uint256 fileSize,
        uint256 amount
    ) 
        external 
        whenNotPaused 
        documentNotExists(documentId)
        validFileSize(fileSize)
        nonReentrant 
    {
        require(recipient != address(0), "Invalid recipient address");
        
        (uint256 requiredFee, FileSizeTier tier) = calculateFee(fileSize);
        require(amount >= requiredFee, "Payment amount must be at least the calculated fee");
        
        // Transfer USDC tokens from sender to contract
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
        
        // Store payment record
        payments[documentId] = Payment({
            sender: msg.sender,
            recipient: recipient,
            documentId: documentId,
            amount: amount,
            fileSize: fileSize,
            tier: tier,
            timestamp: block.timestamp,
            status: PaymentStatus.Paid,
            currency: PaymentCurrency.USDC
        });
        
        // Mark document as existing
        documentExists[documentId] = true;
        
        emit PaymentReceived(documentId, msg.sender, recipient, amount, fileSize, tier, PaymentCurrency.USDC);
    }
    
    /**
     * @dev Refund payment for document
     * @param documentId Unique identifier for the document
     */
    function refundPayment(string memory documentId) 
        external 
        documentDoesExist(documentId) 
        onlySender(documentId) 
        nonReentrant 
    {
        Payment storage payment = payments[documentId];
        require(payment.status == PaymentStatus.Paid, "Payment is not in paid status");
        
        // Update status before transfer to prevent reentrancy
        payment.status = PaymentStatus.Refunded;
        
        if (payment.currency == PaymentCurrency.ETH) {
            // Transfer ETH back to sender
            (bool success, ) = payment.sender.call{value: payment.amount}("");
            require(success, "ETH refund transfer failed");
        } else {
            // Transfer USDC back to sender
            require(usdcToken.transfer(payment.sender, payment.amount), "USDC refund transfer failed");
        }
        
        emit PaymentRefunded(documentId, payment.sender, payment.amount, payment.currency);
    }
    
    /**
     * @dev Get payment details for a document
     * @param documentId Unique identifier for the document
     * @return Payment details
     */
    function getPayment(string memory documentId) 
        external 
        view 
        documentDoesExist(documentId) 
        returns (Payment memory) 
    {
        return payments[documentId];
    }
    
    /**
     * @dev Check if document is paid
     * @param documentId Unique identifier for the document
     * @return True if document exists and is paid
     */
    function isDocumentPaid(string memory documentId) external view returns (bool) {
        if (!documentExists[documentId]) {
            return false;
        }
        
        return payments[documentId].status == PaymentStatus.Paid;
    }
    
    /**
     * @dev Register or update an ENS or Base name for an address
     * @param addr The address to register the name for
     * @param name The ENS or Base name
     */
    function registerName(address addr, string memory name) external onlyOwner {
        require(addr != address(0), "Cannot register name for zero address");
        require(bytes(name).length > 0, "Name cannot be empty");
        
        // If name is already registered to a different address, remove old mapping
        if (nameToAddress[name] != address(0) && nameToAddress[name] != addr) {
            delete addressToName[nameToAddress[name]];
        }
        
        // Update mappings
        addressToName[addr] = name;
        nameToAddress[name] = addr;
        
        emit NameRegistered(addr, name);
    }
    
    /**
     * @dev Resolve an address from an ENS or Base name
     * @param name The ENS or Base name
     * @return The associated address
     */
    function resolveName(string memory name) external view returns (address) {
        return nameToAddress[name];
    }
    
    /**
     * @dev Get the ENS or Base name for an address
     * @param addr The address
     * @return The associated name
     */
    function getNameForAddress(address addr) external view returns (string memory) {
        return addressToName[addr];
    }
    
    /**
     * @dev Update the base fee for document exchange
     * @param _baseFee New base fee amount
     */
    function updateBaseFee(uint256 _baseFee) external onlyOwner {
        baseFee = _baseFee;
        emit FeeUpdated(_baseFee);
    }
    
    /**
     * @dev Update fee multiplier for a specific tier
     * @param tier The file size tier
     * @param multiplier The new multiplier in basis points (100 = 1x)
     */
    function updateTierMultiplier(FileSizeTier tier, uint256 multiplier) external onlyOwner {
        require(multiplier > 0, "Multiplier must be greater than 0");
        
        if (tier == FileSizeTier.Small) {
            smallTierMultiplier = multiplier;
        } else if (tier == FileSizeTier.Medium) {
            mediumTierMultiplier = multiplier;
        } else if (tier == FileSizeTier.Large) {
            largeTierMultiplier = multiplier;
        }
        
        emit MultiplierUpdated(tier, multiplier);
    }
    
    /**
     * @dev Update the percentage of fee allocated to Arweave storage
     * @param percentage New percentage in basis points (100 = 1%)
     */
    function updateArweaveStorageFeePercentage(uint256 percentage) external onlyOwner {
        require(percentage <= 10000, "Percentage cannot exceed 100%");
        arweaveStorageFeePercentage = percentage;
    }
    
    /**
     * @dev Update the USDC token contract address
     * @param _usdcToken New USDC token contract address
     */
    function updateUSDCToken(address _usdcToken) external onlyOwner {
        require(_usdcToken != address(0), "Invalid token address");
        usdcToken = IERC20(_usdcToken);
        emit USDCTokenUpdated(_usdcToken);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(msg.sender);
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }
    
    /**
     * @dev Withdraw ETH from contract to owner
     */
    function withdrawETH() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH balance to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "ETH withdraw transfer failed");
    }
    
    /**
     * @dev Withdraw USDC tokens from contract to owner
     */
    function withdrawUSDC() external onlyOwner nonReentrant {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No USDC balance to withdraw");
        
        require(usdcToken.transfer(owner(), balance), "USDC withdraw transfer failed");
    }
    
    /**
     * @dev Emergency function to recover any ERC20 tokens accidentally sent to the contract
     * @param tokenAddress The address of the token to recover
     */
    function recoverERC20(address tokenAddress) external onlyOwner nonReentrant {
        require(tokenAddress != address(0), "Invalid token address");
        IERC20 token = IERC20(tokenAddress);
        
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No token balance to recover");
        
        require(token.transfer(owner(), balance), "Token recovery transfer failed");
    }
}
