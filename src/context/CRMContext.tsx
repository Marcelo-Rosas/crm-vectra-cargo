import { createContext, useContext, useState, ReactNode } from 'react'
import { BoardType, ColumnId, Deal, BOARD_COLUMNS } from '@/types/crm'

interface CRMContextType {
  currentBoard: BoardType
  setCurrentBoard: (board: BoardType) => void
  deals: Deal[]
  addDeal: (deal: Deal) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  moveDeal: (dealId: string, newStatus: ColumnId) => void
  columns: typeof BOARD_COLUMNS
  isAiPanelOpen: boolean
  setAiPanelOpen: (isOpen: boolean) => void
}

const CRMContext = createContext<CRMContextType | undefined>(undefined)

const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Carga de Eletrônicos #4023',
    clientName: 'TechVarejo Ltda',
    origin: 'São Paulo, SP',
    destination: 'Curitiba, PR',
    weight: 1200,
    volume: 3.5,
    value: 4500,
    status: 'new_request',
    board: 'quotation',
    createdAt: new Date(),
    updatedAt: new Date(),
    isLate: true,
  },
  {
    id: '2',
    title: 'Transporte de Máquinas #4024',
    clientName: 'Indústria ABC',
    origin: 'Campinas, SP',
    destination: 'Belo Horizonte, MG',
    weight: 5000,
    volume: 12,
    value: 12000,
    status: 'pricing',
    board: 'quotation',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Entrega Urgente - Peças Automotivas',
    clientName: 'AutoParts S.A.',
    origin: 'Guarulhos, SP',
    destination: 'Resende, RJ',
    weight: 800,
    volume: 2,
    value: 3200,
    status: 'sent_to_client',
    board: 'quotation',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Carga Frigorificada #901',
    clientName: 'Alimentos Frescos',
    origin: 'Uberlândia, MG',
    destination: 'São Paulo, SP',
    weight: 15000,
    volume: 40,
    value: 28000,
    status: 'in_transit',
    board: 'operation',
    createdAt: new Date(),
    updatedAt: new Date(),
    driverName: 'Carlos Silva',
    missingDocs: true,
  },
  {
    id: '5',
    title: 'Material de Construção #902',
    clientName: 'Construtora Forte',
    origin: 'Sorocaba, SP',
    destination: 'Rio de Janeiro, RJ',
    weight: 25000,
    volume: 60,
    value: 18000,
    status: 'order_created',
    board: 'operation',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function CRMProvider({ children }: { children: ReactNode }) {
  const [currentBoard, setCurrentBoard] = useState<BoardType>('quotation')
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)
  const [isAiPanelOpen, setAiPanelOpen] = useState(false)

  const addDeal = (deal: Deal) => {
    setDeals((prev) => [...prev, deal])
  }

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, ...updates, updatedAt: new Date() } : deal,
      ),
    )
  }

  const moveDeal = (dealId: string, newStatus: ColumnId) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === dealId
          ? { ...deal, status: newStatus, updatedAt: new Date() }
          : deal,
      ),
    )
  }

  return (
    <CRMContext.Provider
      value={{
        currentBoard,
        setCurrentBoard,
        deals,
        addDeal,
        updateDeal,
        moveDeal,
        columns: BOARD_COLUMNS,
        isAiPanelOpen,
        setAiPanelOpen,
      }}
    >
      {children}
    </CRMContext.Provider>
  )
}

export function useCRM() {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider')
  }
  return context
}
