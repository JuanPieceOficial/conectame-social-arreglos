import * as React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { users } from "@/lib/data";
import { cn } from "@/lib/utils";

const StyledView = styled(View);
const StyledText = styled(Text);

export function CreatePostForm() {
  const currentUser = users["user-current"];

  return (
    <Card>
      <CardContent className="p-4">
        <StyledView className="flex flex-row gap-4">
          <Avatar className="hidden sm:flex">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <StyledView className="flex-1 space-y-3">
            <Textarea
              placeholder="What's happening?"
              className="bg-card border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            <StyledView className="flex flex-row items-center">
              <StyledView className="flex flex-row gap-1">
                {/* Icons as buttons */}
                <Button className="bg-transparent p-1" /*aria-label="Add image"*/>
                  <MaterialCommunityIcons name="image" size={20} color="hsl(var(--muted-foreground))" />
                </Button>
                <Button className="bg-transparent p-1" /*aria-label="Add video"*/>
                  <MaterialCommunityIcons name="video" size={20} color="hsl(var(--muted-foreground))" />
                </Button>
                <Button className="bg-transparent p-1" /*aria-label="Add voice note"*/>
                  <MaterialCommunityIcons name="microphone" size={20} color="hsl(var(--muted-foreground))" />
                </Button>
              </StyledView>
              <Button className="ml-auto px-4 py-2">
                  <StyledText className="text-white font-semibold">Post</StyledText>
              </Button>
            </StyledView>
          </StyledView>
        </StyledView>
      </CardContent>
    </Card>
  );
}
