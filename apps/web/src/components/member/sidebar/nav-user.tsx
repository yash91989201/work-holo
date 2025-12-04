import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import {
  Link,
  linkOptions,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useMemberRole } from "@/hooks/use-member-role";
import { authClient } from "@/lib/auth-client";

const accountItems = linkOptions([
  {
    label: "Preferences",
    to: "/settings/account/preferences",
  },
  {
    label: "Profile",
    to: "/settings/account/profile",
  },
  {
    label: "Notifications",
    to: "/settings/account/notifications",
  },
  {
    label: "Security & access",
    to: "/settings/account/security",
  },
]);

export function NavUser() {
  const navigate = useNavigate();
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const { isMobile } = useSidebar();
  const { user } = useAuthedSession();
  const role = useMemberRole();

  const logout = async () => {
    const signOutRes = await authClient.signOut();
    if (signOutRes.error) {
      toast("Unable to logout, try again");
      return;
    }

    navigate({ to: "/login" });
  };

  const initials =
    user?.name?.trim().slice(0, 2).toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage alt={user.name} src={user?.image ?? undefined} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {/* Profile header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt={user?.name}
                    src={user?.image ?? undefined}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Organization-scoped actions */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground">
                Organization
              </DropdownMenuLabel>

              {role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link params={{ slug }} to="/org/$slug/dashboard">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}

              {role === "owner" && (
                <DropdownMenuItem asChild>
                  <Link params={{ slug }} to="/org/$slug/manage">
                    Manage Organization
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Settings group with Account submenu */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground">
                Settings
              </DropdownMenuLabel>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Account</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {accountItems.map((item) => (
                      <DropdownMenuItem asChild key={item.to}>
                        <Link {...item}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout - destructive */}
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={logout}
            >
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
// import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
// import { Link, useNavigate, useParams } from "@tanstack/react-router";
// import { toast } from "sonner";
//
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { useAuthedSession } from "@/hooks/use-authed-session";
// import { useMemberRole } from "@/hooks/use-member-role";
// import { authClient } from "@/lib/auth-client";
//
// export function NavUser() {
//   const navigate = useNavigate();
//   const { slug } = useParams({
//     from: "/(authenticated)/org/$slug",
//   });
//
//   const { isMobile } = useSidebar();
//   const { user } = useAuthedSession();
//   const role = useMemberRole();
//
//   const logout = async () => {
//     const signOutRes = await authClient.signOut();
//     if (signOutRes.error) {
//       toast("Unable to logout, try again");
//       return;
//     }
//
//     navigate({ to: "/login" });
//   };
//
//   const initials =
//     user?.name?.trim().slice(0, 2).toUpperCase() ??
//     user?.email?.[0]?.toUpperCase() ??
//     "U";
//
//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton size="lg">
//               <Avatar className="h-8 w-8 rounded-lg grayscale">
//                 <AvatarImage alt={user?.name} src={user?.image ?? undefined} />
//                 <AvatarFallback className="rounded-lg">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-medium">{user?.name}</span>
//                 <span className="truncate text-xs text-muted-foreground">
//                   {user?.email}
//                 </span>
//               </div>
//               <IconDotsVertical className="ml-auto h-4 w-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//
//           <DropdownMenuContent
//             align="end"
//             className="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             sideOffset={4}
//           >
//             {/* Profile header */}
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage
//                     alt={user?.name}
//                     src={user?.image ?? undefined}
//                   />
//                   <AvatarFallback className="rounded-lg">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-medium">{user?.name}</span>
//                   <span className="truncate text-xs text-muted-foreground">
//                     {user?.email}
//                   </span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//
//             <DropdownMenuSeparator />
//
//             {/* Organization-scoped actions */}
//             <DropdownMenuGroup>
//               <DropdownMenuLabel className="text-muted-foreground">
//                 Organization
//               </DropdownMenuLabel>
//
//               {role === "admin" && (
//                 <DropdownMenuItem asChild>
//                   <Link params={{ slug }} to="/org/$slug/dashboard/members">
//                     Dashboard
//                   </Link>
//                 </DropdownMenuItem>
//               )}
//
//               {role === "owner" && (
//                 <DropdownMenuItem asChild>
//                   <Link params={{ slug }} to="/org/$slug/manage">
//                     Manage Organization
//                   </Link>
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuGroup>
//
//             <DropdownMenuSeparator />
//
//             {/* Account / Settings */}
//             <DropdownMenuGroup>
//               <DropdownMenuLabel className="text-muted-foreground">
//                 Account
//               </DropdownMenuLabel>
//
//               <DropdownMenuItem asChild>
//                 <Link to="/settings/account/profile">Profile</Link>
//               </DropdownMenuItem>
//
//               <DropdownMenuItem asChild>
//                 <Link to="/settings/account/preferences">Preferences</Link>
//               </DropdownMenuItem>
//
//               <DropdownMenuItem asChild>
//                 <Link to="/settings/account/notifications">Notifications</Link>
//               </DropdownMenuItem>
//
//               <DropdownMenuItem asChild>
//                 <Link to="/settings/account/security">Security</Link>
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//
//             <DropdownMenuSeparator />
//
//             {/* Logout - destructive */}
//             <DropdownMenuItem
//               onClick={logout}
//               className="text-destructive focus:bg-destructive/10 focus:text-destructive"
//             >
//               <IconLogout className="mr-2 h-4 w-4" />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
