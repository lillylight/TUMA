
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import { createSmartAccount } from '@/lib/smart-account';

// Create wallet context
interface OnchainWalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  error: Error | null;
  smartAccount: { address: string; owner: string } | null;
}

const OnchainWalletContext = createContext<OnchainWalletContextType>({
  address: undefined,
  isConnected: false,
  isConnecting: false,
  connect: () => {},
  disconnect: () => {},
  error: null,
  smartAccount: null
});

export const useOnchainWallet = () => useContext(OnchainWalletContext);

// OnchainWallet provider component
interface OnchainWalletProviderProps {
  children: ReactNode;
}

export const OnchainWalletProvider = ({ children }: OnchainWalletProviderProps) => {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [smartAccount, setSmartAccount] = useState<{ address: string; owner: string } | null>(null);

  // When wallet connects, create a smart account
  useEffect(() => {
    const setupSmartAccount = async () => {
      if (isConnected && address && window.ethereum) {
        try {
          const account = await createSmartAccount(window.ethereum);
          setSmartAccount(account);
        } catch (err) {
          console.error('Error creating smart account:', err);
          toast.error('Failed to create smart account');
        }
      } else {
        setSmartAccount(null);
      }
    };

    setupSmartAccount();
  }, [isConnected, address]);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Find the Coinbase Wallet connector
      const connector = connectors.find(c => c.id === 'coinbaseWallet') || connectors[0];
      
      if (connector) {
        await connectAsync({ connector });
        toast.success('Wallet connected successfully');
      } else {
        toast.error('No wallet connectors available');
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await wagmiDisconnect();
      setSmartAccount(null);
      toast.success('Wallet disconnected');
    } catch (err) {
      console.error('Disconnection error:', err);
      toast.error('Failed to disconnect wallet');
    }
  };

  return (
    <OnchainWalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting: isConnecting || isPending,
        connect,
        disconnect,
        error,
        smartAccount
      }}
    >
      {children}
    </OnchainWalletContext.Provider>
  );
};

export default OnchainWalletProvider;
