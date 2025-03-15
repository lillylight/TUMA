import { ethers } from 'ethers';
import { toast } from 'sonner';

// ABI for the DocumentPayment contract
const contractABI = [
  // ETH payment functions
  "function payForDocumentWithETH(string documentId, address recipient, uint256 fileSize) external payable",
  // USDC payment functions
  "function payForDocumentWithUSDC(string documentId, address recipient, uint256 fileSize, uint256 amount) external",
  // Common functions
  "function refundPayment(string documentId) external",
  "function getPayment(string documentId) external view returns (tuple(address sender, address recipient, string documentId, uint256 amount, uint256 fileSize, uint8 tier, uint256 timestamp, uint8 status, uint8 currency))",
  "function isDocumentPaid(string documentId) external view returns (bool)",
  "function calculateFee(uint256 fileSize) public view returns (uint256 fee, uint8 tier)",
  "function baseFee() external view returns (uint256)",
  "function registerName(address addr, string memory name) external",
  "function resolveName(string memory name) external view returns (address)",
  "function getNameForAddress(address addr) external view returns (string memory)",
  // USDC token
  "function usdcToken() external view returns (address)"
];

// Payment status enum from the contract
export enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
  Refunded = 2
}

// File size tier enum from the contract
export enum FileSizeTier {
  Small = 0,
  Medium = 1,
  Large = 2
}

// Payment currency enum from the contract
export enum PaymentCurrency {
  ETH = 0,
  USDC = 1
}

// Payment interface matching the contract struct
export interface Payment {
  sender: string;
  recipient: string;
  documentId: string;
  amount: bigint;
  fileSize: bigint;
  tier: FileSizeTier;
  timestamp: bigint;
  status: PaymentStatus;
  currency: PaymentCurrency;
}

// Tier thresholds in bytes (matching the contract)
export const SMALL_TIER_MAX = 20 * 1024 * 1024; // 20MB
export const MEDIUM_TIER_MAX = 50 * 1024 * 1024; // 50MB
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string = '';
  private usdcContract: ethers.Contract | null = null;

  /**
   * Initialize the contract service with the provider and contract address
   * @param contractAddress The address of the deployed DocumentPayment contract
   */
  async initialize(contractAddress: string): Promise<void> {
    try {
      if (window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.contractAddress = contractAddress;
        this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
        
        // Initialize USDC contract
        const usdcAddress = await this.contract.usdcToken();
        const usdcABI = [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function allowance(address owner, address spender) external view returns (uint256)",
          "function balanceOf(address account) external view returns (uint256)",
          "function decimals() external view returns (uint8)"
        ];
        this.usdcContract = new ethers.Contract(usdcAddress, usdcABI, this.signer);
      } else {
        throw new Error('Ethereum provider not found');
      }
    } catch (error) {
      console.error('Error initializing contract service:', error);
      toast.error('Failed to initialize contract service');
      throw error;
    }
  }

  /**
   * Check if the contract service is initialized
   */
  isInitialized(): boolean {
    return this.contract !== null && this.signer !== null;
  }

  /**
   * Get the current base fee for document exchange
   * @returns The base fee amount in wei
   */
  async getBaseFee(): Promise<bigint> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      return await this.contract!.baseFee();
    } catch (error) {
      console.error('Error getting base fee:', error);
      toast.error('Failed to get document exchange base fee');
      throw error;
    }
  }

  /**
   * Calculate fee based on file size
   * @param fileSize Size of the file in bytes
   * @returns The calculated fee and tier
   */
  async calculateFee(fileSize: number): Promise<{ fee: bigint; tier: FileSizeTier }> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      const [fee, tier] = await this.contract!.calculateFee(fileSize);
      return { fee, tier };
    } catch (error) {
      console.error('Error calculating fee:', error);
      toast.error('Failed to calculate document exchange fee');
      throw error;
    }
  }

  /**
   * Get human-readable tier name
   * @param tier The file size tier
   * @returns Human-readable tier name
   */
  getTierName(tier: FileSizeTier): string {
    switch (tier) {
      case FileSizeTier.Small:
        return 'Small (up to 20MB) - $1.00';
      case FileSizeTier.Medium:
        return 'Medium (21MB - 50MB) - $2.00';
      case FileSizeTier.Large:
        return 'Large (51MB - 100MB) - $3.00';
      default:
        return 'Unknown';
    }
  }

  /**
   * Pay for document exchange using ETH
   * @param documentId Unique identifier for the document
   * @param recipientAddress Address of the document recipient
   * @param fileSize Size of the file in bytes
   * @param amount Amount to pay in wei (must be at least the calculated fee)
   * @returns The transaction hash
   */
  async payForDocumentWithETH(documentId: string, recipientAddress: string, fileSize: number, amount: bigint): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      const tx = await this.contract!.payForDocumentWithETH(documentId, recipientAddress, fileSize, {
        value: amount
      });
      
      const receipt = await tx.wait();
      toast.success('ETH payment successful');
      return receipt.hash;
    } catch (error) {
      console.error('Error paying for document with ETH:', error);
      toast.error('ETH payment failed');
      throw error;
    }
  }

  /**
   * Pay for document exchange using USDC
   * @param documentId Unique identifier for the document
   * @param recipientAddress Address of the document recipient
   * @param fileSize Size of the file in bytes
   * @param amount Amount of USDC to pay
   * @returns The transaction hash
   */
  async payForDocumentWithUSDC(documentId: string, recipientAddress: string, fileSize: number, amount: bigint): Promise<string> {
    if (!this.isInitialized() || !this.usdcContract) {
      throw new Error('Contract service not initialized');
    }

    try {
      // Check USDC allowance
      const signerAddress = await this.signer!.getAddress();
      const allowance = await this.usdcContract.allowance(signerAddress, this.contractAddress);
      
      // If allowance is less than amount, approve the contract to spend USDC
      if (allowance < amount) {
        const approveTx = await this.usdcContract.approve(this.contractAddress, amount);
        await approveTx.wait();
        toast.success('USDC approval successful');
      }
      
      // Pay for document with USDC
      const tx = await this.contract!.payForDocumentWithUSDC(documentId, recipientAddress, fileSize, amount);
      const receipt = await tx.wait();
      toast.success('USDC payment successful');
      return receipt.hash;
    } catch (error) {
      console.error('Error paying for document with USDC:', error);
      toast.error('USDC payment failed');
      throw error;
    }
  }

  /**
   * Resolve an ENS or Base name to an address
   * @param name The ENS or Base name
   * @returns The resolved address or null if not found
   */
  async resolveName(name: string): Promise<string | null> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      const address = await this.contract!.resolveName(name);
      return address === ethers.ZeroAddress ? null : address;
    } catch (error) {
      console.error('Error resolving name:', error);
      return null;
    }
  }

  /**
   * Get the ENS or Base name for an address
   * @param address The address
   * @returns The associated name or null if not found
   */
  async getNameForAddress(address: string): Promise<string | null> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      const name = await this.contract!.getNameForAddress(address);
      return name === '' ? null : name;
    } catch (error) {
      console.error('Error getting name for address:', error);
      return null;
    }
  }

  /**
   * Refund payment for document
   * @param documentId Unique identifier for the document
   * @returns The transaction hash
   */
  async refundPayment(documentId: string): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      const tx = await this.contract!.refundPayment(documentId);
      const receipt = await tx.wait();
      toast.success('Refund successful');
      return receipt.hash;
    } catch (error) {
      console.error('Error refunding payment:', error);
      toast.error('Refund failed');
      throw error;
    }
  }

  /**
   * Get payment details for a document
   * @param documentId Unique identifier for the document
   * @returns Payment details
   */
  async getPayment(documentId: string): Promise<Payment> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      const payment = await this.contract!.getPayment(documentId);
      return {
        sender: payment[0],
        recipient: payment[1],
        documentId: payment[2],
        amount: payment[3],
        fileSize: payment[4],
        tier: payment[5],
        timestamp: payment[6],
        status: payment[7],
        currency: payment[8]
      };
    } catch (error) {
      console.error('Error getting payment:', error);
      toast.error('Failed to get payment details');
      throw error;
    }
  }

  /**
   * Check if payment exists and is paid for a document
   * @param documentId Unique identifier for the document
   * @returns True if payment exists and is paid
   */
  async isDocumentPaid(documentId: string): Promise<boolean> {
    if (!this.isInitialized()) {
      throw new Error('Contract service not initialized');
    }

    try {
      return await this.contract!.isDocumentPaid(documentId);
    } catch (error) {
      console.error('Error checking if document is paid:', error);
      return false;
    }
  }

  /**
   * Get USDC balance of the current user
   * @returns USDC balance
   */
  async getUSDCBalance(): Promise<bigint> {
    if (!this.isInitialized() || !this.usdcContract) {
      throw new Error('Contract service not initialized');
    }

    try {
      const signerAddress = await this.signer!.getAddress();
      return await this.usdcContract.balanceOf(signerAddress);
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Get USDC decimals
   * @returns Number of decimals for USDC token
   */
  async getUSDCDecimals(): Promise<number> {
    if (!this.isInitialized() || !this.usdcContract) {
      throw new Error('Contract service not initialized');
    }

    try {
      return await this.usdcContract.decimals();
    } catch (error) {
      console.error('Error getting USDC decimals:', error);
      return 6; // Default for USDC
    }
  }

  /**
   * Format ether amount to a human-readable string
   * @param wei Amount in wei
   * @returns Formatted string in ETH
   */
  formatEther(wei: bigint): string {
    return ethers.formatEther(wei);
  }

  /**
   * Parse ether string to wei
   * @param ether Amount in ETH
   * @returns Wei as bigint
   */
  parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  /**
   * Format USDC amount to a human-readable string
   * @param amount Amount in USDC (with decimals)
   * @param decimals Number of decimals for USDC token
   * @returns Formatted string in USDC
   */
  formatUSDC(amount: bigint, decimals: number = 6): string {
    return ethers.formatUnits(amount, decimals);
  }

  /**
   * Parse USDC string to amount with decimals
   * @param amount Amount in USDC
   * @param decimals Number of decimals for USDC token
   * @returns Amount with decimals as bigint
   */
  parseUSDC(amount: string, decimals: number = 6): bigint {
    return ethers.parseUnits(amount, decimals);
  }
}

// Export singleton instance
export const contractService = new ContractService();

// Add Ethereum provider type to window
declare global {
  interface Window {
    ethereum?: any;
  }
}
