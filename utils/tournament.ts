export const PHASE_LABELS: Record<string, string> = {
  'INITIAL_STAGE': 'Fase Inicial',
  'QUARTER_FINALS': 'Quartas de Final',
  'SEMI_FINALS': 'Semifinais',
  'FINAL': 'Final',
  'THIRD_PLACE': '3º e 4º Lugar',
  'GROUPS': 'Fase de Grupos',
}

export const PHASE_OPTIONS = Object.entries(PHASE_LABELS).map(([value, label]) => ({
  value,
  label
}))

export function getPhaseLabel(phase: string | null | undefined): string {
  if (!phase) return 'Fase Inicial'
  return PHASE_LABELS[phase] || phase
}
