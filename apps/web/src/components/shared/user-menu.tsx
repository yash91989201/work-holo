import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemberRole } from "@/hooks/use-member-role";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
	const navigate = useNavigate();
	const session = useSession();
	const role = useMemberRole();

	if (!session) {
		return (
			<Button render={<Link to="/login" />} variant="outline">
				LogIn
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				{session.user.name}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="space-y-1.5 bg-card">
				<DropdownMenuLabel className="space-y-1.5">
					<div className="space-x-1.5">
						<span>{session.user.name}</span>
						{role !== null ? <Badge>{role}</Badge> : null}
					</div>
					<p className="max-w-[24ch] overflow-hidden text-ellipsis whitespace-nowrap">
						{session.user.email}
					</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem render={<Link to="/settings/account/preferences" />}>
					Preferences
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link to="/settings/account/profile" />}>
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									navigate({
										to: "/",
									});
								},
							},
						});
					}}
					variant="destructive"
				>
					Log Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
