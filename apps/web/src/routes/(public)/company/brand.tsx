import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/company/brand')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/company/brand"!</div>
}
