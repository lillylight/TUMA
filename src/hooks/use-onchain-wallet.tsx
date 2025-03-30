
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createWalletClient, getAccount, disconnect } from '@coinbase/onchainkit';
import { base, mainnet } from 'viem/chains';
import { toast } from 'sonner';

// Create wallet context
interface OnchainWalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (options?: any) => Promise<string | null>;
  disconnect: () => Promise<void>;
  error: Error | null;
}

const OnchainWalletContext = createContext<OnchainWalletContextType>({
  address: undefined,
  isConnected: false,
  isConnecting: false,
  connect: async () => null,
  disconnect: async () => {},
  error: null,
});

export const useOnchainWallet = () => useContext(OnchainWalletContext);

// Wallet provider component
interface OnchainWalletProviderProps {
  children: ReactNode;
}

export const OnchainWalletProvider = ({ children }: OnchainWalletProviderProps) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize wallet client
  const walletClient = createWalletClient({
    appName: 'TUMA Document Exchange',
    chain: base
  });

  // Check for existing connection on load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const account = await getAccount();
        if (account) {
          setAddress(account);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };
    
    checkConnection();
  }, []);
  
  // Connect function
  const connect = async (options?: any) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const account = await walletClient.connectWallet();
      
      if (account) {
        setAddress(account);
        setIsConnected(true);
        toast.success('Wallet connected successfully');
        return account;
      }
      return null;
    } catch (err) {
      console.error('Connection error:', err);
      const error = err instanceof Error ? err : new Error('Failed to connect wallet');
      setError(error);
      toast.error('Failed to connect wallet');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect function
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setAddress(undefined);
      setIsConnected(false);
      toast.success('Wallet disconnected');
    } catch (err) {
      console.error('Disconnect error:', err);
      toast.error('Failed to disconnect wallet');
    }
  };

  return (
    <OnchainWalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connect,
        disconnect: handleDisconnect,
        error,
      }}
    >
      {children}
    </OnchainWalletContext.Provider>
  );
};

export default OnchainWalletProvider;
