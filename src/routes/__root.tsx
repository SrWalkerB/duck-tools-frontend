import { Outlet, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'


export const Route = createRootRoute({
  component: App
})

function App(){
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return <>
    <Outlet />
  </>
}