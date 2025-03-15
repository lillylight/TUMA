import { useEffect, useState } from "react";
import { Check, ChevronDown, Edit2, Gem, LogOut, Settings, Shield, User as UserIcon, Wallet, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useWallet } from "@/hooks/use-wallet";
import { contractService } from "@/lib/contract-service";
import { arweaveService } from "@/lib/arweave-service";

const Profile = () => {
  const { address, isConnected } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("User");
  const [editName, setEditName] = useState(displayName);
  const [balance, setBalance] = useState<string | null>(null);
  const [arweaveKey, setArweaveKey] = useState<any>(null);
  
  // Get wallet balance
  useEffect(() => {
    const getBalance = async () => {
      if (isConnected && address && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance));
        } catch (error) {
          console.error("Error getting balance:", error);
          setBalance(null);
        }
      }
    };
    
    getBalance();
  }, [address, isConnected]);
  
  // Generate Arweave key if not exists
  const generateArweaveKey = async () => {
    try {
      const key = await arweaveService.generateWallet();
      setArweaveKey(key);
      toast.success("Arweave wallet generated successfully");
    } catch (error) {
      console.error("Error generating Arweave wallet:", error);
      toast.error("Failed to generate Arweave wallet");
    }
  };
  
  const handleSaveProfile = () => {
    setDisplayName(editName);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };
  
  const [activityLoading, setActivityLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivityLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const recentActivity = [
    { id: 1, action: "Sent document", target: "Contract Draft.pdf", date: "Today, 10:23 AM" },
    { id: 2, action: "Received document", target: "Budget_Q3_2023.xlsx", date: "Yesterday, 4:45 PM" },
    { id: 3, action: "Updated profile", target: "", date: "Oct 15, 2023, 11:30 AM" },
    { id: 4, action: "Connected app", target: "", date: "Oct 12, 2023, 9:15 AM" },
  ];
  
  const connectedApps = [
    { id: 1, name: "Google Drive", connected: true, date: "Oct 10, 2023" },
    { id: 2, name: "Dropbox", connected: true, date: "Oct 8, 2023" },
    { id: 3, name: "Microsoft OneDrive", connected: false, date: "Not connected" },
    { id: 4, name: "Slack", connected: false, date: "Not connected" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 page-transition">
      <Header />
      
      <main className="pt-28 px-6 pb-16 max-w-7xl mx-auto">
        <div className="glass-panel p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center">
            {!isConnected ? (
              <div className="w-full p-6 text-center">
                <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Wallet Not Connected</h2>
                <p className="text-doc-medium-gray mb-4">
                  Please connect your wallet to view your profile information.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 md:mb-0 md:mr-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {displayName.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="max-w-lg animate-fade-in">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border-none bg-white rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="px-3 py-1.5 bg-doc-deep-blue text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditName(displayName);
                            setIsEditing(false);
                          }}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <h1 className="text-2xl font-bold mr-3">{displayName}</h1>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Edit profile"
                        >
                          <Edit2 size={16} className="text-doc-medium-gray" />
                        </button>
                      </div>
                      <p className="text-doc-medium-gray truncate">
                        {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Wallet not connected'}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                  <div className="flex items-center mb-2">
                    <Wallet size={16} className="text-blue-600 mr-1.5" />
                    <span className="text-sm font-medium">
                      {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading balance...'}
                    </span>
                  </div>
                  <div className="text-xs text-doc-medium-gray">Base Network</div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="glass-panel">
          <Tabs defaultValue="activity" className="w-full">
            <div className="p-1 bg-gray-100 rounded-t-xl">
              <TabsList className="p-1 bg-transparent gap-1">
                <TabsTrigger value="activity" className="gap-1.5 rounded-lg data-[state=active]:bg-white">
                  <ChevronDown size={16} />
                  <span>Activity</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-1.5 rounded-lg data-[state=active]:bg-white">
                  <Shield size={16} />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="connections" className="gap-1.5 rounded-lg data-[state=active]:bg-white">
                  <Settings size={16} />
                  <span>Connections</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="activity" className="p-6 m-0">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              
              {activityLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <ActivityIcon action={item.action} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.action}
                          {item.target && <span className="ml-1 font-normal">"{item.target}"</span>}
                        </p>
                        <p className="text-xs text-doc-medium-gray">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="security" className="m-0 p-6">
              <h2 className="text-xl font-bold mb-4">Wallet & Security</h2>
              
              {!isConnected ? (
                <div className="p-6 text-center">
                  <AlertCircle size={32} className="mx-auto text-yellow-500 mb-4" />
                  <p className="text-doc-medium-gray">
                    Please connect your wallet to access security settings.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium mb-1">Ethereum Wallet</h3>
                      <p className="text-sm text-doc-medium-gray">Your connected wallet on Base network</p>
                      <p className="text-sm font-mono mt-1">{address}</p>
                    </div>
                    <div className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
                      Connected
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium mb-1">Arweave Storage</h3>
                      <p className="text-sm text-doc-medium-gray">Decentralized document storage</p>
                      <p className="text-xs text-green-600 mt-1">
                        Automatically configured
                      </p>
                    </div>
                    <div className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
                      Active
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium mb-1">Transaction History</h3>
                      <p className="text-sm text-doc-medium-gray">View your document payment transactions</p>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                      View All
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-red-600 mb-1">Disconnect Wallet</h3>
                      <p className="text-sm text-doc-medium-gray">Disconnect your wallet from this application</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to disconnect your wallet?")) {
                          // Use the disconnect function from useWallet
                          const { disconnect } = useWallet();
                          disconnect();
                        }
                      }}
                      className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <LogOut size={14} className="mr-1.5" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="connections" className="m-0 p-6">
              <h2 className="text-xl font-bold mb-4">Connected Applications</h2>
              
              <div className="space-y-5">
                {connectedApps.map((app) => (
                  <div key={app.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                        <AppIcon name={app.name} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{app.name}</h3>
                        <p className="text-xs text-doc-medium-gray">
                          {app.connected ? `Connected on ${app.date}` : app.date}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        app.connected 
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                          : "bg-doc-deep-blue text-white hover:bg-blue-600"
                      }`}
                    >
                      {app.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const ActivityIcon = ({ action }: { action: string }) => {
  if (action.includes("Sent")) {
    return <ChevronDown size={18} className="text-green-600" />;
  } else if (action.includes("Received")) {
    return <ChevronDown size={18} className="text-blue-600" />;
  } else if (action.includes("Updated")) {
    return <Edit2 size={18} className="text-purple-600" />;
  } else if (action.includes("Connected")) {
    return <Check size={18} className="text-green-600" />;
  }
  
  return <UserIcon size={18} className="text-gray-600" />;
};

const AppIcon = ({ name }: { name: string }) => {
  if (name.includes("Google")) {
    return <div className="text-xl text-blue-600">G</div>;
  } else if (name.includes("Dropbox")) {
    return <div className="text-xl text-blue-500">D</div>;
  } else if (name.includes("Microsoft")) {
    return <div className="text-xl text-blue-700">M</div>;
  } else if (name.includes("Slack")) {
    return <div className="text-xl text-purple-600">S</div>;
  }
  
  return <div className="text-xl">A</div>;
};

export default Profile;
