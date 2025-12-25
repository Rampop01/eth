import { Leaderboard } from '@/components/Leaderboard';

export const metadata = {
  title: 'Hall of Heroes - Ethereum Quest',
  description: 'See where you stand among other legendary adventurers',
};

export default function LeaderboardPage() {
  return (
    <div className="relative min-h-screen bg-stone-dark pt-28 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/ancient-library-dark-mystical.jpg')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-stone-dark via-transparent to-stone-dark pointer-events-none" />
      
      {/* Ambient Fog */}
      <div className="absolute inset-0 bg-gradient-to-tr from-glow-purple/5 via-transparent to-glow-amber/5 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-5xl md:text-7xl font-black text-glow-amber text-glow tracking-wider animate-pulse-slow">
              HALL OF HEROES
            </h1>
            <p className="font-[family-name:var(--font-cinzel)] text-foreground/70 text-lg md:text-xl tracking-widest uppercase">
              Legendary adventurers who have mastered the Ethereum scrolls
            </p>
            <div className="mt-6 w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-glow-amber to-transparent shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          </div>
          
          <div className="bg-black/40 backdrop-blur-md p-2 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
