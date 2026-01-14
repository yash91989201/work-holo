import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import { Link, linkOptions, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
					<DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarImage alt={user.name} src={user?.image ?? undefined} />
							<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
							<div>
								<span className="truncate font-medium">{user.name} </span>
								<Badge variant="secondary">{role}</Badge>
							</div>
							<span className="truncate text-muted-foreground text-xs">
								{user.email}
							</span>
						</div>
						<IconDotsVertical className="ml-auto h-4 w-4" />
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						className="w-[--anchor-width]"
						side={isMobile ? "bottom" : "right"}
						sideOffset={12}
					>
						<div className="px-1.5 py-1 font-normal">
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

								<div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
									<div>
										<span className="truncate font-medium">{user.name} </span>
										<Badge variant="secondary">{role}</Badge>
									</div>
									<span className="truncate text-muted-foreground text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</div>

						<DropdownMenuSeparator />

						{/* Settings group with Account submenu */}
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-muted-foreground">
								Account
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{accountItems.map((item) => (
								<DropdownMenuItem key={item.to} render={<Link {...item} />}>
									{item.label}
								</DropdownMenuItem>
							))}
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
