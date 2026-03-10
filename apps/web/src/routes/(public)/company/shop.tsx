import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/company/shop')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/company/shop"!</div>
}
