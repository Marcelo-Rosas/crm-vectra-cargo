import { supabase } from '@/lib/supabase/client'

export const boardsService = {
  getBoards: async () => {
    const { data, error } = await supabase
      .from('boards')
      .select('id, name')
      .order('name')

    if (error) throw error
    return data || []
  },
}
