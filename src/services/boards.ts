import { supabase } from '@/lib/supabase/client'

export const boardsService = {
  getBoards: async () => {
    const { data, error } = await supabase
      .from('boards')
      .select('id, name')
      .is('deleted_at', null)
      .order('name')

    if (error) throw error
    return data || []
  },
}
