import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";

import { AiCreationForm } from "@/components/create/AiCreationForm";

const StyledView = styled(View);
const StyledText = styled(Text);

export function CreatePostScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <StyledView className="p-4 sm:p-6 lg:p-8"> {/* Tailwind classes for padding */}
        <StyledView className="max-w-4xl mx-auto"> {/* Max width and center */}
          <StyledView className="space-y-2 mb-8">
            <StyledText className="text-3xl font-bold font-headline">AI-Powered Creation</StyledText>
            <StyledText className="text-muted-foreground">
              Need inspiration? Describe your post and let our AI suggest a filter or design a background for you.
            </StyledText>
          </StyledView>
          <AiCreationForm />
        </StyledView>
      </StyledView>
    </ScrollView>
  );
}
