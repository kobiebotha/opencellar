import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './components/ui/button';
import { StorageLocationForm } from './components/storage-location-form';
import { BinForm } from './components/bin-form';
import { WineForm } from './components/wine-form';
import { WineList } from './components/wine-list';
import type { StorageLocation, Bin, Wine } from './lib/types';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

interface HomeProps {
  user: User;
  handleSignOut: () => Promise<void>;
}

export function Home({ user, handleSignOut }: HomeProps) {
  const [view, setView] = useState<'cellar' | 'add'>('cellar');
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);

  const fetchStorageLocations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('storage_locations')
      .select('*')
      .eq('user_id', user.id);
    setStorageLocations(data || []);
  };

  const storageLocationIds = useMemo(() => {
    return storageLocations.map(loc => loc.id);
  }, [storageLocations]);

  const fetchBins = async () => {
    if (!user) {
      console.error('FetchBins called without user - should not happen');
      setBins([]);
      return;
    }
    const { data: binsData, error: binsError } = await supabase
      .from('bins')
      .select()
      .in('storage_location_id', storageLocationIds);

    if (binsError) {
        console.error('Error fetching bins:', binsError);
        setBins([]);
        return;
    }
    setBins(binsData || []);
  };

  const binIds = useMemo(() => {
    return bins.map(bin => bin.id);
  }, [bins]);

  const fetchWines = async () => {
    if (!user) {
        console.error('FetchWines called without user - should not happen');
        setWines([]);
        return;
    }
    const { data, error } = await supabase
      .from('wines')
      .select()
      .in('bin_id', binIds);

    if (error) {
        console.error('Error fetching wines:', error);
        setWines([]);
        return;
    }
    setWines(data || []);
  };

  useEffect(() => {
    if (user) {
      fetchStorageLocations();
    } else {
      setView('cellar');
      setStorageLocations([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && storageLocationIds.length > 0) {
        fetchBins();
    } else {
        setBins([]);
    }
  }, [storageLocationIds, user]);

  useEffect(() => {
    if (user && binIds.length > 0) {
        fetchWines();
    } else {
        setWines([]);
    }
  }, [binIds, user]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Wine Cellar</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => setView('cellar')}
            variant={view === 'cellar' ? 'default' : 'outline'}
          >
            My Cellar
          </Button>
          <Button
            onClick={() => setView('add')}
            variant={view === 'add' ? 'default' : 'outline'}
          >
            Add Wine/Location/Bin
          </Button>
        </div>

        {view === 'cellar' ? (
          <WineList wines={wines} onUpdate={fetchWines} />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Add Storage Location</h2>
              <StorageLocationForm onSuccess={fetchStorageLocations} loggedInUser={user} />
            </div>

            <div className="p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Add Bin</h2>
              <BinForm
                storageLocations={storageLocations}
                onSuccess={fetchBins}
              />
            </div>

            <div className="p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Add Wine</h2>
              <WineForm bins={bins} onSuccess={fetchWines} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 