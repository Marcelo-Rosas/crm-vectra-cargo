import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCRM } from '@/context/CRMContext'
import { useState } from 'react'
import { Deal } from '@/types/crm'
import { useToast } from '@/hooks/use-toast'

interface NewDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewDealDialog({ open, onOpenChange }: NewDealDialogProps) {
  const { addDeal, currentBoard } = useCRM()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    origin: '',
    destination: '',
    weight: 0,
    volume: 0,
    value: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.clientName) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor preencha o título e o nome do cliente.',
        variant: 'destructive',
      })
      return
    }

    const newDeal: Deal = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: currentBoard === 'quotation' ? 'new_request' : 'order_created',
      board: currentBoard,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addDeal(newDeal)
    toast({
      title: 'Sucesso',
      description: 'Novo card criado com sucesso.',
    })
    setFormData({
      title: '',
      clientName: '',
      origin: '',
      destination: '',
      weight: 0,
      volume: 0,
      value: 0,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Card</DialogTitle>
          <DialogDescription>
            Adicione um novo pedido ao quadro de{' '}
            {currentBoard === 'quotation' ? 'Cotação' : 'Operação'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="col-span-3"
              placeholder="Ex: Carga de Soja"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Cliente
            </Label>
            <Input
              id="client"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Rota</Label>
            <div className="col-span-3 flex gap-2">
              <Input
                placeholder="Origem"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
              />
              <Input
                placeholder="Destino"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Carga</Label>
            <div className="col-span-3 flex gap-2">
              <Input
                placeholder="Peso (kg)"
                type="number"
                value={formData.weight || ''}
                onChange={(e) =>
                  setFormData({ ...formData, weight: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Vol (m³)"
                type="number"
                value={formData.volume || ''}
                onChange={(e) =>
                  setFormData({ ...formData, volume: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Criar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
