'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameButton } from '@/components/game-button';
import { formatEther } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { ShoppingCart, User, Zap, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - replace with actual NFT data from your contract
const MOCK_NFTS = [
  {
    id: '1',
    name: 'Golden Dragon Egg',
    description: 'A legendary relic said to contain the essence of the First Dragon.',
    image: '/nfts/dragon-egg.png',
    price: '0.1',
    seller: '0x1234...5678',
    rarity: 'Legendary',
  },
  {
    id: '2',
    name: 'Mystic Sword',
    description: 'A blade forged in the fires of the Ethereum genesis block.',
    image: '/nfts/mystic-sword.png',
    price: '0.05',
    seller: '0x2345...6789',
    rarity: 'Epic',
  },
  {
    id: '3',
    name: 'Wizard Staff',
    description: 'Channel the raw power of smart contracts through this ancient timber.',
    image: '/nfts/wizard-staff.png',
    price: '0.15',
    seller: '0x3456...7890',
    rarity: 'Mythic',
  },
  {
    id: '4',
    name: 'Shield of Protection',
    description: 'A block-solid defense against any reentrancy attack.',
    image: '/nfts/shield.png',
    price: '0.08',
    seller: '0x4567...8901',
    rarity: 'Rare',
  },
];

export function NFTGrid() {
  const { address } = useAccount();

  const handleBuy = async (nftId: string, price: string) => {
    try {
      console.log(`Buying NFT ${nftId} for ${price} ETH`);
      alert(`Successfully purchased NFT ${nftId} for ${price} ETH`);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Failed to purchase NFT');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MOCK_NFTS.map((nft) => (
        <div key={nft.id} className="group relative">
          {/* Card Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-t from-glow-amber/50 to-glow-cyan/50 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000" />
          
          <Card className="relative h-full overflow-hidden bg-black/40 backdrop-blur-xl border-white/10 rounded-2xl flex flex-col transition-all duration-500 hover:-translate-y-2">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden border-b border-white/10">
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img
                src={nft.image}
                alt={nft.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Rarity Tag */}
              <div className="absolute top-4 right-4 z-20">
                <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-glow-amber">
                  {nft.rarity}
                </div>
              </div>
            </div>

            <CardHeader className="p-6 pb-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-[family-name:var(--font-cinzel-decorative)] text-xl font-bold text-white group-hover:text-glow-amber transition-colors">
                  {nft.name}
                </h3>
                <Zap className="w-5 h-5 text-glow-cyan animate-pulse" />
              </div>
              <p className="font-[family-name:var(--font-cinzel)] text-sm text-zinc-400 line-clamp-2 mt-1 italic leading-relaxed">
                "{nft.description}"
              </p>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex-grow">
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-tighter text-zinc-500 font-bold">Price</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-glow-amber font-[family-name:var(--font-cinzel-decorative)]">
                      {nft.price}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">ETH</span>
                  </div>
                </div>
                
                <div className="h-px bg-white/10" />
                
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <User className="w-3 h-3" />
                  <span className="truncate">
                    {nft.seller === address ? 'YOUR LISTING' : `OWNED BY ${nft.seller}`}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              {nft.seller === address ? (
                <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  You own this artifact
                </div>
              ) : (
                <GameButton 
                  className="w-full group/btn"
                  onClick={() => handleBuy(nft.id, nft.price)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5 transition-transform group-hover/btn:-rotate-12" />
                    <span>CLAIM ARTIFACT</span>
                  </div>
                </GameButton>
              )}
            </CardFooter>

            {/* Ambient Shine Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </Card>
        </div>
      ))}
    </div>
  );
}
