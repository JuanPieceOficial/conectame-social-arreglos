"use client"; // This component needs to be a client component to use useState and fetch

import { useState, useEffect } from "react";
import { CreatePostForm } from "@/components/feed/create-post-form";
import { PostCard } from "@/components/feed/post-card";
import { posts } from "@/lib/data";
import { Button } from "@/components/ui/button"; // Assuming a Button component exists
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const [backendStatus, setBackendStatus] = useState("Not checked");
  const { isAuthenticated, user, loading, logout } = useAuth(); // Get user and loading state
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) { // Redirect only after loading is complete
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading) {
    return <div>Loading authentication...</div>; // Show loading state
  }

  if (!isAuthenticated) {
    return null; // Or a more elaborate loading/redirecting component
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        {user && <p>Welcome, {user.email}!</p>}
        <Button onClick={logout}>Logout</Button>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Backend Connection Test</h2>
          <Button onClick={checkBackendStatus}>Test Backend</Button>
        </div>
        <p className="text-sm text-gray-600">Status: {backendStatus}</p>

        <CreatePostForm />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

