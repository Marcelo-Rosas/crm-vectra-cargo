import { StageFormSchema } from '@/types/crm'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface DynamicStageFormProps {
  schema: StageFormSchema
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  className?: string
}

export function DynamicStageForm({
  schema,
  data,
  onChange,
  className,
}: DynamicStageFormProps) {
  if (!schema.fields || schema.fields.length === 0) return null

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {schema.fields.map((field) => {
        const value = data[field.key] ?? field.defaultValue ?? ''

        switch (field.type) {
          case 'checkbox':
            return (
              <div
                key={field.key}
                className="flex items-center space-x-2 md:col-span-2 pt-4"
              >
                <Checkbox
                  id={field.key}
                  checked={!!value}
                  onCheckedChange={(checked) => onChange(field.key, checked)}
                />
                <Label
                  htmlFor={field.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
              </div>
            )

          case 'textarea':
            return (
              <div key={field.key} className="space-y-2 md:col-span-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Textarea
                  id={field.key}
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            )

          case 'currency':
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id={field.key}
                    type="number"
                    value={value}
                    onChange={(e) =>
                      onChange(field.key, Number(e.target.value))
                    }
                    placeholder={field.placeholder}
                    className="pl-9"
                  />
                </div>
              </div>
            )

          case 'number':
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id={field.key}
                  type="number"
                  value={value}
                  onChange={(e) => onChange(field.key, Number(e.target.value))}
                  placeholder={field.placeholder}
                />
              </div>
            )

          case 'text':
          default:
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id={field.key}
                  type="text"
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            )
        }
      })}
    </div>
  )
}
