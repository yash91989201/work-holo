import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/our-bpo-services/solution/inbound-sales',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/inbound_sales"!</div>
}
