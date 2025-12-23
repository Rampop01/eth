'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

// Mock data - in a real app, this would come from your smart contract or API
const MOCK_LEADERBOARD = [
  { address: '0x1234...5678', score: 1250, rank: 1 },
  { address: '0x2345...6789', score: 980, rank: 2 },
  { address: '0x3456...7890', score: 870, rank: 3 },
  { address: '0x4567...8901', score: 765, rank: 4 },
  { address: '0x5678...9012', score: 640, rank: 5 },
];

export function Leaderboard() {
  const { address } = useAccount();
  
  // In a real app, you would fetch this data from your smart contract
  // const { data: leaderboardData, isLoading } = useReadContract({
  //   address: 'YOUR_CONTRACT_ADDRESS',
  //   abi: [
  //     {
  //       inputs: [],
  //       name: 'getLeaderboard',
  //       outputs: [
  //         {
  //           components: [
  //             { name: 'user', type: 'address' },
  //             { name: 'score', type: 'uint256' },
  //             { name: 'rank', type: 'uint256' },
  //           ],
  //           type: 'tuple[]',
  //         },
  //       ],
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'getLeaderboard',
  // });

  // For now, we'll use mock data
  const leaderboardData = MOCK_LEADERBOARD;
  const isLoading = false;

  const userRank = leaderboardData.find((user) => user.address === address)?.rank || null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top players by score</CardDescription>
        {userRank && (
          <div className="text-sm text-muted-foreground">
            Your rank: <span className="font-medium text-foreground">#{userRank}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData.map((user) => (
              <div 
                key={user.address}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  user.address === address 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'border'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-sm font-medium">
                    #{user.rank}
                  </span>
                  <span className="font-mono text-sm">
                    {user.address}
                  </span>
                </div>
                <span className="font-medium">{user.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
