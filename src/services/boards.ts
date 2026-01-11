import { supabase } from '@/lib/supabase/client'

export const boardsService = {
  getBoards: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Usuário não autenticado')

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) return []

    const { data, error } = await supabase
      .from('boards')
      .select('id, name')
      .eq('organization_id', profile.organization_id)
      .is('deleted_at', null)
      .order('name')

    if (error) throw error
    return data || []
  },
}
