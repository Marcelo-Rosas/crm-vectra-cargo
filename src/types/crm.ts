export type BoardType = 'quotation' | 'operation'

export type ColumnId =
  // Quotation Board
  | 'new_request'
  | 'qualification'
  | 'pricing'
  | 'sent_to_client'
  | 'negotiation'
  | 'won'
  | 'lost'
  // Operation Board
  | 'order_created'
  | 'driver_search'
  | 'documentation'
  | 'collection'
  | 'in_transit'
  | 'delivered'

export interface Column {
  id: ColumnId
  title: string
  color?: string
}

export interface Deal {
  id: string
  title: string
  clientName: string
  origin: string
  destination: string
  weight: number // kg
  volume: number // m3
  value: number
  status: ColumnId
  board: BoardType
  createdAt: Date
  updatedAt: Date

  // Qualification Details
  deadline?: Date
  restrictions?: string
  merchandiseValue?: number

  // Pricing Details
  baseFreight?: number
  tolls?: number
  riskManagementFee?: number
  margin?: number

  // Operation Details
  driverName?: string
  driverVehicle?: string
  nfeKey?: string
  podUrl?: string

  // Alerts
  isLate?: boolean
  missingDocs?: boolean
}

export const BOARD_COLUMNS: Record<BoardType, Column[]> = {
  quotation: [
    {
      id: 'new_request',
      title: 'Novo Pedido',
      color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    { id: 'qualification', title: 'Qualificação' },
    { id: 'pricing', title: 'Precificação' },
    { id: 'sent_to_client', title: 'Enviado ao Cliente' },
    { id: 'negotiation', title: 'Negociação' },
    { id: 'won', title: 'Ganho', color: 'bg-green-100 dark:bg-green-900/20' },
    { id: 'lost', title: 'Perdido', color: 'bg-red-100 dark:bg-red-900/20' },
  ],
  operation: [
    { id: 'order_created', title: 'Ordem Criada' },
    { id: 'driver_search', title: 'Busca de Motorista' },
    { id: 'documentation', title: 'Documentação' },
    { id: 'collection', title: 'Coleta Realizada' },
    {
      id: 'in_transit',
      title: 'Em Trânsito',
      color: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      id: 'delivered',
      title: 'Entregue (Canhoto)',
      color: 'bg-green-100 dark:bg-green-900/20',
    },
  ],
}
