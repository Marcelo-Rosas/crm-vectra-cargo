import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  Edit,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  ListOrdered,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { boardsService } from '@/services/boards'
import { stagesService } from '@/services/stages'
import { stageFormSchemasService } from '@/services/stage-form-schemas'
import { StageFormSchema, SchemaField } from '@/types/crm'
import { FieldEditorDialog } from '@/components/admin/FieldEditorDialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export default function StageFieldsConfig() {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('')
  const [selectedStageId, setSelectedStageId] = useState<string>('')
  const [schema, setSchema] = useState<StageFormSchema>({ fields: [] })
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingField, setEditingField] = useState<SchemaField | null>(null)

  const queryClient = useQueryClient()

  // Queries
  const {
    data: boards,
    isLoading: isLoadingBoards,
    isError: isErrorBoards,
  } = useQuery({
    queryKey: ['boards'],
    queryFn: boardsService.getBoards,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const {
    data: stages,
    isLoading: isLoadingStages,
    isError: isErrorStages,
  } = useQuery({
    queryKey: ['stages', selectedBoardId],
    queryFn: () => stagesService.getStagesByBoardId(selectedBoardId),
    enabled: !!selectedBoardId,
  })

  const {
    data: fetchedSchema,
    isLoading: isLoadingSchema,
    isError: isErrorSchema,
  } = useQuery({
    queryKey: ['stage-schema', selectedStageId],
    queryFn: () => stageFormSchemasService.getSchemaByStageId(selectedStageId),
    enabled: !!selectedStageId,
  })

  // Mutation
  const saveSchemaMutation = useMutation({
    mutationFn: async (data: { stageId: string; schema: StageFormSchema }) => {
      await stageFormSchemasService.saveSchema(data.stageId, data.schema)
    },
    onSuccess: () => {
      toast.success('Configuração salva com sucesso!')
      queryClient.invalidateQueries({
        queryKey: ['stage-schema', selectedStageId],
      })
    },
    onError: (error) => {
      console.error(error)
      toast.error('Erro ao salvar configuração.')
    },
  })

  // Effects to sync local state with fetched data
  useEffect(() => {
    if (fetchedSchema) {
      setSchema(fetchedSchema)
    } else {
      setSchema({ fields: [] })
    }
  }, [fetchedSchema, selectedStageId])

  // Computed Dirty State
  const isDirty = useMemo(() => {
    const reference = fetchedSchema || { fields: [] }
    return JSON.stringify(schema) !== JSON.stringify(reference)
  }, [schema, fetchedSchema])

  const handleBoardChange = (boardId: string) => {
    setSelectedBoardId(boardId)
    setSelectedStageId('') // Reset stage when board changes
    setSchema({ fields: [] }) // Reset schema
  }

  const handleAddField = () => {
    setEditingField(null)
    setIsEditorOpen(true)
  }

  const handleEditField = (field: SchemaField) => {
    setEditingField(field)
    setIsEditorOpen(true)
  }

  const handleSaveField = (field: SchemaField) => {
    setSchema((prev) => {
      const isEditing = editingField !== null

      if (isEditing) {
        // Updating existing field
        const newFields = prev.fields.map((f) =>
          f.key === editingField.key ? field : f,
        )
        return { ...prev, fields: newFields }
      } else {
        // Adding new field
        // Check for duplicates
        if (prev.fields.some((f) => f.key === field.key)) {
          toast.error('Já existe um campo com esta chave.')
          return prev
        }
        return { ...prev, fields: [...prev.fields, field] }
      }
    })
  }

  const handleDeleteField = (key: string) => {
    setSchema((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.key !== key),
    }))
  }

  const handleSaveSchema = () => {
    if (!selectedStageId) return
    saveSchemaMutation.mutate({ stageId: selectedStageId, schema })
  }

  return (
    <div className="flex flex-col h-full bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              Configuração de Campos
            </h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Defina os campos obrigatórios e formulários para cada etapa do
            processo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveSchema}
            disabled={
              !selectedStageId || saveSchemaMutation.isPending || !isDirty
            }
          >
            {saveSchemaMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar Selection */}
        <Card className="md:col-span-1 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Seleção</CardTitle>
            <CardDescription>Escolha o quadro e a etapa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isErrorBoards && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>Falha ao carregar quadros.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Quadro (Board)
              </Label>
              <Select
                value={selectedBoardId}
                onValueChange={handleBoardChange}
                disabled={isLoadingBoards}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingBoards ? 'Carregando...' : 'Selecione um quadro'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {boards && boards.length > 0 ? (
                    boards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-3 text-center text-sm text-muted-foreground">
                      {isLoadingBoards
                        ? 'Carregando...'
                        : 'Nenhum quadro encontrado'}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-muted-foreground" />
                Etapa (Stage)
              </Label>
              <Select
                value={selectedStageId}
                onValueChange={setSelectedStageId}
                disabled={!selectedBoardId || isLoadingStages}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedBoardId
                        ? 'Selecione um quadro primeiro'
                        : isLoadingStages
                          ? 'Carregando etapas...'
                          : 'Selecione uma etapa'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {stages && stages.length > 0 ? (
                    stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))
                  ) : selectedBoardId ? (
                    <div className="py-3 text-center text-sm text-muted-foreground">
                      {isLoadingStages
                        ? 'Carregando...'
                        : 'Nenhuma etapa encontrada'}
                    </div>
                  ) : (
                    <div className="py-3 text-center text-sm text-muted-foreground">
                      Selecione um quadro
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {isErrorStages && (
              <p className="text-xs text-destructive mt-1">
                Erro ao carregar etapas.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Editor Area */}
        <Card className="md:col-span-3 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <div>
              <CardTitle className="text-lg">Campos da Etapa</CardTitle>
              <CardDescription>
                {selectedStageId
                  ? `Editando: ${stages?.find((s) => s.id === selectedStageId)?.name || 'Etapa'}`
                  : 'Selecione uma etapa para começar'}
              </CardDescription>
            </div>
            {selectedStageId && (
              <Button size="sm" onClick={handleAddField}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Campo
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {!selectedStageId ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                <Edit className="h-12 w-12 mb-4 opacity-20" />
                <p>
                  Selecione um quadro e uma etapa para configurar os campos.
                </p>
              </div>
            ) : isLoadingSchema ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Carregando configuração...
                </p>
              </div>
            ) : isErrorSchema ? (
              <div className="h-full flex flex-col items-center justify-center text-destructive">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Erro ao carregar a configuração da etapa.</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-3">
                  {schema.fields.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg bg-muted/10">
                      <p className="text-muted-foreground mb-2">
                        Nenhum campo configurado para esta etapa.
                      </p>
                      <Button variant="link" onClick={handleAddField}>
                        Adicionar o primeiro campo
                      </Button>
                    </div>
                  ) : (
                    schema.fields.map((field, index) => (
                      <div
                        key={field.key}
                        className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.label}</span>
                              {field.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-[10px] h-4 px-1"
                                >
                                  Obrigatório
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono"
                              >
                                {field.key}
                              </Badge>
                              <span>•</span>
                              <span className="capitalize">
                                {field.type === 'textarea'
                                  ? 'Texto Longo'
                                  : field.type === 'file'
                                    ? 'Arquivo'
                                    : field.type === 'select'
                                      ? 'Seleção'
                                      : field.type === 'number'
                                        ? 'Numérico'
                                        : field.type === 'date'
                                          ? 'Data'
                                          : field.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditField(field)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteField(field.key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <FieldEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        field={editingField}
        onSave={handleSaveField}
      />
    </div>
  )
}
