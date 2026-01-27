import type { Post } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;
  const hasSingleImage = post.imageUrls && post.imageUrls.length === 1;

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="profile person"/>
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold font-headline">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              @{post.author.username} · {post.timestamp}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrls && (
          <div className="mt-4 -mx-4">
            {hasSingleImage && (
              <div className="relative aspect-video w-full">
                <Image
                  src={post.imageUrls[0]}
                  alt="Post image"
                  fill
                  className="object-cover"
                  data-ai-hint="social post"
                />
              </div>
            )}
            {hasMultipleImages && (
              <Carousel className="w-full">
                <CarouselContent>
                  {post.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={url}
                          alt={`Post image ${index + 1}`}
                          fill
                          className="object-cover"
                          data-ai-hint="social post"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4"/>
                <CarouselNext className="right-4"/>
              </Carousel>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-4 text-muted-foreground">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-5 w-5"/>
                <span className="text-sm">{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5"/>
                <span className="text-sm">{post.comments}</span>
            </Button>
        </div>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );
}
