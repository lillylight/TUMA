
import { useState } from "react";
import { Link } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ConnectButton = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    if (connected) {
      // Disconnect logic
      setConnected(false);
      toast.success("Successfully disconnected");
      return;
    }

    // Connect logic
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      toast.success("Successfully connected");
    }, 1500);
  };

  return (
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
  );
};

export default ConnectButton;
