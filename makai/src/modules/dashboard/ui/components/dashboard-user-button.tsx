import { authClient } from "@/lib/auth-client";
import { ChevronDown, CreditCardIcon, LogOutIcon } from "lucide-react";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data: session , isPending} = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions:{
        onSuccess: () => router.push("/sign-in")
      }
    })
  }

  if(!session?.user) return null;
  if(isPending) return null;

  if(isMobile){
    return (
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 gap-x-2 overflow-hidden">
          {session.user.image ? (
            <Avatar>
              <AvatarImage src={session.user.image}/>
            </Avatar>
          ) : 
          <GeneratedAvatar variant="initials" className="size-9 mr-3" seed={session.user.name}/>}
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">{session.user.name}</p>
            {/* <p className="text-xs truncate w-full">{session.user.email}</p> */}
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {session.user.name}
            </DrawerTitle>
            <DrawerDescription>
              {session.user.email}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant={"outline"} onClick={()=> {}}>
              Billing <CreditCardIcon className="size-4 text-black"/>
            </Button>
            <Button variant={"outline"} onClick={onLogout}>
              Logout <LogOutIcon className="size-4"/>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  
  return <DropdownMenu>
    <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 gap-x-2 overflow-hidden">
      {session.user.image ? (
        <Avatar>
          <AvatarImage src={session.user.image}/>
        </Avatar>
      ) : 
      <GeneratedAvatar variant="initials" className="size-9 mr-3" seed={session.user.name}/>}
      <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
        <p className="text-sm truncate w-full">{session.user.name}</p>
        {/* <p className="text-xs truncate w-full">{session.user.email}</p> */}

      </div>
      <ChevronDown className="size-4 shrink-0"/>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" side="right" className="w-72">
      <DropdownMenuLabel>
        <div className="flex flex-col gap-1">
          <span className="font-medium truncate">{session.user.name}</span>
          {/* <span className="text-sm font-normal text-muted-foreground truncate">{session.user.email}</span> */}

        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator/>
      <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
        Billing <CreditCardIcon className="size-4"/>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer flex items-center justify-between" onClick={onLogout}>
        Logout <LogOutIcon className="size-4"/>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
};
