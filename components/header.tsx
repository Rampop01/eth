'use client';

import Link from 'next/link';
import { WalletConnectButton } from './WalletConnectButton';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-cinzel text-xl font-bold">Ethereum Quest</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <WalletConnectButton />
        </nav>
      </div>
    </header>
  );
}
