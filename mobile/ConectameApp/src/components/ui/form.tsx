import * as React from "react";
import { View, Text, TextInput } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

const StyledView = styled(View);
const StyledText = styled(Text);

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

export function FormItem({ className, ...props }: React.ComponentProps<typeof StyledView>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <StyledView className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

export function FormLabel({ className, ...props }: React.ComponentProps<typeof StyledText>) {
  const { error, formState } = useFormContext();
  const { name } = React.useContext(FormFieldContext);
  const { id } = React.useContext(FormItemContext);

  const formMessageId = error?.message ? `${id}-form-item-message` : undefined;

  return (
    <StyledText
      className={cn("text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  );
}

export function FormControl({ className, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView className={className} {...props} />
  );
}

export function FormDescription({ className, ...props }: React.ComponentProps<typeof StyledText>) {
  return (
    <StyledText className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function FormMessage({ className, children, ...props }: React.ComponentProps<typeof StyledText>) {
  const { error, formState } = useFormContext();
  const { name } = React.useContext(FormFieldContext);
  const { id } = React.useContext(FormItemContext);

  const body = error?.message;

  if (!body) {
    return null;
  }

  return (
    <StyledText
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </StyledText>
  );
}

// Re-export useFormContext for convenience
export { useFormContext };

// The main Form component that uses useFormContext implicitly
export function Form({
  children,
  ...props
}: React.ComponentProps<typeof StyledView> & {
  // Add any specific props you need for the Form, e.g., to pass form context explicitly
  // For now, it just renders children. The useFormContext is handled by FormField.
}) {
  return <StyledView {...props}>{children}</StyledView>;
}
