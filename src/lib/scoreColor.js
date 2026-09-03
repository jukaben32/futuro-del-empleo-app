// Dynamic risk styling — shared by the curated RoleSimulator and the AI-powered predictor
// so both always render identical badge/gauge colors from the same automationScore thresholds.
export function getScoreColor(score) {
  if (score < 40) return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' };
  if (score < 70) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' };
  return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/40', glow: 'shadow-rose-500/20' };
}
