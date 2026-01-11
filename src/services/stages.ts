import { supabase } from '@/lib/supabase/client'

export const stagesService = {
  getStagesByBoardId: async (boardId: string) => {
    if (!boardId) return []

    const { data, error } = await supabase
      .from('board_stages')
      .select('id, name')
      .eq('board_id', boardId)
      .order('order', { ascending: true })

    if (error) throw error
    return data || []
  },
}
