import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

const StyledView = styled(View);

type SidebarProps = React.ComponentProps<typeof StyledView> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

// This is a simplified Sidebar component for React Native.
// The full functionality (collapsible, mobile sheet) will be integrated with @react-navigation/drawer.
export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile } = useSidebar();

  // For mobile, we will eventually use a drawer navigator.
  // For now, we render a basic view.
  if (isMobile) {
    return (
      <StyledView
        className={cn(
          "flex h-full flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        {...props}
      >
        {children}
      </StyledView>
    );
  }

  // For larger screens, a more static sidebar
  return (
    <StyledView
      className={cn(
        "flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground", // Default width, can be adjusted
        className
      )}
      {...props}
    >
      {children}
    </StyledView>
  );
}

// Sub-components will be implemented similarly
export function SidebarHeader({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export function SidebarContent({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export function SidebarFooter({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    >
      {children}
    </StyledView>
  );
}

// These will likely be replaced by navigation components
export function SidebarMenu({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export function SidebarMenuItem({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </StyledView>
  );
}

// Placeholder for now, will be a TouchableOpacity or similar
export function SidebarMenuButton({ className, children, isActive, ...props }: React.ComponentProps<typeof StyledView> & { isActive?: boolean }) {
  return (
    <StyledView
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-colors",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </StyledView>
  );
}

// SidebarInset is for the main content area, for now it's just a View
export function SidebarInset({ className, children, ...props }: React.ComponentProps<typeof StyledView>) {
  return (
    <StyledView
      className={cn(
        "relative flex min-h-full flex-1 flex-col bg-background",
        className
      )}
      {...props}
    >
      {children}
    </StyledView>
  );
}
