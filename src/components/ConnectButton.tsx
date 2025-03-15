
import { Link, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWallet } from "@/hooks/use-wallet";

const ConnectButton = () => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  const navigate = useNavigate();

  const handleConnect = () => {
    if (isConnected) {
      // Already connected
      return;
    }

    // Connect wallet
    connect();
  };

  const handleDisconnect = () => {
    // Add a fade-out animation to the current page
    document.body.classList.add('fade-exit-active');
    
    // Wait for animation to complete before disconnecting
    setTimeout(() => {
      disconnect();
      
      // Navigate to landing page with a smooth transition
      navigate('/landing');
      
      // Remove the animation class after navigation
      setTimeout(() => {
        document.body.classList.remove('fade-exit-active');
        document.body.classList.add('fade-enter-active');
        
        // Remove the enter animation class after it completes
        setTimeout(() => {
          document.body.classList.remove('fade-enter-active');
        }, 300);
      }, 100);
    }, 300);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={!isConnected ? handleConnect : undefined}
          disabled={isConnecting}
          className={`
            relative inline-flex items-center gap-2 px-4 py-2 rounded-full 
            transition-all duration-300 
            ${isConnected 
              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900/70" 
              : "bg-doc-deep-blue text-white hover:bg-blue-600 dark:bg-blue-800 dark:hover:bg-blue-700"}
            ${isConnecting ? "opacity-80 cursor-wait" : ""}
            shadow-sm hover:shadow
          `}
        >
          {isConnected ? (
            <User size={16} />
          ) : (
            <Link size={16} className={isConnecting ? "animate-spin" : ""} />
          )}
          <span className="font-medium">
            {isConnecting 
              ? "Connecting..." 
              : isConnected 
                ? "Connected" 
                : "Connect"
            }
          </span>
          
          {isConnected && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle" />
          )}
        </button>
      </PopoverTrigger>
      
      {isConnected && (
        <PopoverContent className="w-72 p-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-doc-deep-blue to-blue-500 dark:from-blue-900 dark:to-blue-700">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">TUMA</h3>
              <span className="text-white/80 text-sm">Connected</span>
            </div>
            <div className="mt-2 bg-white/10 text-white text-sm p-2 rounded">
              <p className="truncate">Connected as: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Unknown'}</p>
            </div>
          </div>
          
          <div className="p-2">
            <button 
              onClick={() => handleNavigation('/documents')}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </span>
              <span>My Documents</span>
            </button>
            
            <button 
              onClick={() => handleNavigation('/send')}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </span>
              <span>Send Document</span>
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
            
            <button 
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span>Disconnect</span>
            </button>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default ConnectButton;
