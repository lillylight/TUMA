
import { useEffect, useState } from "react";
import { Check, ChevronDown, Edit2, Gem, LogOut, Settings, Shield, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { toast } from "@/components/ui/sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("Alex Johnson");
  const [editName, setEditName] = useState(displayName);
  
  const handleSaveProfile = () => {
    setDisplayName(editName);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };
  
  // Simulate loading user activity
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
  
  // Connected apps (simulated)
  const connectedApps = [
    { id: 1, name: "Google Drive", connected: true, date: "Oct 10, 2023" },
    { id: 2, name: "Dropbox", connected: true, date: "Oct 8, 2023" },
    { id: 3, name: "Microsoft OneDrive", connected: false, date: "Not connected" },
    { id: 4, name: "Slack", connected: false, date: "Not connected" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 page-transition">
      <Header />
      
      <main className="pt-28 px-6 pb-16 max-w-7xl mx-auto">
        <div className="glass-panel p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center">
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
                  <p className="text-doc-medium-gray">alex.johnson@example.com</p>
                </>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <div className="flex items-center mb-2">
                <Gem size={16} className="text-blue-600 mr-1.5" />
                <span className="text-sm font-medium">Premium User</span>
              </div>
              <div className="text-xs text-doc-medium-gray">Member since October 2022</div>
            </div>
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
              <h2 className="text-xl font-bold mb-4">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-doc-medium-gray">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-3 py-1.5 bg-doc-deep-blue text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                    Enable
                  </button>
                </div>
                
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium mb-1">Change Password</h3>
                    <p className="text-sm text-doc-medium-gray">Update your password regularly for better security</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                    Update
                  </button>
                </div>
                
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium mb-1">Sessions</h3>
                    <p className="text-sm text-doc-medium-gray">Manage your active sessions and sign out remotely</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                    View All
                  </button>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-red-600 mb-1">Danger Zone</h3>
                    <p className="text-sm text-doc-medium-gray">Sign out from all devices</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors">
                    <LogOut size={14} className="mr-1.5" />
                    Sign Out All
                  </button>
                </div>
              </div>
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
  // Simple representation of app icons
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
