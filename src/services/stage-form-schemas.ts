import { supabase } from '@/lib/supabase/client'
import { StageFormSchema } from '@/types/crm'

export const stageFormSchemasService = {
  getSchemaByStageId: async (
    stageId: string,
  ): Promise<StageFormSchema | null> => {
    if (!stageId) return null

    const { data, error } = await supabase
      .from('stage_form_schemas')
      .select('schema')
      .eq('stage_id', stageId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching stage form schema:', error)
      throw error
    }

    if (!data) return null

    // Cast the JSONB to our StageFormSchema type
    return data.schema as unknown as StageFormSchema
  },

  saveSchema: async (stageId: string, schema: StageFormSchema) => {
    // 1. Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 2. Get user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) throw new Error('No organization found')

    // 3. Upsert schema
    const { error } = await supabase.from('stage_form_schemas').upsert(
      {
        stage_id: stageId,
        organization_id: profile.organization_id,
        schema: schema as any,
      },
      { onConflict: 'stage_id' },
    )

    if (error) throw error
  },
}
