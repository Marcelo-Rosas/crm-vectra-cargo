import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SchemaField, FieldType } from '@/types/crm'

interface FieldEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  field: SchemaField | null
  onSave: (field: SchemaField) => void
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto Curto' },
  { value: 'textarea', label: 'Texto Longo' },
  { value: 'number', label: 'Numérico' },
  { value: 'currency', label: 'Moeda' },
  { value: 'date', label: 'Data' },
  { value: 'checkbox', label: 'Caixa de Seleção' },
  { value: 'select', label: 'Seleção Única' },
  { value: 'file', label: 'Upload de Arquivo' },
]

export function FieldEditorDialog({
  open,
  onOpenChange,
  field,
  onSave,
}: FieldEditorDialogProps) {
  const [formData, setFormData] = useState<SchemaField>({
    key: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
  })

  const [optionsString, setOptionsString] = useState('')

  useEffect(() => {
    if (field) {
      setFormData(field)
      setOptionsString(field.options?.join(', ') || '')
    } else {
      setFormData({
        key: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        options: [],
      })
      setOptionsString('')
    }
  }, [field, open])

  const handleLabelChange = (value: string) => {
    const updates: Partial<SchemaField> = { label: value }
    // Auto-generate key if creating new field
    if (!field && !formData.key) {
      updates.key = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
    }
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    const finalField = { ...formData }
    if (formData.type === 'select') {
      finalField.options = optionsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    onSave(finalField)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {field ? 'Editar Campo' : 'Adicionar Novo Campo'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Rótulo (Label)</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Ex: Número do Contrato"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="key">Chave do Sistema (Key)</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value })
              }
              placeholder="contract_number"
              className="font-mono text-sm"
              disabled={!!field} // Disable key editing for existing fields to prevent data loss
            />
            <p className="text-[10px] text-muted-foreground">
              Identificador único usado no banco de dados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Campo</Label>
              <Select
                value={formData.type}
                onValueChange={(val: FieldType) =>
                  setFormData({ ...formData, type: val })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={formData.required}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, required: !!checked })
                  }
                />
                <Label htmlFor="required">Obrigatório</Label>
              </div>
            </div>
          </div>

          {(formData.type === 'text' ||
            formData.type === 'number' ||
            formData.type === 'textarea' ||
            formData.type === 'currency' ||
            formData.type === 'date') && (
            <div className="grid gap-2">
              <Label htmlFor="placeholder">Texto de Ajuda (Placeholder)</Label>
              <Input
                id="placeholder"
                value={formData.placeholder || ''}
                onChange={(e) =>
                  setFormData({ ...formData, placeholder: e.target.value })
                }
                placeholder="Ex: Digite o número aqui..."
              />
            </div>
          )}

          {formData.type === 'select' && (
            <div className="grid gap-2">
              <Label htmlFor="options">Opções (separadas por vírgula)</Label>
              <Input
                id="options"
                value={optionsString}
                onChange={(e) => setOptionsString(e.target.value)}
                placeholder="Opção 1, Opção 2, Opção 3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.label || !formData.key}
          >
            Salvar Campo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
