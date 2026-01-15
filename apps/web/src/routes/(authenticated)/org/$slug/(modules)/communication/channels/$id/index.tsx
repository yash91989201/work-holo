import { createFileRoute } from "@tanstack/react-router";
import { ChannelSkeleton } from "@/components/member/communication/channels/channel-skeleton";
import { MessageComposer } from "@/components/member/communication/channels/message-composer";
import { MaximizedMessageComposer } from "@/components/member/communication/channels/message-composer/maximized-message-composer";
import { MessageList } from "@/components/member/communication/channels/message-list";

export const Route = createFileRoute(
	"/(authenticated)/org/$slug/(modules)/communication/channels/$id/"
)({
	beforeLoad: ({ context: { queryClient, queryUtils }, params }) => {
		queryClient.prefetchQuery(
			queryUtils.communication.message.searchUsers.queryOptions({
				input: {
					channelId: params.id,
					query: "",
					limit: 10,
				},
			})
		);
	},
	pendingComponent: ChannelSkeleton,
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background shadow-sm">
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<MessageList key={id} />
				<MessageComposer channelId={id} />
			</div>
			<MaximizedMessageComposer />
		</div>
	);
}
