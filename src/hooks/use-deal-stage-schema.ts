import { useQuery } from '@tanstack/react-query'
import { stageFormSchemasService } from '@/services/stage-form-schemas'
import { queryKeys } from '@/lib/query-keys'
import { StageFormSchema } from '@/types/crm'

export const useDealStageSchema = (stageId?: string) => {
  return useQuery<StageFormSchema | null>({
    queryKey: stageId
      ? [...queryKeys.stages.schema(stageId), 'stage-form-schema']
      : ['stage-form-schema', 'empty'],
    queryFn: async () => {
      if (!stageId) return null
      return stageFormSchemasService.getSchemaByStageId(stageId)
    },
    enabled: !!stageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
