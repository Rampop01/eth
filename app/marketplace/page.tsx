import { Suspense } from 'react';
import { NFTGrid } from '@/components/marketplace/nft-grid';
import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters';

export const metadata = {
  title: 'NFT Marketplace - Ethereum Quest',
  description: 'Buy, sell, and trade your quest rewards',
};

export default function MarketplacePage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NFT Marketplace</h1>
            <p className="text-muted-foreground">
              Buy, sell, and trade your quest rewards
            </p>
          </div>
          
          <MarketplaceFilters />
          
          <Suspense fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          }>
            <NFTGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
