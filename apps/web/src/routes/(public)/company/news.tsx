import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/company/news')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/company/news"!</div>
}
