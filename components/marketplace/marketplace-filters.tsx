'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'price-low' | 'price-high' | 'recent' | 'oldest';

export function MarketplaceFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex flex-col space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <form onSubmit={handleSearch} className="flex-1 max-w-md group">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl focus-visible:ring-glow-amber focus-visible:border-glow-amber/50 transition-all font-[family-name:var(--font-cinzel)] text-white placeholder:text-zinc-500"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 group-focus-within:text-glow-amber transition-colors" />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-cinzel)]">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[200px] h-12 bg-white/5 border-white/10 rounded-xl focus:ring-glow-cyan focus:border-glow-cyan/50 font-[family-name:var(--font-cinzel)] text-zinc-300">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-glow-cyan" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-stone-dark/95 border-white/10 backdrop-blur-xl text-zinc-300 font-[family-name:var(--font-cinzel)]">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-glow-amber/50 transition-all group/filter"
        >
          <Filter className="mr-2 h-4 w-4 text-zinc-500 group-hover/filter:text-glow-amber" />
          <span className="font-[family-name:var(--font-cinzel)] font-bold uppercase tracking-widest text-xs">Filters</span>
        </Button>
      </div>
    </div>
  );
}
