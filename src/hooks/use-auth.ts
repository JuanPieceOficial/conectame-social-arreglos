"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Import the Supabase client

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;
    setUser(data.user);
    setIsAuthenticated(true);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (email: string, password: string, username: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // Store username in user_metadata
        },
      },
    });
    
    if (error) {
      setLoading(false);
      throw error;
    }

    if (data.user) {
      // Also create a profile entry in the public.profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username: username, email: email }]); // Assuming email is also stored in profiles

      if (profileError) {
        setLoading(false);
        throw profileError;
      }
    }
    
    setLoading(false);
    setUser(data.user);
    setIsAuthenticated(true);
    router.push('/dashboard'); 
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };
}
