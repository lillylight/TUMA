
import { useState } from "react";
import { Link, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useOnchainWallet } from "@/hooks/use-onchain-wallet";
import OnchainWalletSelector from "./OnchainWalletSelector";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect
} from '@coinbase/onchainkit/wallet';
import {
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance
} from '@coinbase/onchainkit/identity';

// Custom wrapper for WalletDropdownLink that handles navigation using React Router
const RouterLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className={className}
      onClick={() => navigate(href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(href);
        }
      }}
    >
      {children}
    </div>
  );
};

const ConnectButton = () => {
  const { address, isConnected, isConnecting, disconnect } = useOnchainWallet();
  const navigate = useNavigate();
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  const handleDisconnect = () => {
    document.body.classList.add('fade-exit-active');
    
    setTimeout(() => {
      disconnect();
      
      navigate('/landing');
      
      setTimeout(() => {
        document.body.classList.remove('fade-exit-active');
        document.body.classList.add('fade-enter-active');
        
        setTimeout(() => {
          document.body.classList.remove('fade-enter-active');
        }, 300);
      }, 100);
    }, 300);
  };

  return (
    <>
      <div className="relative">
        <Wallet>
          {!isConnected ? (
            <ConnectWallet
              className={`
                relative inline-flex items-center gap-2 px-4 py-2 rounded-full 
                transition-all duration-300 
                bg-doc-deep-blue text-white hover:bg-blue-600 dark:bg-blue-800 dark:hover:bg-blue-700
                ${isConnecting ? "opacity-80 cursor-wait" : ""}
                shadow-sm hover:shadow
              `}
            >
              <Link size={16} className={isConnecting ? "animate-spin" : ""} />
              <span className="font-medium">
                {isConnecting ? "Connecting..." : "Connect"}
              </span>
            </ConnectWallet>
          ) : (
            <PopoverTrigger
              className={`
                relative inline-flex items-center gap-2 px-4 py-2 rounded-full 
                transition-all duration-300 
                bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900/70
                shadow-sm hover:shadow
              `}
            >
              <User size={16} />
              <span className="font-medium">Connected</span>
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle" />
            </PopoverTrigger>
          )}
          
          <WalletDropdown>
            <Identity className="p-4 bg-gradient-to-r from-doc-deep-blue to-blue-500 dark:from-blue-900 dark:to-blue-700" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className="text-white/80" />
              <EthBalance className="text-white/80" />
            </Identity>
            
            <RouterLink
              href="/documents"
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              My Files
            </RouterLink>
            
            <RouterLink
              href="/send"
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Send File
            </RouterLink>
            
            <RouterLink
              href="/profile"
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              My Profile
            </RouterLink>
            
            <div 
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
              onClick={handleDisconnect}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleDisconnect();
                }
              }}
            >
              Disconnect
            </div>
          </WalletDropdown>
        </Wallet>
      </div>
      
      <OnchainWalletSelector 
        isOpen={isWalletSelectorOpen}
        onClose={() => setIsWalletSelectorOpen(false)}
      />
    </>
  );
};

export default ConnectButton;
