import * as React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

// This is a simplified Button component.
// The original web version used `class-variance-authority` (cva) for variants and sizes.
// For now, we'll create a basic version and extend it as needed.
export function Button({
  className,
  textClassName, // Additional className for the Text component inside the button
  children,
  ...props
}: React.ComponentProps<typeof StyledTouchableOpacity> & {textClassName?: string}) {
  return (
    <StyledTouchableOpacity
      className={cn(
        "flex-row items-center justify-center rounded-md bg-primary px-4 py-2",
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <StyledText className={cn("text-primary-foreground font-medium", textClassName)}>
          {children}
        </StyledText>
      ) : (
        children
      )}
    </StyledTouchableOpacity>
  );
}
