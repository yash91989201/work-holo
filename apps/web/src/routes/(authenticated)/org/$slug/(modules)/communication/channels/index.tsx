import { createFileRoute } from "@tanstack/react-router";
import {
	ChannelFeatures,
	ChannelTypes,
	GettingStarted,
	RecentChannels,
} from "@/components/member/communication/channels/overview";
import { ChannelTips } from "@/components/member/communication/channels/overview/tips";

export const Route = createFileRoute(
	"/(authenticated)/org/$slug/(modules)/communication/channels/"
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-6 p-6">
			<RecentChannels />
			<GettingStarted />
			<ChannelTypes />
			<ChannelFeatures />
			<ChannelTips />
		</div>
	);
}
