import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/our-bpo-services/solution/payment-processing',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/payment_processing"!</div>
}
