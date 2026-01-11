import { Deal } from '@/types/crm'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  FileWarning,
  MapPin,
  Truck,
  CalendarClock,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DealCardProps {
  deal: Deal
  onClick: () => void
  onDragStart: (e: React.DragEvent, dealId: string) => void
}

export function DealCard({ deal, onClick, onDragStart }: DealCardProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="cursor-pointer hover:shadow-md transition-shadow active:cursor-grabbing border-l-4 border-l-primary group"
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {deal.title}
          </h4>
          {(deal.isLate || deal.missingDocs) && (
            <div className="flex gap-1 shrink-0">
              {deal.isLate && (
                <CalendarClock className="h-4 w-4 text-destructive" />
              )}
              {deal.missingDocs && (
                <FileWarning className="h-4 w-4 text-amber-500" />
              )}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {deal.origin} → {deal.destination}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            <Truck className="h-3 w-3 shrink-0" />
            <span>
              {deal.weight}kg • {deal.volume}m³
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t">
          <Badge
            variant="secondary"
            className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground"
          >
            {deal.clientName}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(deal.updatedAt, {
              locale: ptBR,
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
