import { Bell, Search, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useCRM } from '@/context/CRMContext'

export function AppHeader() {
  const { setAiPanelOpen } = useCRM()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      <div className="flex-1 flex items-center gap-4">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pedidos, chaves NF-e ou motoristas..."
            className="w-full bg-muted/50 pl-8 shadow-none border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 px-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
          <span className="sr-only">Notificações</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hidden md:flex text-primary hover:text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
          onClick={() => setAiPanelOpen(true)}
        >
          <Bot className="h-4 w-4" />
          Assistente IA
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setAiPanelOpen(true)}
        >
          <Bot className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
