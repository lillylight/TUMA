
import { useState } from "react";
import { Link, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ConnectButton = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnect = () => {
    if (connected) {
      // If already connected, toggle the extension open/close
      setIsOpen(!isOpen);
      return;
    }

    // Connect logic
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setIsOpen(true); // Auto-open when connected
      toast.success("Successfully connected");
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setIsOpen(false);
    toast.success("Successfully disconnected");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleConnect}
        disabled={connecting}
        className={`
          relative inline-flex items-center gap-2 px-4 py-2 rounded-full 
          transition-all duration-300 
          ${connected 
            ? "bg-green-100 text-green-700 hover:bg-green-200" 
            : "bg-doc-deep-blue text-white hover:bg-blue-600"}
          ${connecting ? "opacity-80 cursor-wait" : ""}
          shadow-sm hover:shadow
        `}
      >
        <Link size={16} className={connecting ? "animate-spin" : ""} />
        <span className="font-medium">
          {connecting 
            ? "Connecting..." 
            : connected 
              ? "Connected" 
              : "Connect"
          }
        </span>
        
        {connected && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle" />
        )}
      </button>

      {/* Extension popup */}
      {isOpen && connected && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-scale-in z-50">
          <div className="p-4 bg-gradient-to-r from-doc-deep-blue to-blue-500">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">DocuExchange</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-2 bg-white/10 text-white text-sm p-2 rounded">
              <p className="truncate">Connected as: user@example.com</p>
            </div>
          </div>
          
          <div className="p-2">
            <button 
              onClick={() => handleNavigation('/documents')}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </span>
              <span>My Documents</span>
            </button>
            
            <button 
              onClick={() => handleNavigation('/send')}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </span>
              <span>Send Document</span>
            </button>
            
            <button 
              onClick={() => handleNavigation('/profile')}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <span>Profile</span>
            </button>
            
            <div className="h-px bg-gray-200 my-2"></div>
            
            <button 
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;
