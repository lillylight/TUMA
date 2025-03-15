import { createContext, useContext, useState, ReactNode } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base, mainnet } from 'viem/chains';
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { toast } from 'sonner';

// Set up wagmi config
const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'TUMA Document Exchange',
    }),
    walletConnect({
      projectId: 'c573024101410d42fe8eb71324a2734b', // WalletConnect project ID for Base network
    }),
    injected(),
  ],
});

// Create wallet context
interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  error: Error | null;
}

const WalletContext = createContext<WalletContextType>({
  address: undefined,
  isConnected: false,
  isConnecting: false,
  connect: () => {},
  disconnect: () => {},
  error: null,
});

export const useWallet = () => useContext(WalletContext);

// Wallet provider component
interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider = ({ children }: WalletProviderProps) => {
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const connector = connectors.find(c => c.id === 'metaMask') || connectors[0];
      if (connector) {
        await wagmiConnect({ connector });
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
      toast.success('Wallet disconnected');
    } catch (err) {
      console.error('Disconnection error:', err);
      toast.error('Failed to disconnect wallet');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting: isConnecting || isPending,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Wrapper component that includes WagmiProvider
export const WalletConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <WalletProvider>{children}</WalletProvider>
    </WagmiProvider>
  );
};

export default WalletConfigProvider;
