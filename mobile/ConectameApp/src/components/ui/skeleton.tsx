import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledView = styled(View);

export function Skeleton({ className, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
