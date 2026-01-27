import * as React from "react";
import { View, Image, Text } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledText = styled(Text);

export function Avatar({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export function AvatarImage({ className, src, alt, ...props }: React.ComponentProps<typeof StyledImage> & { src: string; alt: string }) {
  return (
    <StyledImage
      source={{ uri: src }}
      alt={alt}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <StyledText className="text-muted-foreground">{children}</StyledText>
    </StyledView>
  );
}
