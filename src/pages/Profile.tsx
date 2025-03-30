
import { useState, useEffect } from "react";
import { User, Wallet, FileText, Download, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - would be fetched from blockchain in a real implementation
const MOCK_DATA = {
  documentsShared: 12,
  documentsReceived: 8,
  storageUsed: 45.2,
  walletBalance: 0.05,
  recentActivity: [
    {
      type: "shared",
      documentName: "Project Proposal.pdf",
      recipient: "0x1a2b...3c4d",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      type: "received",
      documentName: "Meeting Notes.docx",
      sender: "0x5e6f...7g8h",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      type: "funded",
      amount: 0.05,
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
    },
  ],
};

const Profile = () => {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<"profile" | "funding">("profile");
  const [emailNotifications, setEmailNotifications] = useState(false);

  // In a real app, fetch this data from blockchain or API
  const [userData, setUserData] = useState(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const handleFundWallet = (amount: number | string) => {
    // Open Coinbase offramp integration
    console.log(`Funding wallet with ${amount} ETH`);
    // In a real implementation, this would integrate with Coinbase's offramp API
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 page-transition">
      <Header />
      
      <main className="pt-28 px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight dark:text-white">Dashboard</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === "profile" ? "default" : "outline"} 
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2"
            >
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </Button>
            <Button 
              variant={activeTab === "funding" ? "default" : "outline"} 
              onClick={() => setActiveTab("funding")}
              className="flex items-center gap-2"
            >
              <Wallet size={18} />
              <span className="hidden sm:inline">Fund Wallet</span>
            </Button>
          </div>
        </div>
        
        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main profile area */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {address ? address.charAt(2).toUpperCase() : "?"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">Your Profile</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Documents Shared</h3>
                  <p className="text-3xl font-bold dark:text-white">{userData.documentsShared}</p>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Documents Received</h3>
                  <p className="text-3xl font-bold dark:text-white">{userData.documentsReceived}</p>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Storage Used</h3>
                  <p className="text-3xl font-bold dark:text-white">{userData.storageUsed} MB</p>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet Balance</h3>
                  <p className="text-3xl font-bold dark:text-white">{userData.walletBalance} ETH</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Account Settings</h3>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white">Email Notifications</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive email notifications when documents are shared with you</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="link" className="text-blue-600 dark:text-blue-400">
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Recent Activity</h3>
                
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-sm space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                        ${activity.type === 'shared' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 
                          activity.type === 'received' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' :
                          'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'}`
                      }>
                        {activity.type === 'shared' ? (
                          <FileText size={16} />
                        ) : activity.type === 'received' ? (
                          <Download size={16} />
                        ) : (
                          <Wallet size={16} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium dark:text-white">
                          {activity.type === 'shared' ? 'Document Shared' : 
                           activity.type === 'received' ? 'Document Received' : 
                           'Wallet Funded'}
                        </p>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.type === 'shared' && `You shared "${activity.documentName}" with ${activity.recipient}`}
                          {activity.type === 'received' && `${activity.sender} shared "${activity.documentName}" with you`}
                          {activity.type === 'funded' && `You added ${activity.amount} ETH to your wallet`}
                        </p>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Wallet Info</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                  <p className="text-2xl font-bold dark:text-white">{userData.walletBalance} ETH</p>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => setActiveTab("funding")}
                >
                  Fund Wallet
                </Button>
              </div>
              
              <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Storage Usage</h3>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Used: {userData.storageUsed} MB</span>
                  </div>
                  <Progress value={userData.storageUsed} max={1000} className="h-2" />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You're using {userData.storageUsed} MB of storage.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Funding area */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl p-6 lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Fund Your Wallet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Purchase ETH to pay for document sharing and gas fees. Choose an amount below or enter a custom amount.
              </p>
              
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 shadow-sm mb-6">
                <p className="text-center mb-6 font-medium dark:text-white">Choose an amount to purchase:</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button 
                    variant="outline" 
                    className="h-16 text-lg dark:bg-gray-700/50"
                    onClick={() => handleFundWallet(10)}
                  >
                    $10
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 text-lg dark:bg-gray-700/50"
                    onClick={() => handleFundWallet(20)}
                  >
                    $20
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 text-lg dark:bg-gray-700/50"
                    onClick={() => handleFundWallet(50)}
                  >
                    $50
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 text-lg dark:bg-gray-700/50" 
                    onClick={() => handleFundWallet(100)}
                  >
                    $100
                  </Button>
                </div>
                
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Enter custom amount" 
                    className="w-full p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Purchase ETH"
                  )}
                </Button>
              </div>
              
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Why Fund Your Wallet?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</div>
                    <span className="dark:text-gray-300">Pay for document sharing services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</div>
                    <span className="dark:text-gray-300">Cover gas fees for blockchain transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</div>
                    <span className="dark:text-gray-300">Ensure smooth operation of the application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">•</div>
                    <span className="dark:text-gray-300">Access premium features and higher file size limits</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">About Funding</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  TUMA uses blockchain technology to securely share your documents. To use the service, you'll need ETH in your wallet to pay for:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 text-xs">•</div>
                    <span className="text-sm dark:text-gray-300">Document sharing fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 text-xs">•</div>
                    <span className="text-sm dark:text-gray-300">Gas fees for blockchain transactions</span>
                  </li>
                </ul>
              </div>
              
              <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-800/30 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Need Help?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you're having trouble funding your wallet or have questions about pricing, our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support →
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
