import { Deal, Column } from '@/types/crm'
import { DealCard } from './DealCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface KanbanColumnProps {
  column: Column
  deals: Deal[]
  onDealClick: (deal: Deal) => void
  onDealMove: (dealId: string, targetColumnId: string) => void
}

export function KanbanColumn({
  column,
  deals,
  onDealClick,
  onDealMove,
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const dealId = e.dataTransfer.getData('dealId')
    if (dealId) {
      onDealMove(dealId, column.id)
    }
  }

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full min-w-[280px] max-w-[280px] rounded-lg bg-muted/40 border border-transparent transition-colors',
        isOver && 'bg-muted border-primary/20',
        column.color,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-3 flex items-center justify-between shrink-0">
        <h3 className="font-medium text-sm text-foreground/80 flex items-center gap-2">
          {column.title}
          <span className="flex items-center justify-center bg-background border rounded-full h-5 w-5 text-[10px] font-bold text-muted-foreground">
            {deals.length}
          </span>
        </h3>
      </div>

      <ScrollArea className="flex-1 px-2 pb-2">
        <div className="space-y-2 pb-4">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDealClick(deal)}
              onDragStart={handleDragStart}
            />
          ))}
          {deals.length === 0 && (
            <div className="h-20 border-2 border-dashed border-muted-foreground/10 rounded-lg flex items-center justify-center text-xs text-muted-foreground/50">
              Arraste aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
