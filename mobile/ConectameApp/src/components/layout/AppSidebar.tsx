import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar-context';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { users } from '@/lib/data';

// Styled components using NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Placeholder for Avatar, Button - these will be created later as proper UI components
const Avatar = ({ children }: { children: React.ReactNode }) => (
  <StyledView className="rounded-full bg-gray-200 w-10 h-10 items-center justify-center">
    {children}
  </StyledView>
);
const AvatarImage = ({ src, alt }: { src: string; alt: string }) => (
  <StyledImage source={{ uri: src }} className="rounded-full w-10 h-10" />
);
const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <StyledText className="text-gray-600">{children}</StyledText>
);

const Button = ({ children, className, ...props }: React.ComponentProps<typeof StyledTouchableOpacity>) => (
    <StyledTouchableOpacity className={cn("px-4 py-2 rounded-md bg-primary", className)} {...props}>
        {children}
    </StyledTouchableOpacity>
);

const Logo = () => (
    <MaterialCommunityIcons name="circle" size={24} color="hsl(var(--primary))" /> // Placeholder icon
);


export function AppSidebar() {
  const navigation = useNavigation();
  const route = useRoute(); // To get the current route name for isActive
  const { toggleSidebar } = useSidebar();
  const currentUser = users["user-current"];

  const menuItems = [
    { href: "Home", label: "Home", icon: "home" }, // Mapped to MaterialCommunityIcons name
    { href: "Explore", label: "Explore", icon: "magnify" },
    { href: "Messages", label: "Messages", icon: "message-square" },
  ];

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName as never); // Type assertion as navigation.navigate expects a specific type
    toggleSidebar(); // Close sidebar after navigation
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <StyledView className="flex flex-row items-center gap-2">
          <Logo />
          <StyledText className="text-xl font-headline font-semibold text-primary">Conéctame</StyledText>
        </StyledView>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                onPress={() => handleNavigation(item.href)}
                isActive={route.name === item.href}
              >
                <MaterialCommunityIcons name={item.icon} size={20} color="black" />
                <StyledText>{item.label}</StyledText>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <StyledView className="mt-4 px-2">
           <Button onPress={() => handleNavigation("CreatePost")} className="w-full">
                <StyledView className="flex flex-row items-center justify-center">
                    <MaterialCommunityIcons name="plus-box" size={20} color="white" className="mr-2"/>
                    <StyledText className="text-white font-headline">Create Post</StyledText>
                </StyledView>
            </Button>
        </StyledView>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton onPress={() => handleNavigation("Profile")}>
                <MaterialCommunityIcons name="account" size={20} color="black" /> <StyledText>Profile</StyledText>
            </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton onPress={() => handleNavigation("Settings")}>
                <MaterialCommunityIcons name="cog" size={20} color="black" /> <StyledText>Settings</StyledText>
            </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
        <StyledView className="p-2">
            <StyledView className="flex flex-row items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
                <Avatar>
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <StyledView className="flex flex-col overflow-hidden flex-1">
                    <StyledText className="font-semibold truncate">{currentUser.name}</StyledText>
                    <StyledText className="text-xs text-muted-foreground truncate">@{currentUser.username}</StyledText>
                </StyledView>
                <StyledTouchableOpacity className="ml-auto p-1"> {/* Simplified button */}
                    <MaterialCommunityIcons name="logout" size={20} color="black"/>
                </StyledTouchableOpacity>
            </StyledView>
        </StyledView>
      </SidebarFooter>
    </Sidebar>
  );
}
