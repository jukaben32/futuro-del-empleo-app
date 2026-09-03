import { describe, test, expect, vi } from 'vitest';

// userData.js importa el cliente real de supabase al cargarse (createClient con
// variables de entorno). En el entorno de test no hay .env, asi que mockeamos el
// modulo para poder testear solo las funciones puras sin tocar la red.
vi.mock('../supabaseClient', () => ({ supabase: {} }));

const { normalizeTitle, buildCustomProgressKey } = await import('../userData.js');

describe('normalizeTitle', () => {
  // Debe normalizar EXACTAMENTE igual que la copia server-side en api/predict-role.js:
  // el historial se guarda desde el navegador bajo la misma clave (normalized_title,
  // country) que usa la cache de diagnosticos guardada desde el servidor.
  test('trata como iguales variantes de mayusculas y espacios', () => {
    expect(normalizeTitle('  Profesor Primaria  ')).toBe('profesor primaria');
    expect(normalizeTitle('PROFESOR PRIMARIA')).toBe('profesor primaria');
  });

  test('colapsa los espacios internos repetidos', () => {
    expect(normalizeTitle('chofer    de   plataformas')).toBe('chofer de plataformas');
  });
});

describe('buildCustomProgressKey', () => {
  test('arma una clave estable para el mismo puesto y pais', () => {
    expect(buildCustomProgressKey('Profesor Primaria', 'mexico')).toBe('custom:profesor primaria:mexico');
  });

  test('usa "global" cuando no se especifica pais', () => {
    expect(buildCustomProgressKey('Profesor Primaria', '')).toBe('custom:profesor primaria:global');
    expect(buildCustomProgressKey('Profesor Primaria', null)).toBe('custom:profesor primaria:global');
  });

  test('dos profesiones distintas nunca comparten clave de progreso', () => {
    // Esta es la razon de ser de la funcion: sin ella, el progreso de "profesor
    // primaria" y el de "chofer de plataformas" colisionarian bajo el mismo id
    // sintetico "ai-custom" en ReskillingRoadmap.jsx.
    const a = buildCustomProgressKey('Profesor Primaria', 'global');
    const b = buildCustomProgressKey('Chofer de Plataformas', 'global');
    expect(a).not.toBe(b);
  });
});
