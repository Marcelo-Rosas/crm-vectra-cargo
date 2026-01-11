import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCRM } from '@/context/CRMContext'
import { NewDealDialog } from '@/components/dialogs/NewDealDialog'
import { useState } from 'react'

const Index = () => {
  const { currentBoard } = useCRM()
  const [isNewDealOpen, setIsNewDealOpen] = useState(false)

  const boardTitle =
    currentBoard === 'quotation'
      ? 'Board 1 — Cotação de Frete'
      : 'Board 2 — Operação Rodoviária'

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{boardTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas{' '}
            {currentBoard === 'quotation'
              ? 'oportunidades comerciais'
              : 'ordens de serviço'}{' '}
            aqui.
          </p>
        </div>
        <Button onClick={() => setIsNewDealOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      <div className="flex-1 overflow-hidden bg-muted/20">
        <KanbanBoard />
      </div>

      <NewDealDialog open={isNewDealOpen} onOpenChange={setIsNewDealOpen} />
    </div>
  )
}

export default Index
