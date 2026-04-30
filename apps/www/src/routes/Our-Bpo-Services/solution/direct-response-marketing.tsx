import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/our-bpo-services/solution/direct-response-marketing',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/Our-Bpo-Services/Solutions/direct_response_marketing"!</div>
  )
}
