import * as React from "react";
import { TextInput, View, Text } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledText = styled(Text);

// This is a basic Input component.
// For file input (`type="file"`), a separate component or library will be needed in React Native.
export function Input({ className, type = "text", ...props }: React.ComponentProps<typeof StyledTextInput> & { type?: string }) {
  // In React Native, 'type' is not directly used for TextInput like in HTML.
  // We can map common HTML types to keyboardType, but "file" type is handled differently.
  let keyboardType: React.ComponentProps<typeof TextInput>['keyboardType'] = 'default';
  if (type === 'email') keyboardType = 'email-address';
  if (type === 'number') keyboardType = 'numeric';
  if (type === 'tel') keyboardType = 'phone-pad';
  if (type === 'url') keyboardType = 'url';

  if (type === "file") {
    // For file input, we return a placeholder view or a specialized component.
    // This will eventually be replaced by a proper file picker integration.
    return (
      <StyledView
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground",
          "items-center justify-center", // Center text for file input placeholder
          className
        )}
      >
        <StyledText className="text-muted-foreground">File input (Not implemented)</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledTextInput
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      placeholderTextColor="hsl(var(--muted-foreground))"
      keyboardType={keyboardType}
      secureTextEntry={type === 'password'}
      {...props}
    />
  );
}
