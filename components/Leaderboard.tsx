'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Trophy, Medal, Star, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - in a real app, this would come from your smart contract or API
const MOCK_LEADERBOARD = [
  { address: '0x1234...5678', score: 1250, rank: 1, title: 'Arch Mage' },
  { address: '0x2345...6789', score: 980, rank: 2, title: 'Grand Scholar' },
  { address: '0x3456...7890', score: 870, rank: 3, title: 'Quest Master' },
  { address: '0x4567...8901', score: 765, rank: 4, title: 'Adept' },
  { address: '0x5678...9012', score: 640, rank: 5, title: 'Novice' },
];

export function Leaderboard() {
  const { address } = useAccount();
  
  const leaderboardData = MOCK_LEADERBOARD;
  const isLoading = false;

  const userRank = leaderboardData.find((user) => user.address === address)?.rank || null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-glow-amber animate-bounce" />;
      case 2: return <Medal className="w-6 h-6 text-zinc-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Star className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {userRank && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-glow-amber/20 to-transparent border-l-4 border-glow-amber mb-8 animate-in slide-in-from-left duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-glow-amber/20 flex items-center justify-center border border-glow-amber/40">
              <ShieldCheck className="w-6 h-6 text-glow-amber" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Your Current Standing</p>
              <p className="font-[family-name:var(--font-cinzel-decorative)] text-xl font-bold text-white">
                Ranked <span className="text-glow-amber">#{userRank}</span> among legends
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {leaderboardData.map((user) => (
              <div 
                key={user.address}
                className={cn(
                  "group relative overflow-hidden p-0.5 rounded-2xl transition-all duration-500 hover:scale-[1.01]",
                  user.address === address 
                    ? "bg-gradient-to-r from-glow-amber via-yellow-500 to-glow-amber shadow-lg shadow-glow-amber/20" 
                    : "bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="relative flex items-center justify-between p-4 md:p-6 bg-stone-dark/90 rounded-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex flex-col items-center justify-center w-12 md:w-16">
                      {getRankIcon(user.rank)}
                      <span className="font-[family-name:var(--font-cinzel-decorative)] text-lg font-black text-zinc-400 group-hover:text-white transition-colors">
                        #{user.rank}
                      </span>
                    </div>

                    <div className="h-10 w-px bg-white/10 hidden md:block" />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs md:text-sm text-zinc-300 truncate max-w-[120px] md:max-w-none">
                          {user.address}
                        </span>
                        {user.address === address && (
                          <span className="px-2 py-0.5 rounded bg-glow-amber/20 text-[8px] font-bold text-glow-amber uppercase tracking-widest border border-glow-amber/30">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="font-[family-name:var(--font-cinzel)] text-[10px] md:text-xs font-bold uppercase tracking-widest text-glow-cyan/70">
                        {user.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Exp Points</p>
                    <p className="font-[family-name:var(--font-cinzel-decorative)] text-xl md:text-3xl font-black text-glow-amber text-glow-sm">
                      {user.score}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pt-8 text-center border-t border-white/5">
        <p className="font-[family-name:var(--font-cinzel)] text-xs text-zinc-500 italic">
          Legends are forged in the fires of the Ethereum Mainnet
        </p>
      </div>
    </div>
  );
}
