import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledView = styled(View);

export function Card({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export function CardHeader({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </StyledView>
  );
}

export function CardContent({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView className={cn("p-6", className)} {...props}>
      {children}
    </StyledView>
  );
}

export function CardFooter({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </StyledView>
  );
}
