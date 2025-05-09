import React, { useState } from 'react';
import { Wine } from '@/src/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '@/src/lib/supabase';
import type { User } from '@supabase/supabase-js';

const Spinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export function WineList({ wines, onUpdate, isLoading, user }: { wines: Wine[]; onUpdate: () => void; isLoading?: boolean; user: User }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Wine>('vintage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [consumingWineId, setConsumingWineId] = useState<string | null>(null);

  const handleConsume = async (wine: Wine, reason: 'gifted' | 'missing' | 'drank from cellar') => {
    if (wine.count <= 0 || consumingWineId === wine.id) return;

    setConsumingWineId(wine.id);

    try {
      const { error: updateError } = await supabase
        .from('wines')
        .update({ count: wine.count - 1 })
        .eq('id', wine.id);

      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from('drink_log')
        .insert([{ wine_id: wine.id, reason, drank_by: user.id }]);

      if (logError) throw logError;

      onUpdate();
    } catch (error) {
      console.error('Error consuming wine:', error);
    } finally {
      setConsumingWineId(null);
    }
  };

  const filteredWines = wines
    .filter((wine) =>
      wine.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wines..."
          />
        </div>
        <div className="sm:w-48">
          <Label htmlFor="sortBy">Sort By</Label>
          <select
            id="sortBy"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof Wine)}
          >
            <option value="name">Name</option>
            <option value="vintage">Vintage</option>
            <option value="count">Count</option>
          </select>
        </div>
        <div className="sm:w-48">
          <Label htmlFor="sortOrder">Order</Label>
          <select
            id="sortOrder"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWines.map((wine) => (
          <div
            key={wine.id}
            className="p-4 rounded-lg border border-border bg-card flex flex-col justify-between"
          >
            <div> {/* Wrapper for text content */}
              <h3 className="text-lg font-semibold">{wine.name}</h3>
              <p className="text-sm text-muted-foreground">
                Vintage: {wine.vintage}
              </p>
              <p className="text-sm text-muted-foreground">
                Bottles: {wine.count}
              </p>
            </div>
            {wine.count > 0 && (
              <div className="mt-4 space-y-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleConsume(wine, 'drank from cellar')}
                  disabled={consumingWineId === wine.id}
                >
                  {consumingWineId === wine.id ? 'Consuming...' : 'Consume'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleConsume(wine, 'gifted')}
                  disabled={consumingWineId === wine.id}
                >
                  {consumingWineId === wine.id ? 'Gifting...' : 'Gift'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}