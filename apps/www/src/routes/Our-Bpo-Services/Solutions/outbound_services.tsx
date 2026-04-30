import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/Our-Bpo-Services/Solutions/outbound_services',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/Outbound_Services"!</div>
}
