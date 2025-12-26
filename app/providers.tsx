'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { AppKitProvider } from '@reown/appkit/react';
import { ReactNode, useEffect, useState } from 'react';

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

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider
          projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''}
          metadata={{
            name: 'QuestETH',
            description: 'QuestETH Application',
            url: 'https://questeth.vercel.app',
            icons: ['https://questeth.vercel.app/logo.png']
          }}
          networks={[mainnet, sepolia]}
        >
          {children}
        </AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
