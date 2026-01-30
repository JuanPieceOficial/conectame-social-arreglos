"use client"; // This component needs to be a client component to use useState and fetch

import { useState, useEffect } from "react";
import { CreatePostForm } from "@/components/feed/create-post-form";
import { PostCard } from "@/components/feed/post-card";
import { posts } from "@/lib/data";
import { Button } from "@/components/ui/button"; // Assuming a Button component exists

// Small change to trigger CI/CD
const BACKEND_URL = "http://toby.hidencloud.com:24652";

export default function FeedPage() {
  const [backendStatus, setBackendStatus] = useState("Not checked");

  const checkBackendStatus = async () => {
    if (!BACKEND_URL) {
      setBackendStatus("Error: Backend URL not configured.");
      return;
    }
    try {
      setBackendStatus("Checking...");
      const response = await fetch(`${BACKEND_URL}/health`);
      const data = await response.json();
      setBackendStatus(`Backend Status: ${data.status} (DB: ${data.dbConnection || 'N/A'})`);
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      setBackendStatus("Failed to connect to backend.");
    }
  };

  useEffect(() => {
    // Optionally check status on component mount
    // checkBackendStatus();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
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

