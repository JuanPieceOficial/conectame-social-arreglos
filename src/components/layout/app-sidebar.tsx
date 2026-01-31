"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Search, MessageSquare, PlusSquare, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { users } from "@/lib/data";

const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="hsl(var(--primary))"/>
    <path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="hsl(var(--accent))"/>
  </svg>
);


export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = users["user-current"];

  const menuItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/explore", label: "Explore", icon: Search },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-headline font-semibold text-primary">Conéctame</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-4 px-2">
           <Link href="/dashboard/create">
             <Button asChild size="lg" className="w-full font-headline">
                <span>
                    <PlusSquare className="mr-2"/>
                    Create Post
                </span>
            </Button>
           </Link>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton tooltip={{children: "Profile"}}>
                <User /> <span>Profile</span>
            </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton tooltip={{children: "Settings"}}>
                <Settings /> <span>Settings</span>
            </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
                <Avatar>
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="profile person"/>
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <p className="font-semibold truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{currentUser.username}</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
