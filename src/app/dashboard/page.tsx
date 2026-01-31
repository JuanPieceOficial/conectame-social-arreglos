"use client"; // This component needs to be a client component to use useState and fetch

import { useEffect, useState } from "react";
import { CreatePostForm } from "@/components/feed/create-post-form";
import { PostCard } from "@/components/feed/post-card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { Post } from "@/lib/types";
import { Button } from "@/components/ui/button"; // Import Button

export default function FeedPage() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch posts from Supabase
  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true);
      setError(null);
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)') // Fetch posts and join with profiles table
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts.");
        setPosts([]);
      } else {
        // Map the fetched data to match the Post type expected by PostCard
        const fetchedPosts: Post[] = data.map((post: any) => ({
          id: post.id,
          author: {
            id: post.profiles.id,
            name: post.profiles.username, // Use username from profile as name
            username: post.profiles.username,
            avatarUrl: post.profiles.avatar_url || '/placeholder-avatar.png',
          },
          content: post.content,
          imageUrls: post.image_url ? [post.image_url] : [], // Adapt from single image_url to imageUrls array
          likes: 0, // Not available in schema, set to 0 for now
          comments: 0, // Not available in schema, set to 0 for now
          timestamp: post.created_at,
        }));
        setPosts(fetchedPosts);
      }
      setLoadingPosts(false);
    }

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  if (loading || loadingPosts) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="flex flex-col flex-grow p-4">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      <div className="flex-grow overflow-y-auto">
        <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Welcome, {user?.email || 'Guest'}</h2>
            <p className="text-sm text-gray-600 mb-4">This is your personalized feed. Share your thoughts and see what's new!</p>
            <div className="flex items-center justify-between">
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <CreatePostForm />
          {error && <p className="text-red-500">{error}</p>}
          {posts.length === 0 && !loadingPosts && !error && <p>No posts yet. Be the first to create one!</p>}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}