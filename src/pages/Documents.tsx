
import { useState, useEffect } from "react";
import { ArrowDownToLine, ArrowUpToLine, File, FilePenLine, FileSearch, Folder, Search, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useWallet } from "@/hooks/use-wallet";
import { arweaveService, StoredFile } from "@/lib/arweave-service";
import { contractService } from "@/lib/contract-service";
import { format } from "date-fns";

interface FileWithPayment extends StoredFile {
  isPaid?: boolean;
}

const Documents = () => {
  const { address, isConnected } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [receivedDocs, setReceivedDocs] = useState<FileWithPayment[]>([]);
  const [sentDocs, setSentDocs] = useState<FileWithPayment[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch documents from Arweave
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch received documents
        const received = await arweaveService.getReceivedFiles(address);
        
        // Fetch sent documents
        const sent = await arweaveService.getSentFiles(address);
        
        // Check payment status for each document
        const receivedWithPayment = await Promise.all(
          received.map(async (doc) => {
            try {
              const isPaid = await contractService.isDocumentPaid(doc.id);
              return { ...doc, isPaid };
            } catch (error) {
              console.error(`Error checking payment for document ${doc.id}:`, error);
              return { ...doc, isPaid: false };
            }
          })
        );
        
        const sentWithPayment = await Promise.all(
          sent.map(async (doc) => {
            try {
              const isPaid = await contractService.isDocumentPaid(doc.id);
              return { ...doc, isPaid };
            } catch (error) {
              console.error(`Error checking payment for document ${doc.id}:`, error);
              return { ...doc, isPaid: false };
            }
          })
        );
        
        setReceivedDocs(receivedWithPayment);
        setSentDocs(sentWithPayment);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to fetch documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [address, isConnected]);
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show "Today"
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Otherwise, show formatted date
    return format(date, "MMM d, yyyy");
  };
  
  // Format file size
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(0)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  const filteredReceived = receivedDocs.filter(doc => 
    doc.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.metadata.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSent = sentDocs.filter(doc => 
    doc.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.metadata.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Download file
  const downloadFile = async (docId: string, fileName: string) => {
    try {
      const { data, metadata } = await arweaveService.getFile(docId);
      
      // Create blob from data
      const blob = new Blob([data], { type: metadata.type || 'application/octet-stream' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 page-transition">
      <Header />
      
      <main className="pt-28 px-6 pb-16 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Documents</h1>
          <p className="text-doc-medium-gray">View and manage all your sent and received documents</p>
        </div>
        
        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-doc-medium-gray" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 w-full border-none bg-white dark:bg-gray-700 bg-opacity-80 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-doc-medium-gray mr-2">Sort by:</span>
              <select className="bg-white dark:bg-gray-700 bg-opacity-80 rounded-lg border-none px-3 py-2 text-sm text-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none">
                <option>Date (Newest)</option>
                <option>Date (Oldest)</option>
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
                <option>Size (Largest)</option>
                <option>Size (Smallest)</option>
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="received" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="received" className="flex items-center gap-2">
                <ArrowDownToLine size={16} />
                <span>Received</span>
                <span className="ml-1 bg-doc-soft-blue text-doc-deep-blue text-xs px-1.5 py-0.5 rounded-full">
                  {receivedDocs.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <ArrowUpToLine size={16} />
                <span>Sent</span>
                <span className="ml-1 bg-doc-soft-blue text-doc-deep-blue text-xs px-1.5 py-0.5 rounded-full">
                  {sentDocs.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="received" className="mt-0">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin mx-auto h-12 w-12 border-4 border-doc-deep-blue border-t-transparent rounded-full"></div>
                  <h3 className="mt-4 text-lg font-medium">Loading documents...</h3>
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500 opacity-80" />
                  <h3 className="mt-4 text-lg font-medium">Error loading documents</h3>
                  <p className="mt-1 text-doc-medium-gray">{error}</p>
                </div>
              ) : filteredReceived.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Sender</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Size</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReceived.map((doc) => (
                        <tr 
                          key={doc.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <DocumentIcon type={doc.metadata.type.split('/')[1] || 'file'} />
                              <span className="ml-3 font-medium">{doc.metadata.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">
                            {doc.metadata.sender.slice(0, 6)}...{doc.metadata.sender.slice(-4)}
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">
                            {formatDate(doc.metadata.timestamp)}
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">
                            {formatFileSize(doc.metadata.size)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              doc.isPaid 
                                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300" 
                                : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                            }`}>
                              {doc.isPaid ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-doc-deep-blue"
                                title="View document"
                                onClick={() => downloadFile(doc.id, doc.metadata.name)}
                              >
                                <FileSearch size={16} />
                              </button>
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-doc-deep-blue"
                                title="Download"
                                onClick={() => downloadFile(doc.id, doc.metadata.name)}
                              >
                                <ArrowDownToLine size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Folder className="mx-auto h-12 w-12 text-doc-medium-gray opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                  <p className="mt-1 text-doc-medium-gray">
                    {searchQuery ? "Try adjusting your search" : "You haven't received any documents yet"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sent" className="mt-0">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin mx-auto h-12 w-12 border-4 border-doc-deep-blue border-t-transparent rounded-full"></div>
                  <h3 className="mt-4 text-lg font-medium">Loading documents...</h3>
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500 opacity-80" />
                  <h3 className="mt-4 text-lg font-medium">Error loading documents</h3>
                  <p className="mt-1 text-doc-medium-gray">{error}</p>
                </div>
              ) : filteredSent.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Recipient</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Size</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSent.map((doc) => (
                        <tr 
                          key={doc.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <DocumentIcon type={doc.metadata.type.split('/')[1] || 'file'} />
                              <span className="ml-3 font-medium">{doc.metadata.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">
                            {doc.metadata.recipient.slice(0, 6)}...{doc.metadata.recipient.slice(-4)}
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">
                            {formatDate(doc.metadata.timestamp)}
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">
                            {formatFileSize(doc.metadata.size)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              doc.isPaid 
                                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300" 
                                : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                            }`}>
                              {doc.isPaid ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-doc-deep-blue"
                                title="View document"
                                onClick={() => downloadFile(doc.id, doc.metadata.name)}
                              >
                                <FileSearch size={16} />
                              </button>
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-doc-deep-blue"
                                title="Edit"
                              >
                                <FilePenLine size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Folder className="mx-auto h-12 w-12 text-doc-medium-gray opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                  <p className="mt-1 text-doc-medium-gray">
                    {searchQuery ? "Try adjusting your search" : "You haven't sent any documents yet"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const DocumentIcon = ({ type }: { type: string }) => {
  const getColorByType = () => {
    switch (type) {
      case 'pdf': return 'text-red-500';
      case 'docx': return 'text-blue-600';
      case 'xlsx': return 'text-green-600';
      case 'pptx': return 'text-orange-500';
      case 'zip': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return <File size={20} className={getColorByType()} />;
};

export default Documents;
