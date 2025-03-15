import { useState, useEffect } from "react";
import { FileUp, Send as SendIcon, User, Users, X, AlertCircle, Coins } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useWallet } from "@/hooks/use-wallet";
import { arweaveService, DocumentMetadata } from "@/lib/arweave-service";
import { contractService, PaymentCurrency } from "@/lib/contract-service";
import { ethers } from "ethers";

const Send = () => {
  const { address, isConnected } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("0.01");
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentCurrency>(PaymentCurrency.ETH);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [usdcDecimals, setUsdcDecimals] = useState<number>(6);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!file) {
      toast.error("Please select a file to send");
      return;
    }
    
    if (!recipient) {
      toast.error("Please enter a recipient");
      return;
    }

    if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
      toast.error("Please enter a valid recipient wallet address");
      return;
    }
    
    try {
      // Start sending process
      setSending(true);
      
      // 1. Upload document to Arweave
      const metadata: DocumentMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        sender: address || "",
        recipient: recipientAddress,
        timestamp: Date.now(),
        description: message || undefined
      };
      
      // Generate a unique document ID
      const tempDocId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setDocumentId(tempDocId);
      
      // Show payment confirmation
      setShowPaymentConfirmation(true);
      setSending(false);
    } catch (error) {
      console.error("Error preparing document:", error);
      toast.error("Failed to prepare document for sending");
      setSending(false);
    }
  };

  const [calculatedFee, setCalculatedFee] = useState<string | null>(null);
  const [calculatedFeeWei, setCalculatedFeeWei] = useState<bigint | null>(null);
  const [fileSizeTier, setFileSizeTier] = useState<string | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isResolvingName, setIsResolvingName] = useState(false);

  // Calculate fee when file changes
  useEffect(() => {
    const calculateFeeForFile = async () => {
      if (file && isConnected && contractService.isInitialized()) {
        try {
          const { fee, tier } = await contractService.calculateFee(file.size);
          setCalculatedFeeWei(fee);
          setCalculatedFee(contractService.formatEther(fee));
          setFileSizeTier(contractService.getTierName(tier));
          setPaymentAmount(contractService.formatEther(fee));
        } catch (error) {
          console.error("Error calculating fee:", error);
          setCalculatedFee(null);
          setCalculatedFeeWei(null);
          setFileSizeTier(null);
        }
      }
    };

    calculateFeeForFile();
  }, [file, isConnected]);

  // Get USDC balance and decimals
  useEffect(() => {
    const getUSDCInfo = async () => {
      if (isConnected && contractService.isInitialized()) {
        try {
          const balance = await contractService.getUSDCBalance();
          const decimals = await contractService.getUSDCDecimals();
          setUsdcBalance(balance);
          setUsdcDecimals(decimals);
        } catch (error) {
          console.error("Error getting USDC info:", error);
        }
      }
    };

    getUSDCInfo();
  }, [isConnected]);

  // Resolve ENS or Base name when recipient changes
  useEffect(() => {
    const resolveRecipientName = async () => {
      if (recipientAddress && recipientAddress.includes('.') && isConnected && contractService.isInitialized()) {
        setIsResolvingName(true);
        try {
          const resolved = await contractService.resolveName(recipientAddress);
          setResolvedAddress(resolved);
          setIsResolvingName(false);
        } catch (error) {
          console.error("Error resolving name:", error);
          setResolvedAddress(null);
          setIsResolvingName(false);
        }
      } else if (recipientAddress && ethers.isAddress(recipientAddress)) {
        setResolvedAddress(recipientAddress);
      } else {
        setResolvedAddress(null);
      }
    };

    resolveRecipientName();
  }, [recipientAddress, isConnected]);

  const confirmPaymentAndSend = async () => {
    if (!file || !recipientAddress || !documentId) return;
    
    // Use resolved address if available, otherwise use the input address
    const finalRecipientAddress = resolvedAddress || recipientAddress;
    
    // Validate the final address
    if (!ethers.isAddress(finalRecipientAddress)) {
      toast.error("Invalid recipient address");
      return;
    }
    
    try {
      setSending(true);
      
      // Process payment via smart contract with file size
      let txHash: string;
      
      if (paymentMethod === PaymentCurrency.ETH) {
        // Pay with ETH
        const amountWei = contractService.parseEther(paymentAmount);
        txHash = await contractService.payForDocumentWithETH(documentId, finalRecipientAddress, file.size, amountWei);
      } else {
        // Pay with USDC
        // Convert ETH amount to USDC amount (assuming 1:1 for simplicity)
        // In a real app, you would use an oracle to get the exchange rate
        const usdcAmount = contractService.parseUSDC(paymentAmount, usdcDecimals);
        txHash = await contractService.payForDocumentWithUSDC(documentId, finalRecipientAddress, file.size, usdcAmount);
      }
      
      // Upload to Arweave after payment is confirmed
      const metadata: DocumentMetadata = {
        name: file.name,
        type: file.type,
        size: file.size,
        sender: address || "",
        recipient: finalRecipientAddress,
        timestamp: Date.now(),
        description: message || undefined
      };
      
      // Upload to Arweave with automatic wallet generation
      const arweaveId = await arweaveService.uploadDocument(file, metadata, address);
      
      toast.success("Document sent successfully!");
      
      // Reset form
      setFile(null);
      setRecipient("");
      setRecipientAddress("");
      setMessage("");
      setPaymentAmount("0.01");
      setCalculatedFee(null);
      setCalculatedFeeWei(null);
      setFileSizeTier(null);
      setResolvedAddress(null);
      setShowPaymentConfirmation(false);
      setDocumentId("");
    } catch (error) {
      console.error("Error sending document:", error);
      toast.error("Failed to send document");
    } finally {
      setSending(false);
    }
  };

  const cancelSend = () => {
    setShowPaymentConfirmation(false);
    setDocumentId("");
  };

  const recentRecipients = [
    { id: 1, name: "Alice Chen", email: "alice@example.com" },
    { id: 2, name: "John Smith", email: "john@example.com" },
    { id: 3, name: "Finance Team", email: "finance@example.com" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 page-transition">
      <Header />
      
      <main className="pt-28 px-6 pb-16 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Send Documents</h1>
          <p className="text-doc-medium-gray">
            Share documents securely with individuals or teams
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="glass-panel p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">
                    Select Document
                  </label>
                  {!file ? (
                    <div className="border-2 border-dashed border-doc-pale-gray dark:border-gray-600 rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-doc-medium-gray mb-3" />
                      <p className="text-doc-medium-gray mb-4">
                        Drag and drop a file here, or click to select
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-doc-deep-blue text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <FileUp size={16} className="mr-2" />
                        Select File
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 bg-doc-soft-blue dark:bg-blue-900/30 rounded-lg animate-scale-in">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center">
                          <FileUp size={24} className="text-doc-deep-blue" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-doc-medium-gray">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors text-doc-medium-gray"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                  <div className="mb-6">
                    <label 
                      htmlFor="recipient"
                      className="block text-sm font-medium mb-2"
                    >
                      Recipient Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-doc-medium-gray" />
                      </div>
                      <input
                        type="text"
                        id="recipient"
                        placeholder="Recipient name or organization"
                        className="pl-10 w-full bg-white dark:bg-gray-700 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none py-3 text-gray-800 dark:text-white"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label 
                      htmlFor="recipientAddress"
                      className="block text-sm font-medium mb-2"
                    >
                      Recipient Wallet Address or ENS/Base Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-doc-medium-gray">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <path d="M22 10H2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="recipientAddress"
                        placeholder="0x... or name.eth or name.base"
                        className="pl-10 w-full bg-white dark:bg-gray-700 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none py-3 text-gray-800 dark:text-white"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                      {isResolvingName && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {resolvedAddress && (
                      <p className="text-xs text-green-600 mt-1">
                        Resolved to: {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}
                      </p>
                    )}
                    <p className="text-xs text-doc-medium-gray mt-1">
                      Enter the recipient's Ethereum address, ENS name, or Base name
                    </p>
                  </div>

                <div className="mb-8">
                  <label 
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Add a message to the recipient..."
                    className="w-full bg-white dark:bg-gray-700 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none py-3 px-4 text-gray-800 dark:text-white"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {!showPaymentConfirmation ? (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sending || !isConnected}
                      className={`
                        inline-flex items-center px-6 py-3 rounded-lg
                        ${sending
                          ? "bg-blue-400 cursor-not-allowed"
                          : !isConnected
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-doc-deep-blue hover:bg-blue-600"}
                        text-white font-medium transition-colors
                      `}
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Preparing...
                        </>
                      ) : !isConnected ? (
                        <>
                          <AlertCircle size={18} className="mr-2" />
                          Connect Wallet First
                        </>
                      ) : (
                        <>
                          <SendIcon size={18} className="mr-2" />
                          Prepare to Send
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-lg mb-3">Payment Confirmation</h3>
                    <p className="text-doc-medium-gray mb-4">
                      To send this document securely, a small payment is required to cover network fees.
                    </p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Payment Method
                      </label>
                      <div className="flex space-x-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod(PaymentCurrency.ETH)}
                          className={`
                            flex-1 py-2 px-4 rounded-lg flex items-center justify-center
                            ${paymentMethod === PaymentCurrency.ETH
                              ? "bg-doc-deep-blue text-white"
                              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"}
                            transition-colors
                          `}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                          </svg>
                          ETH
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod(PaymentCurrency.USDC)}
                          className={`
                            flex-1 py-2 px-4 rounded-lg flex items-center justify-center
                            ${paymentMethod === PaymentCurrency.USDC
                              ? "bg-doc-deep-blue text-white"
                              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"}
                            transition-colors
                          `}
                        >
                          <Coins size={16} className="mr-2" />
                          USDC
                        </button>
                      </div>
                      
                      <label className="block text-sm font-medium mb-2">
                        {paymentMethod === PaymentCurrency.ETH ? "Payment Amount (ETH)" : "Payment Amount (USDC)"}
                      </label>
                      <input
                        type="text"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full bg-white dark:bg-gray-700 border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none py-2 px-3 text-gray-800 dark:text-white"
                      />
                      {calculatedFee && fileSizeTier && (
                        <div className="mt-2 text-sm">
                          <p className="text-doc-medium-gray">
                            Calculated fee: <span className="font-medium text-doc-deep-blue">
                              {paymentMethod === PaymentCurrency.ETH 
                                ? `${calculatedFee} ETH` 
                                : `${calculatedFee} USDC`}
                            </span>
                          </p>
                          <p className="text-doc-medium-gray">
                            File size tier: <span className="font-medium text-doc-deep-blue">{fileSizeTier}</span>
                          </p>
                          <p className="text-xs text-doc-medium-gray mt-1">
                            This fee covers both document storage and transaction costs
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={confirmPaymentAndSend}
                        disabled={sending}
                        className={`
                          flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg
                          ${sending
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-doc-deep-blue hover:bg-blue-600"}
                          text-white font-medium transition-colors
                        `}
                      >
                        {sending ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <SendIcon size={16} className="mr-2" />
                            Pay & Send
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={cancelSend}
                        disabled={sending}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          
          <div>
            <div className="glass-panel p-6">
              <div className="flex items-center mb-4">
                <Users size={18} className="text-doc-deep-blue mr-2" />
                <h3 className="font-medium">Recent Recipients</h3>
              </div>
              <div className="space-y-3">
                {recentRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    onClick={() => setRecipient(recipient.email)}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-doc-soft-blue dark:hover:bg-blue-900/30 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-doc-deep-blue text-white flex items-center justify-center mr-3">
                      {recipient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-xs text-doc-medium-gray">{recipient.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6 mt-6">
              <h3 className="font-medium mb-4">Send Tips</h3>
              <ul className="space-y-3 text-sm text-doc-medium-gray">
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Files are encrypted end-to-end for security
                </li>
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Maximum file size is 100MB
                </li>
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Recipients will receive an email notification
                </li>
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Documents exist forever, only pay once
                </li>
              </ul>
            </div>
            
            <div className="glass-panel p-6 mt-6">
              <h3 className="font-medium mb-4">Pricing Tiers</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-doc-medium-gray">Up to 20MB:</span>
                  <span className="font-medium">$1.00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-doc-medium-gray">21MB to 50MB:</span>
                  <span className="font-medium">$2.00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-doc-medium-gray">51MB to 100MB:</span>
                  <span className="font-medium">$3.00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Send;
