import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePresenceHeartbeat } from "@/hooks/use-presence";
import { authClient } from "@/lib/auth-client";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/(authenticated)/org/$slug")({
	loader: async () => {
		const activeOrganization =
			await authClient.organization.getFullOrganization();

		const { data, error } = await authClient.organization.getActiveMemberRole();

		if (error !== null) {
			throw new Error("Failed to load member role");
		}

		return {
			logoSrc: activeOrganization.data?.logo ?? undefined,
			role: data.role,
		};
	},
	head: ({ loaderData }) => ({
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: loaderData?.logoSrc,
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<SidebarProvider
				defaultOpen={false}
				style={
					{
						"--sidebar-width": "calc(var(--spacing) * 72)",
						"--header-height": "calc(var(--spacing) * 12)",
					} as React.CSSProperties
				}
			>
				<Sidebar variant="sidebar" />
				<SidebarInset>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>

			<Suspense fallback={null}>
				<OrgPresenceHeartbeat />
			</Suspense>
		</>
	);
}

function OrgPresenceHeartbeat() {
	const { data: attendance } = useSuspenseQuery(
		queryUtils.member.attendance.getStatus.queryOptions({})
	);

	const hasCheckedIn = Boolean(attendance?.checkInTime);
	const hasCheckedOut = Boolean(attendance?.checkOutTime);
	const isWorking = hasCheckedIn && !hasCheckedOut;

	usePresenceHeartbeat({
		enabled: isWorking,
		punchedIn: isWorking,
		onBreak: false,
	});

	return null;
}
