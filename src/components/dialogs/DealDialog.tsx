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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Deal } from '@/types/crm'
import { useCRM } from '@/context/CRMContext'
import { useState, useEffect } from 'react'
import { useDealStageSchema } from '@/hooks/use-deal-stage-schema'
import { DynamicStageForm } from '@/components/forms/DynamicStageForm'
import { Loader2 } from 'lucide-react'

interface DealDialogProps {
  deal: Deal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealDialog({ deal, open, onOpenChange }: DealDialogProps) {
  const { updateDeal } = useCRM()
  const [formData, setFormData] = useState<Partial<Deal>>(deal)

  // Use the hook to fetch schema
  const { data: schema, isLoading: isSchemaLoading } = useDealStageSchema(
    deal.stageId,
  )

  // Update form data when deal changes
  useEffect(() => {
    setFormData(deal)
  }, [deal])

  const handleSave = () => {
    updateDeal(deal.id, formData)
    onOpenChange(false)
  }

  const handleChange = (field: keyof Deal, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xl">{formData.title}</DialogTitle>
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
              {deal.board === 'quotation' ? 'Cotação' : 'Operação'}
            </span>
          </div>
          <DialogDescription>
            ID: {deal.id} • Criado em{' '}
            {new Date(deal.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes Gerais</TabsTrigger>
            <TabsTrigger value="qualification">Qualificação</TabsTrigger>
            {deal.board === 'quotation' ? (
              <TabsTrigger value="pricing">Precificação</TabsTrigger>
            ) : (
              <TabsTrigger value="tracking">Rastreamento</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    handleChange('value', Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Origem</Label>
                <Input
                  value={formData.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Destino</Label>
                <Input
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qualification" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    handleChange('weight', Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Volume (m³)</Label>
                <Input
                  type="number"
                  value={formData.volume}
                  onChange={(e) =>
                    handleChange('volume', Number(e.target.value))
                  }
                />
              </div>

              {/* Dynamic Form Integration */}
              {isSchemaLoading ? (
                <div className="col-span-2 flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : schema ? (
                <>
                  <div className="col-span-2">
                    <Separator className="my-2" />
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                      Informações da Etapa
                    </h4>
                    <DynamicStageForm
                      schema={schema}
                      data={formData as any}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2 col-span-2">
                  <Label>Restrições Operacionais</Label>
                  <Input
                    placeholder="Ex: Veículo Sider, Agendamento..."
                    value={formData.restrictions || ''}
                    onChange={(e) =>
                      handleChange('restrictions', e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {deal.board === 'quotation' && (
            <TabsContent value="pricing" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <Label>Frete Base (Motorista)</Label>
                  <Input
                    type="number"
                    value={formData.baseFreight || 0}
                    onChange={(e) =>
                      handleChange('baseFreight', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pedágio Estimado</Label>
                  <Input
                    type="number"
                    value={formData.tolls || 0}
                    onChange={(e) =>
                      handleChange('tolls', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Taxa de GR</Label>
                  <Input
                    type="number"
                    value={formData.riskManagementFee || 0}
                    onChange={(e) =>
                      handleChange('riskManagementFee', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Margem Alvo (%)</Label>
                  <Input
                    type="number"
                    value={formData.margin || 0}
                    onChange={(e) =>
                      handleChange('margin', Number(e.target.value))
                    }
                  />
                </div>
                <Separator className="col-span-2 my-2" />
                <div className="col-span-2 flex justify-between items-center font-bold">
                  <span>Custo Total Estimado:</span>
                  <span className="text-lg">
                    R${' '}
                    {(
                      (formData.baseFreight || 0) +
                      (formData.tolls || 0) +
                      (formData.riskManagementFee || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </TabsContent>
          )}

          {deal.board === 'operation' && (
            <TabsContent value="tracking" className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Motorista Alocado</Label>
                  <Input
                    value={formData.driverName || ''}
                    onChange={(e) => handleChange('driverName', e.target.value)}
                    placeholder="Nome do motorista"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chave NF-e</Label>
                  <Input
                    value={formData.nfeKey || ''}
                    onChange={(e) => handleChange('nfeKey', e.target.value)}
                    placeholder="0000 0000 0000 0000..."
                  />
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
