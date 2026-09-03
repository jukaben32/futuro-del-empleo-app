import { describe, test, expect } from 'vitest';
import { getScoreColor } from '../scoreColor';

// Los umbrales (40 y 70) tienen que coincidir con los que usa el prompt del LLM
// en api/predict-role.js: "Bajo <40, Medio 40-69, Alto/Critico >=70".
describe('getScoreColor', () => {
  test('devuelve verde para riesgo bajo (score < 40)', () => {
    expect(getScoreColor(0).text).toBe('text-emerald-400');
    expect(getScoreColor(39).text).toBe('text-emerald-400');
  });

  test('devuelve ambar para riesgo medio (40 a 69)', () => {
    expect(getScoreColor(40).text).toBe('text-amber-400');
    expect(getScoreColor(69).text).toBe('text-amber-400');
  });

  test('devuelve rojo para riesgo alto (score >= 70)', () => {
    expect(getScoreColor(70).text).toBe('text-rose-400');
    expect(getScoreColor(100).text).toBe('text-rose-400');
  });

  test('siempre devuelve las cuatro clases que consumen los componentes', () => {
    for (const score of [0, 50, 100]) {
      expect(Object.keys(getScoreColor(score)).sort()).toEqual(['bg', 'border', 'glow', 'text']);
    }
  });
});
