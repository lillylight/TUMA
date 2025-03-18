
import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a Wagmi config
const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    coinbaseWallet({
      appName: 'TUMA Document Exchange',
    }),
    walletConnect({
      projectId: 'c573024101410d42fe8eb71324a2734b', // WalletConnect project ID
    }),
    injected(),
  ],
  ssr: false,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

// Create a query client
const queryClient = new QueryClient();

// OnchainKit provider
export function OnchainProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
