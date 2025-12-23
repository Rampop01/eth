import { Leaderboard } from '@/components/Leaderboard';

export const metadata = {
  title: 'Leaderboard - Ethereum Quest',
  description: 'See where you stand among other adventurers',
};

export default function LeaderboardPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mb-8 text-muted-foreground">
          See where you stand among other adventurers in the Ethereum Quest.
        </p>
        <Leaderboard />
      </div>
    </div>
  );
}
