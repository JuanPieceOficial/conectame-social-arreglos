"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Import the Supabase client

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null); // NEW: State for user profile
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // NEW: Helper function to fetch or create user profile
  const fetchUserAndProfile = useCallback(async (session: any | null) => {
    setLoading(true); // Start loading when fetching profile
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') { // PGRST116 means no rows found
        // Profile does not exist, create a new one
        console.log("Profile not found, creating a new one.");
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              username: session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`, // Default username
              email: session.user.email,
              avatar_url: session.user.user_metadata?.avatar_url, // Use from auth if available
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          setProfile(null);
        } else {
          setProfile(newProfile);
        }
      } else if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        setProfile(null); // Clear profile on other errors
      } else if (existingProfile) {
        setProfile(existingProfile);
      }
    } else {
      setUser(null);
      setProfile(null); // Clear profile
      setIsAuthenticated(false);
    }
    setLoading(false); // End loading
  }, []);


  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await fetchUserAndProfile(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await fetchUserAndProfile(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserAndProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
        setLoading(false);
        throw error;
    }
    await fetchUserAndProfile(data.session); // Pass the session data
    router.push('/dashboard');
  }, [router, fetchUserAndProfile]);

  const register = useCallback(async (email: string, password: string, username: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });
    
    if (error) {
      setLoading(false);
      throw error;
    }

    if (data.user) {
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username: username, email: email }])
        .select()
        .single();

      if (profileError) {
        setLoading(false);
        throw profileError;
      }
      setProfile(newProfile); // Set the profile state
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
    setProfile(null); // Clear profile state
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return {
    user,
    profile, // NEW: Return profile
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };
}