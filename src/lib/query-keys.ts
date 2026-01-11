export const queryKeys = {
  boards: {
    all: ['boards'] as const,
    detail: (id: string) => ['boards', id] as const,
  },
  stages: {
    schema: (stageId: string) => ['stages', stageId, 'schema'] as const,
  },
}
