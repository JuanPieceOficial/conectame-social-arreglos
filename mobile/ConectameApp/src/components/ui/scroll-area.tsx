import * as React from "react";
import { ScrollView, View } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);

// This is a simplified ScrollArea component for React Native.
// The original web version might have more advanced features or custom scrollbars.
export function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof StyledScrollView>) {
  return (
    <StyledScrollView
      className={cn("flex-1", className)} // flex-1 to make it take available space
      showsVerticalScrollIndicator={false} // Hide scroll indicator by default
      {...props}
    >
      {children}
    </StyledScrollView>
  );
}

// Optionally, if there's a need for a "Viewport" or "ScrollBar" sub-component,
// they would be implemented here, but for a basic migration, ScrollView is usually enough.
