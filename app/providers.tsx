'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react'; 
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { ReactNode } from 'react';

// Configure networks
const networks = [mainnet, sepolia];

// Create a client
const queryClient = new QueryClient();

// Metadata 
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const projectId = 'YOUR_PROJECT_ID'; // Placeholder

// Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata: metadata,
  projectId,
  features: {
    analytics: true
  }
});

// Export config for usage elsewhere if needed, though here we just use it in provider
const config = wagmiAdapter.wagmiConfig;

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
