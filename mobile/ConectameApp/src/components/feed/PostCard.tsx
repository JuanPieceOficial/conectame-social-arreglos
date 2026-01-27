import * as React from "react";
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { cn } from "@/lib/utils";
import { Post } from "@/lib/types";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

type PostCardProps = {
  post: Post;
};

const { width } = Dimensions.get('window');

export function PostCard({ post }: PostCardProps) {
  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;
  const hasSingleImage = post.imageUrls && post.imageUrls.length === 1;

  return (
    <Card>
      <CardHeader className="p-4">
        <StyledView className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <StyledView>
            <StyledText className="font-semibold font-headline">{post.author.name}</StyledText>
            <StyledText className="text-xs text-muted-foreground">
              @{post.author.username} · {post.timestamp}
            </StyledText>
          </StyledView>
          <Button className="ml-auto bg-transparent p-1" /*variant="ghost" size="icon"*/>
            <MaterialCommunityIcons name="dots-horizontal" size={20} color="black" />
          </Button>
        </StyledView>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <StyledText className="whitespace-pre-wrap">{post.content}</StyledText>
        {post.imageUrls && (
          <StyledView className="mt-4 -mx-4">
            {hasSingleImage && (
              <StyledView className="relative w-full aspect-video">
                <StyledImage
                  source={{ uri: post.imageUrls[0] }}
                  alt="Post image"
                  className="w-full h-full object-cover"
                  resizeMode="cover"
                />
              </StyledView>
            )}
            {hasMultipleImages && (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ width: width - 32 }} // CardContent has p-4 (16px), so total 32px horizontal padding
                contentContainerStyle={{ paddingHorizontal: 0 }} // No additional padding for scroll view content
              >
                {post.imageUrls.map((url, index) => (
                  <StyledView key={index} className="aspect-square" style={{ width: width - 32 }}> {/* Each item takes full available width */}
                    <StyledImage
                      source={{ uri: url }}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover"
                      resizeMode="cover"
                    />
                  </StyledView>
                ))}
              </ScrollView>
            )}
          </StyledView>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-row justify-between">
        <StyledView className="flex-row gap-4 text-muted-foreground">
            <Button className="bg-transparent p-1 flex-row items-center gap-2" /*variant="ghost" size="sm"*/>
                <MaterialCommunityIcons name="heart-outline" size={20} color="black"/>
                <StyledText className="text-sm">{post.likes}</StyledText>
            </Button>
            <Button className="bg-transparent p-1 flex-row items-center gap-2" /*variant="ghost" size="sm"*/>
                <MaterialCommunityIcons name="comment-outline" size={20} color="black"/>
                <StyledText className="text-sm">{post.comments}</StyledText>
            </Button>
        </StyledView>
        <Button className="bg-transparent p-1" /*variant="ghost" size="icon"*/>
          <MaterialCommunityIcons name="share-variant" size={20} color="hsl(var(--muted-foreground))" />
        </Button>
      </CardFooter>
    </Card>
  );
}
