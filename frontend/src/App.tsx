"use client";

import React, { useEffect, useState } from 'react';
import { AuthForm } from './components/auth-form';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Home } from './Home';

function App() {
  const [user, setUser] = useState<User | null>(null);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <AuthForm />
      </div>
    );
  }

  return <Home user={user} handleSignOut={handleSignOut} />;
}

export default App;