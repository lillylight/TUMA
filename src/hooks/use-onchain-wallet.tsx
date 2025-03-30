
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { connectWallet, DisconnectFn, getDefaultWallets, ConnectFn } from '@coinbase/onchainkit';
import { base, mainnet } from 'viem/chains';
import { toast } from 'sonner';

// Create wallet context
interface OnchainWalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  connect: ConnectFn;
  disconnect: DisconnectFn;
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
  
  // Initialize OnchainKit
  const { connect, disconnect, walletAddress } = connectWallet({
    chains: [base, mainnet],
    wallets: getDefaultWallets(),
    appName: 'TUMA Document Exchange',
    onConnect: ({ walletAddress }) => {
      setAddress(walletAddress);
      setIsConnected(true);
      toast.success('Wallet connected successfully');
    },
    onDisconnect: () => {
      setAddress(undefined);
      setIsConnected(false);
      toast.success('Wallet disconnected');
    },
    onConnectError: (err) => {
      console.error('Connection error:', err);
      setError(err);
      toast.error('Failed to connect wallet');
      setIsConnecting(false);
    }
  });

  // Update connection status when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress);
      setIsConnected(true);
    } else {
      setAddress(undefined);
      setIsConnected(false);
    }
  }, [walletAddress]);

  // Wrap connect function to manage connecting state
  const handleConnect: ConnectFn = async (options) => {
    try {
      setIsConnecting(true);
      setError(null);
      const result = await connect(options);
      return result;
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <OnchainWalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connect: handleConnect,
        disconnect,
        error,
      }}
    >
      {children}
    </OnchainWalletContext.Provider>
  );
};

export default OnchainWalletProvider;
