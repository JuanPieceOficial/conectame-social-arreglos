import * as React from "react";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { styled } from "nativewind";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import the actual Input component
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput); // Keep this if needed for other places, but not for Input component usage
const StyledTouchableOpacity = styled(TouchableOpacity);

const conversations = [users['user-1'], users['user-2'], users['user-3']];
const { width } = Dimensions.get('window'); // Get current screen width

export function MessagesScreen() {
  const [selectedUser, setSelectedUser] = useState<User>(users['user-1']);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleConversationSelect = (user: User) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  }

  // Determine if it's a small screen (mobile-like behavior)
  const isSmallScreen = width < 768; // Based on md breakpoint in Tailwind

  return (
    <StyledView className="flex-1 bg-background">
      <StyledView className="flex-1 flex-row min-h-0">
        {/* Conversations List Panel */}
        {(!isChatOpen || !isSmallScreen) && ( // Show list if chat not open OR not small screen
          <StyledView className={cn(
            "flex-1 border-r border-border flex-col",
            isSmallScreen ? "w-full" : "w-1/3" // Adjust width for small vs large screens
          )}>
            <StyledView className="p-4 border-b border-border">
              <StyledText className="text-2xl font-bold font-headline">Messages</StyledText>
              <StyledView className="relative mt-4">
                <MaterialCommunityIcons name="magnify" size={18} color="hsl(var(--muted-foreground))" className="absolute left-3 top-1/2 -translate-y-1/2"/>
                <Input placeholder="Search messages" className="pl-10"/>
              </StyledView>
            </StyledView>
            <ScrollArea>
              {conversations.map(user => (
                <StyledTouchableOpacity
                  key={user.id}
                  className="flex-row items-center gap-3 p-4 hover:bg-muted-background transition-colors"
                  onPress={() => handleConversationSelect(user)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <StyledView className="flex-1 overflow-hidden">
                    <StyledText className="font-semibold truncate">{user.name}</StyledText>
                    <StyledText className="text-sm text-muted-foreground truncate">@{user.username}</StyledText>
                  </StyledView>
                </StyledTouchableOpacity>
              ))}
            </ScrollArea>
          </StyledView>
        )}

        {/* Chat Panel */}
        {(isChatOpen || !isSmallScreen) && ( // Show chat if chat open OR not small screen
          <StyledView className={cn(
            "flex-1 flex-col bg-background",
            isSmallScreen ? "absolute inset-0 z-10" : "w-2/3" // Full screen on small, 2/3 on large
          )}>
            <StyledView className="p-4 border-b border-border flex-row items-center gap-3">
              {isSmallScreen && ( // Back button only on small screens when chat is open
                <Button className="bg-transparent p-1" onPress={() => setIsChatOpen(false)}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                </Button>
              )}
              <Avatar>
                <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <StyledView>
                <StyledText className="font-semibold">{selectedUser.name}</StyledText>
                <StyledText className="text-sm text-muted-foreground">@{selectedUser.username}</StyledText>
              </StyledView>
            </StyledView>
            <ScrollArea className="flex-1 p-6">
              {/* Static chat messages */}
              <StyledView className="space-y-4">
                <StyledView className="flex-row justify-start">
                    <StyledView className="bg-muted p-3 rounded-lg max-w-lg">
                      <StyledText>Hey! How are you?</StyledText>
                    </StyledView>
                </StyledView>
                <StyledView className="flex-row justify-end">
                  <StyledView className="bg-primary text-primary-foreground p-3 rounded-lg max-w-lg">
                    <StyledText>I'm good, thanks! Just working on the new Conéctame design. What do you think of the new feed?</StyledText>
                  </StyledView>
                </StyledView>
                <StyledView className="flex-row justify-start">
                    <StyledView className="bg-muted p-3 rounded-lg max-w-lg">
                      <StyledText>It looks amazing! Super clean and modern. Loving the color palette.</StyledText>
                    </StyledView>
                </StyledView>
              </StyledView>
            </ScrollArea>
            <StyledView className="p-4 border-t border-border bg-card">
              <StyledView className="relative">
                <Input placeholder="Type a message..." className="pr-20"/>
                <StyledView className="absolute right-2 top-1/2 -translate-y-1/2 flex-row items-center">
                  <Button className="bg-transparent p-1">
                    <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="black"/>
                  </Button>
                  <Button className="ml-2 px-3 py-2">
                    <MaterialCommunityIcons name="send" size={24} color="white"/>
                  </Button>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        )}
      </StyledView>
    </StyledView>
  );
}