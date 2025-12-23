'use client';

import Link from 'next/link';
import { WalletConnectButton } from './WalletConnectButton';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Quests', href: '/' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Leaderboard', href: '/leaderboard' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-cinzel text-xl font-bold">Ethereum Quest</span>
          </Link>
          
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  item.href === window?.location.pathname
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
