import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/company/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/company/about"!</div>
}
