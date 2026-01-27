import { CreatePostForm } from "@/components/feed/create-post-form";
import { PostCard } from "@/components/feed/post-card";
import { posts } from "@/lib/data";

export default function FeedPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <CreatePostForm />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
