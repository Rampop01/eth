'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatEther } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

// Mock data - replace with actual NFT data from your contract
const MOCK_NFTS = [
  {
    id: '1',
    name: 'Golden Dragon Egg',
    description: 'A rare dragon egg from the depths of the Ethereum blockchain',
    image: '/nfts/dragon-egg.png',
    price: '0.1',
    seller: '0x1234...5678',
  },
  {
    id: '2',
    name: 'Mystic Sword',
    description: 'A powerful sword imbued with ancient magic',
    image: '/nfts/mystic-sword.png',
    price: '0.05',
    seller: '0x2345...6789',
  },
  {
    id: '3',
    name: 'Wizard Staff',
    description: 'Channel the power of the elements with this enchanted staff',
    image: '/nfts/wizard-staff.png',
    price: '0.15',
    seller: '0x3456...7890',
  },
  {
    id: '4',
    name: 'Shield of Protection',
    description: 'A sturdy shield that can withstand any attack',
    image: '/nfts/shield.png',
    price: '0.08',
    seller: '0x4567...8901',
  },
];

export function NFTGrid() {
  const { address } = useAccount();

  // In a real app, you would fetch this from your smart contract
  // const { data: nfts, isLoading } = useReadContract({
  //   address: 'YOUR_NFT_CONTRACT_ADDRESS',
  //   abi: [
  //     {
  //       inputs: [],
  //       name: 'getAllListedItems',
  //       outputs: [
  //         {
  //           components: [
  //             { name: 'tokenId', type: 'uint256' },
  //             { name: 'price', type: 'uint256' },
  //             { name: 'seller', type: 'address' },
  //             { name: 'isSold', type: 'bool' },
  //           ],
  //           type: 'tuple[]',
  //         },
  //       ],
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'getAllListedItems',
  // });

  const handleBuy = async (nftId: string, price: string) => {
    try {
      // In a real app, you would call your smart contract here
      console.log(`Buying NFT ${nftId} for ${price} ETH`);
      // Example:
      // await writeContract({
      //   address: 'YOUR_NFT_CONTRACT_ADDRESS',
      //   abi: [
      //     {
      //       inputs: [{ name: 'tokenId', type: 'uint256' }],
      //       name: 'buyNFT',
      //       outputs: [],
      //       stateMutability: 'payable',
      //       type: 'function',
      //     },
      //   ],
      //   functionName: 'buyNFT',
      //   args: [BigInt(nftId)],
      //   value: parseEther(price),
      // });
      alert(`Successfully purchased NFT ${nftId} for ${price} ETH`);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Failed to purchase NFT');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MOCK_NFTS.map((nft) => (
        <Card key={nft.id} className="overflow-hidden transition-shadow hover:shadow-lg">
          <div className="aspect-square overflow-hidden">
            <img
              src={nft.image}
              alt={nft.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader>
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p className="text-sm text-muted-foreground">{nft.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{nft.price} ETH</span>
              <span className="text-sm text-muted-foreground">
                {nft.seller === address ? 'Your listing' : `Seller: ${nft.seller}`}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            {nft.seller === address ? (
              <Button variant="outline" className="w-full" disabled>
                Your NFT
              </Button>
            ) : (
              <Button 
                className="w-full"
                onClick={() => handleBuy(nft.id, nft.price)}
              >
                Buy Now
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
