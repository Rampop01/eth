'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { AppKitProvider } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { ReactNode } from 'react';

// Configure chains & providers
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

// Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({ config, queryClient });

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider adapter={wagmiAdapter}>
          {children}
        </AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
