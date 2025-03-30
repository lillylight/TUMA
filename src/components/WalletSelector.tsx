
import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => void;
}

const WalletSelector = ({ isOpen, onClose, onConnect }: WalletSelectorProps) => {
  const [isCreatingSmartWallet, setIsCreatingSmartWallet] = useState(false);

  const handleConnectWallet = (walletType: string) => {
    onConnect(walletType);
    onClose();
  };

  const handleCreateSmartWallet = async () => {
    try {
      setIsCreatingSmartWallet(true);
      // In a real implementation, this would create a Base Smart Wallet
      // For now, we'll just simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After creation, we would connect to it
      onConnect('coinbaseWallet');
      toast.success('Base Smart Wallet created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating smart wallet:', error);
      toast.error('Failed to create Base Smart Wallet');
    } finally {
      setIsCreatingSmartWallet(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to TUMA
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Coinbase Wallet */}
          <button
            onClick={() => handleConnectWallet('coinbaseWallet')}
            className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.png" 
                alt="Coinbase Wallet" 
                className="w-8 h-8"
              />
              <div className="text-left">
                <p className="font-medium">Coinbase Wallet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Connect to your Coinbase wallet</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
          
          {/* MetaMask */}
          <button
            onClick={() => handleConnectWallet('metaMask')}
            className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="w-8 h-8"
              />
              <div className="text-left">
                <p className="font-medium">MetaMask</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Connect to your MetaMask wallet</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
          
          {/* WalletConnect */}
          <button
            onClick={() => handleConnectWallet('walletConnect')}
            className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.jpg" 
                alt="WalletConnect" 
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <p className="font-medium">WalletConnect</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Connect with WalletConnect</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
          
          {/* Base Smart Wallet */}
          <button
            onClick={handleCreateSmartWallet}
            disabled={isCreatingSmartWallet}
            className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://cryptologos.cc/logos/base-base-logo.png" 
                alt="Base Smart Wallet" 
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <p className="font-medium">Base Smart Wallet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create a new Base Smart Wallet</p>
              </div>
            </div>
            {isCreatingSmartWallet ? (
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            )}
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelector;
