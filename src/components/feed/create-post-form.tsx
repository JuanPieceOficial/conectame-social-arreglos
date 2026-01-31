"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Video, Mic } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export function CreatePostForm() {
  const { user, isAuthenticated } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostSubmit = async () => {
    if (!isAuthenticated || !user || !postContent.trim()) {
      alert("Please log in and write something to post.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user.id,
          content: postContent.trim(),
        }
      ]);

    if (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } else {
      setPostContent("");
      // In a real application, you'd likely want to trigger a refresh of the posts list
      // For this example, we'll just log success and expect the FeedPage to refetch on its own mechanism.
      console.log("Post created successfully!");
    }
    setIsSubmitting(false);
  };

  // Placeholder for user display if no user is logged in
  const displayUserName = user?.user_metadata?.username || user?.email || 'Guest';
  const displayAvatarUrl = user?.user_metadata?.avatar_url || '/placeholder-avatar.png';
  const displayAvatarFallback = user?.user_metadata?.username?.charAt(0) || user?.email?.charAt(0) || '?';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="hidden sm:block">
            <AvatarImage src={displayAvatarUrl} alt={displayUserName} data-ai-hint="profile person" />
            <AvatarFallback>{displayAvatarFallback}</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-3">
            <Textarea
              placeholder="What's happening?"
              className="bg-background border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={isSubmitting || !isAuthenticated}
            />
            <div className="flex items-center">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" aria-label="Add image" disabled={isSubmitting || !isAuthenticated}>
                  <ImageIcon className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Add video" disabled={isSubmitting || !isAuthenticated}>
                  <Video className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Add voice note" disabled={isSubmitting || !isAuthenticated}>
                  <Mic className="text-muted-foreground" />
                </Button>
              </div>
              <Button className="ml-auto font-headline font-semibold" onClick={handlePostSubmit} disabled={isSubmitting || !isAuthenticated}>
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}