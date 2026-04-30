import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Our-Bpo-Services/Industries/healthcare')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/Our-Bpo-Services/Industries/healthcare"!</div>
}
