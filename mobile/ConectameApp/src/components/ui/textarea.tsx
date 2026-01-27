import * as React from "react";
import { TextInput } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledTextInput = styled(TextInput);

export function Textarea({ className, ...props }: React.ComponentProps<typeof StyledTextInput>) {
  return (
    <StyledTextInput
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      multiline
      placeholderTextColor="hsl(var(--muted-foreground))" // NativeWind doesn't handle this automatically
      {...props}
    />
  );
}
