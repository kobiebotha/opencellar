"use client";

import React, { useEffect, useState } from 'react';
import { AuthForm } from './components/auth-form';
import { Button } from './components/ui/button';
import { supabase } from './lib/supabase';
import { StorageLocationForm } from './components/storage-location-form';
import { BinForm } from './components/bin-form';
import { WineForm } from './components/wine-form';
import { WineList } from './components/wine-list';
import type { StorageLocation, Bin, Wine } from './lib/types';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState<'cellar' | 'add'>('cellar');
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStorageLocations();
      fetchBins();
      fetchWines();
    }
  }, [user]);

  const fetchStorageLocations = async () => {
    const { data } = await supabase.from('storage_locations').select('*');
    setStorageLocations(data || []);
  };

  const fetchBins = async () => {
    const { data } = await supabase.from('bins').select('*');
    setBins(data || []);
  };

  const fetchWines = async () => {
    const { data } = await supabase.from('wines').select('*');
    setWines(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <AuthForm />
      </div>
    );
  }

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
            Add Wine
          </Button>
        </div>

        {view === 'cellar' ? (
          <WineList wines={wines} onUpdate={fetchWines} />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Add Storage Location</h2>
              <StorageLocationForm onSuccess={fetchStorageLocations} loggedInUser={user}/>
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

export default App;