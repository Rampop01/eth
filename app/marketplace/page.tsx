import { Suspense } from 'react';
import { NFTGrid } from '@/components/marketplace/nft-grid';
import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters';

export const metadata = {
  title: 'NFT Marketplace - Ethereum Quest',
  description: 'Buy, sell, and trade your quest rewards',
};

export default function MarketplacePage() {
  return (
    <div className="relative min-h-screen bg-stone-dark pt-28 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/dark-stone-temple-wall-texture.jpg')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-stone-dark via-transparent to-stone-dark pointer-events-none" />
      
      {/* Ambient Fog */}
      <div className="absolute inset-0 bg-gradient-to-tr from-fog-cyan/5 via-transparent to-fog-amber/5 pointer-events-none" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-glow-amber/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-5xl md:text-7xl font-black text-glow-amber text-glow tracking-wider animate-pulse-slow">
              ARTIFACTS
            </h1>
            <p className="font-[family-name:var(--font-cinzel)] text-foreground/70 text-lg md:text-xl tracking-widest uppercase">
              Buy, sell, and trade your legendary quest rewards
            </p>
            <div className="mt-6 w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-glow-amber to-transparent shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          </div>
          
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
            <MarketplaceFilters />
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
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
