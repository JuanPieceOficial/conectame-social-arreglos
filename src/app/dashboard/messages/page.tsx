import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/lib/data";
import { Search, Send, Smile } from "lucide-react";

const conversations = [users['user-1'], users['user-2'], users['user-3']];

export default function MessagesPage() {
  return (
    <div className="h-screen flex flex-col">
       <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full min-h-0">
         <div className="col-span-1 border-r flex flex-col h-full">
           <div className="p-4 border-b">
            <h1 className="text-2xl font-bold font-headline">Messages</h1>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input placeholder="Search messages" className="pl-10"/>
            </div>
           </div>
           <ScrollArea className="flex-1">
              {conversations.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors">
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
         <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full bg-background">
          <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage src={users['user-1'].avatarUrl} alt={users['user-1'].name} data-ai-hint="profile person"/>
                <AvatarFallback>{users['user-1'].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{users['user-1'].name}</p>
                <p className="text-sm text-muted-foreground">@{users['user-1'].username}</p>
              </div>
          </div>
          <div className="flex-1 p-6 flex flex-col-reverse">
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
