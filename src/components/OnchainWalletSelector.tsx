
import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Wallet, 
  ConnectWallet, 
  WalletDropdown,
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { useOnchainWallet } from '@/hooks/use-onchain-wallet';

interface OnchainWalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnchainWalletSelector = ({ isOpen, onClose }: OnchainWalletSelectorProps) => {
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
          <Wallet>
            <ConnectWallet className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Connect Wallet
            </ConnectWallet>
          </Wallet>
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

export default OnchainWalletSelector;
