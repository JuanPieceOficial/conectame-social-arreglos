import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

type RadioGroupContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

export function RadioGroup({
  children,
  value,
  onValueChange,
  className,
  ...props
}: React.ComponentProps<typeof StyledView> & RadioGroupContextType) {
  const contextValue = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <StyledView className={cn("flex flex-col space-y-2", className)} {...props}>
        {children}
      </StyledView>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  children,
  value,
  className,
  ...props
}: React.ComponentProps<typeof StyledTouchableOpacity> & { value: string }) {
  const context = React.useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup.");
  }

  const isSelected = context.value === value;

  return (
    <StyledTouchableOpacity
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2",
        isSelected && "bg-primary",
        className
      )}
      onPress={() => context.onValueChange && context.onValueChange(value)}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      {...props}
    >
      {isSelected && (
        <StyledView className="flex h-full w-full items-center justify-center">
          <StyledView className="h-2 w-2 rounded-full bg-primary-foreground" />
        </StyledView>
      )}
    </StyledTouchableOpacity>
  );
}
