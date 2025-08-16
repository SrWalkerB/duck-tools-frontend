import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticate')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Outlet />
  )
}
