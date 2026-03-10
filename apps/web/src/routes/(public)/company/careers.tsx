import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/company/careers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/company/careers"!</div>
}
