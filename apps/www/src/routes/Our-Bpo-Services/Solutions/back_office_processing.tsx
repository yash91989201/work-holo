import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/Our-Bpo-Services/Solutions/back_office_processing',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Solutions/back_office_processing"!</div>
}
