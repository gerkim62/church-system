import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/ob/no-church')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/ob/no-church"!</div>
}
