"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/lib/data";
import { ArrowLeft, Search, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const conversations = [users['user-1'], users['user-2'], users['user-3']];

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState<User>(users['user-1']);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleConversationSelect = (user: User) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  }

  return (
    <div className="h-screen flex flex-col">
       <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full min-h-0">
         <div className={cn("col-span-1 border-r flex flex-col h-full", isChatOpen && "hidden md:flex")}>
           <div className="p-4 border-b">
            <h1 className="text-2xl font-bold font-headline">Messages</h1>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input placeholder="Search messages" className="pl-10"/>
            </div>
           </div>
           <ScrollArea className="flex-1">
              {conversations.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors" onClick={() => handleConversationSelect(user)}>
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile person"/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                  </div>
                </div>
              ))}
           </ScrollArea>
         </div>
         <div className={cn("col-span-1 md:col-span-2 lg:col-span-3 flex-col h-full bg-background", isChatOpen ? "flex" : "hidden md:flex")}>
          <div className="p-4 border-b flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsChatOpen(false)}>
                <ArrowLeft />
              </Button>
              <Avatar>
                <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} data-ai-hint="profile person"/>
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
              </div>
          </div>
          <div className="flex-1 p-6 flex flex-col-reverse overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg max-w-lg">
                    <p>Hey! How are you?</p>
                  </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-lg">
                  <p>I'm good, thanks! Just working on the new Conéctame design. What do you think of the new feed?</p>
                </div>
              </div>
               <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg max-w-lg">
                    <p>It looks amazing! Super clean and modern. Loving the color palette.</p>
                  </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t bg-card">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-20"/>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <Button variant="ghost" size="icon"><Smile/></Button>
                <Button variant="default" size="icon"><Send/></Button>
              </div>
            </div>
          </div>
         </div>
       </div>
    </div>
  );
}
