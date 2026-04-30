import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/our-bpo-services/solution/facility-and-procurement',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/Our-Bpo-Services/Solutions/facility_and_procurement"!</div>
  )
}
