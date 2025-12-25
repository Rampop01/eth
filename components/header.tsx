'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnectButton } from './WalletConnectButton';
import { cn } from '@/lib/utils';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navigation = [
  { name: 'Quests', href: '/quests' }, // Updated href based on earlier findings
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Leaderboard', href: '/leaderboard' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full border border-white/10 bg-black/20 backdrop-blur-md shadow-lg shadow-black/10 supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <span className="inline-block font-cinzel text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
              Ethereum Quest
            </span>
          </Link>
          
          <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-3 py-1.5 transition-colors hover:text-amber-200',
                  pathname === item.href
                    ? 'text-amber-400'
                    : 'text-zinc-300'
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-amber-400 blur-[2px]" />
                )}
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
