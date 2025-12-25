'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnectButton } from './WalletConnectButton';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Quests', href: '/quests' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Leaderboard', href: '/leaderboard' },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/50 supports-[backdrop-filter]:bg-black/20 px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
              <span className="inline-block font-cinzel text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                Ethereum Quest
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-1.5 transition-all duration-300 font-[family-name:var(--font-cinzel)] uppercase tracking-widest',
                    pathname === item.href
                      ? 'text-amber-400'
                      : 'text-zinc-400 hover:text-amber-200'
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[1px]" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <WalletConnectButton />
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-amber-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-stone-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in zoom-in duration-300">
          <button 
            className="absolute top-10 right-10 text-zinc-400 hover:text-amber-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <nav className="flex flex-col items-center space-y-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'text-2xl font-[family-name:var(--font-cinzel-decorative)] font-bold tracking-widest transition-all',
                  pathname === item.href
                    ? 'text-glow-amber scale-110'
                    : 'text-zinc-500 hover:text-amber-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-8 w-full flex justify-center border-t border-white/10">
            <WalletConnectButton />
          </div>
        </div>
      )}
    </>
  );
}
