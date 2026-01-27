import * as React from "react";
import { View, ScrollView } from "react-native";
import { styled } from "nativewind";

import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { PostCard } from "@/components/feed/PostCard";
import { posts } from "@/lib/data";

const StyledView = styled(View);

export function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <StyledView className="w-full max-w-2xl mx-auto py-8 px-4">
        <StyledView className="space-y-6">
          <CreatePostForm />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </StyledView>
      </StyledView>
    </ScrollView>
  );
}
