import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/Our-Bpo-Services/Solutions/direct_response_marketing',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/Our-Bpo-Services/Solutions/direct_response_marketing"!</div>
  )
}
