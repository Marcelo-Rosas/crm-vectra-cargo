import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AppHeader } from '@/components/AppHeader'
import { AIPanel } from '@/components/AIPanel'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-hidden h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
        <AIPanel />
      </SidebarInset>
    </SidebarProvider>
  )
}
