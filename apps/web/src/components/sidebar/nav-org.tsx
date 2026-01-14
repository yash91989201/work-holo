import { IconDeviceDesktopCog } from "@tabler/icons-react";
import {
	Link,
	linkOptions,
	useLoaderData,
	useParams,
} from "@tanstack/react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

export function NavOrg() {
	const { slug } = useParams({
		from: "/(authenticated)/org/$slug",
	});

	const { role } = useLoaderData({
		from: "/(authenticated)/org/$slug",
	});

	if (role !== "owner") {
		return null;
	}

	const items = linkOptions([
		{
			to: "/org/$slug/manage",
			params: { slug },
			label: "Manage",
			icon: IconDeviceDesktopCog,
		},
	]);

	return (
		<>
			<SidebarSeparator />

			<SidebarGroup>
				<SidebarGroupLabel>My Organization</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.label}>
								<SidebarMenuButton
									render={<Link {...item} />}
									tooltip={item.label}
								>
									{item.icon && <item.icon />}
									<span>{item.label}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	);
}
