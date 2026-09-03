import { describe, test, expect } from 'vitest';
import { normalizeTitle, rolePredictionSchema, VALID_COUNTRIES } from '../predict-role.js';

describe('normalizeTitle', () => {
  // La clave de cache es (normalized_title, country). Si la normalizacion falla,
  // "Contador" y "contador " se guardan como filas distintas y la cache no ahorra nada.
  test('trata como iguales variantes de mayusculas y espacios', () => {
    expect(normalizeTitle('  Contador  ')).toBe('contador');
    expect(normalizeTitle('CONTADOR')).toBe('contador');
  });

  test('colapsa los espacios internos repetidos', () => {
    expect(normalizeTitle('analista    de   datos')).toBe('analista de datos');
  });
});

describe('VALID_COUNTRIES', () => {
  test('incluye "global", que es el valor por defecto del endpoint', () => {
    expect(VALID_COUNTRIES).toContain('global');
  });
});

// Diagnostico minimo valido, usado como base en los casos de abajo.
const prediccionValida = {
  title: 'Contador',
  sector: 'finance',
  automationScore: 75,
  riskLevel: 'Alto',
  summary: 'La IA automatiza la mayor parte de la teneduria de libros.',
  aiWillDo: ['Conciliar cuentas', 'Clasificar asientos', 'Generar reportes'],
  humanWillDo: ['Interpretar resultados', 'Asesorar al cliente', 'Decidir estrategia fiscal'],
  survivalAdvice: 'Muevete hacia analisis financiero y asesoria estrategica.',
  targetTransitionRole: 'Analista Financiero',
};

describe('rolePredictionSchema', () => {
  test('acepta un diagnostico bien formado', () => {
    expect(rolePredictionSchema.safeParse(prediccionValida).success).toBe(true);
  });

  test('rechaza un sector que no esta en la lista permitida', () => {
    const malSector = { ...prediccionValida, sector: 'agricultura' };
    expect(rolePredictionSchema.safeParse(malSector).success).toBe(false);
  });

  test('rechaza un automationScore fuera del rango 0-100', () => {
    expect(rolePredictionSchema.safeParse({ ...prediccionValida, automationScore: 140 }).success).toBe(false);
    expect(rolePredictionSchema.safeParse({ ...prediccionValida, automationScore: -1 }).success).toBe(false);
  });

  test('rechaza un automationScore decimal (la UI espera enteros)', () => {
    expect(rolePredictionSchema.safeParse({ ...prediccionValida, automationScore: 75.5 }).success).toBe(false);
  });

  test('rechaza menos de 3 elementos en aiWillDo', () => {
    const pocos = { ...prediccionValida, aiWillDo: ['Solo una cosa'] };
    expect(rolePredictionSchema.safeParse(pocos).success).toBe(false);
  });

  test('rechaza mas de 4 elementos en humanWillDo', () => {
    const demasiados = { ...prediccionValida, humanWillDo: ['a1', 'b2', 'c3', 'd4', 'e5'] };
    expect(rolePredictionSchema.safeParse(demasiados).success).toBe(false);
  });

  test('rechaza un diagnostico al que le falta un campo obligatorio', () => {
    // El prefijo _ marca la variable como descartada a proposito (omitimos ese campo).
    const { survivalAdvice: _omitido, ...incompleto } = prediccionValida;
    expect(rolePredictionSchema.safeParse(incompleto).success).toBe(false);
  });
});
