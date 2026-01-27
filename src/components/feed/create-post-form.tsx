"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { users } from "@/lib/data";
import { Image as ImageIcon, Video, Mic } from "lucide-react";

export function CreatePostForm() {
  const currentUser = users["user-current"];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="hidden sm:block">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile person" />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-3">
            <Textarea
              placeholder="What's happening?"
              className="bg-background border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            <div className="flex items-center">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" aria-label="Add image">
                  <ImageIcon className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Add video">
                  <Video className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Add voice note">
                  <Mic className="text-muted-foreground" />
                </Button>
              </div>
              <Button className="ml-auto font-headline font-semibold">Post</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
