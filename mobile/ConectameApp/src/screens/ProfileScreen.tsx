import * as React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export function ProfileScreen() {
  return (
    <StyledView className="flex-1 justify-center items-center bg-background">
      <StyledText className="text-2xl font-bold">Profile Screen</StyledText>
    </StyledView>
  );
}
