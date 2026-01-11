import { useCRM } from '@/context/CRMContext'
import { KanbanColumn } from './KanbanColumn'
import { Deal } from '@/types/crm'
import { DealDialog } from '@/components/dialogs/DealDialog'
import { useState } from 'react'

export function KanbanBoard() {
  const { currentBoard, columns, deals, moveDeal } = useCRM()
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const boardColumns = columns[currentBoard]

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-4 pb-2 items-start">
      {boardColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          deals={deals.filter(
            (d) => d.status === column.id && d.board === currentBoard,
          )}
          onDealClick={handleDealClick}
          onDealMove={(dealId, targetId) => moveDeal(dealId, targetId as any)}
        />
      ))}

      {selectedDeal && (
        <DealDialog
          deal={selectedDeal}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  )
}
