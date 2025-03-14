
import { useState } from "react";
import { ArrowDownToLine, ArrowUpToLine, File, FilePenLine, FileSearch, Folder, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const receivedDocs = [
    { id: 1, name: "Project Proposal.pdf", sender: "Alice Chen", date: "Today", size: "1.2 MB", type: "pdf" },
    { id: 2, name: "Budget_Q3_2023.xlsx", sender: "Finance Team", date: "Yesterday", size: "845 KB", type: "xlsx" },
    { id: 3, name: "Meeting Minutes.docx", sender: "John Smith", date: "Oct 15, 2023", size: "320 KB", type: "docx" },
    { id: 4, name: "Product Research.pptx", sender: "Marketing", date: "Oct 12, 2023", size: "4.5 MB", type: "pptx" },
    { id: 5, name: "Legal Agreement.pdf", sender: "Legal Dept.", date: "Oct 7, 2023", size: "1.8 MB", type: "pdf" },
  ];
  
  const sentDocs = [
    { id: 1, name: "Design Assets.zip", recipient: "Design Team", date: "Today", size: "8.2 MB", type: "zip" },
    { id: 2, name: "Contract Draft.pdf", recipient: "Sarah Johnson", date: "Yesterday", size: "1.1 MB", type: "pdf" },
    { id: 3, name: "Quarterly Report.pdf", recipient: "Board Members", date: "Oct 14, 2023", size: "2.3 MB", type: "pdf" },
  ];
  
  const filteredReceived = receivedDocs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSent = sentDocs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 page-transition">
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
                className="pl-10 pr-4 py-2 w-full border-none bg-white bg-opacity-80 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-doc-medium-gray mr-2">Sort by:</span>
              <select className="bg-white bg-opacity-80 rounded-lg border-none px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
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
              {filteredReceived.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Sender</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Size</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReceived.map((doc) => (
                        <tr 
                          key={doc.id}
                          className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <DocumentIcon type={doc.type} />
                              <span className="ml-3 font-medium">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">{doc.sender}</td>
                          <td className="py-3 px-4 text-doc-medium-gray">{doc.date}</td>
                          <td className="py-3 px-4 text-doc-medium-gray">{doc.size}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 transition-colors text-doc-deep-blue"
                                title="View document"
                              >
                                <FileSearch size={16} />
                              </button>
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 transition-colors text-doc-deep-blue"
                                title="Download"
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
              {filteredSent.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Recipient</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Size</th>
                        <th className="text-left py-3 px-4 font-medium text-doc-medium-gray">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSent.map((doc) => (
                        <tr 
                          key={doc.id}
                          className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <DocumentIcon type={doc.type} />
                              <span className="ml-3 font-medium">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-doc-medium-gray">{doc.recipient}</td>
                          <td className="py-3 px-4 text-doc-medium-gray">{doc.date}</td>
                          <td className="py-3 px-4 text-doc-medium-gray">{doc.size}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 transition-colors text-doc-deep-blue"
                                title="View document"
                              >
                                <FileSearch size={16} />
                              </button>
                              <button 
                                className="p-1.5 rounded-full hover:bg-blue-100 transition-colors text-doc-deep-blue"
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
