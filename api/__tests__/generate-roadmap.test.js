import { describe, test, expect } from 'vitest';
import { reskillingRoadmapSchema } from '../generate-roadmap.js';

// Roadmap minimo valido, base para los casos de abajo.
const roadmapValido = {
  fromTitle: 'Profesor de Primaria',
  toTitle: 'Diseñador Pedagógico de Aprendizaje Aumentado por IA',
  overview: 'Pasa de enseñar de forma tradicional a diseñar experiencias de aprendizaje personalizadas con IA.',
  estimatedMonths: '4 a 6 meses',
  salaryIncrease: '+35%',
  keySoftSkills: ['Empatía pedagógica', 'Pensamiento crítico', 'Adaptabilidad curricular'],
  phases: [
    {
      step: 1,
      title: 'Fase 1: Fundamentos de IA Educativa',
      duration: 'Mes 1 - 2',
      topics: ['Herramientas de IA generativa en el aula', 'Personalización del aprendizaje', 'Ética del uso de IA con menores'],
      tools: ['ChatGPT Edu', 'Khanmigo', 'MagicSchool AI'],
      recommendedCourse: 'AI for Educators (Google for Education)',
    },
    {
      step: 2,
      title: 'Fase 2: Diseño de Experiencias de Aprendizaje',
      duration: 'Mes 3 - 4',
      topics: ['Diseño instruccional aumentado', 'Evaluación formativa asistida por IA', 'Gamificación con IA'],
      tools: ['Canva for Education', 'Diffit', 'MagicSchool AI'],
      recommendedCourse: 'Teaching with AI (Coursera)',
    },
    {
      step: 3,
      title: 'Fase 3: Certificación y Portafolio',
      duration: 'Mes 5 - 6',
      topics: ['Publicación de casos de uso propios', 'Mentoría a otros docentes', 'Certificación oficial'],
      tools: ['LinkedIn Learning', 'Portafolio digital'],
      recommendedCourse: 'Generative AI for Educators Certificate (ISTE)',
    },
  ],
};

describe('reskillingRoadmapSchema', () => {
  test('acepta un roadmap bien formado', () => {
    expect(reskillingRoadmapSchema.safeParse(roadmapValido).success).toBe(true);
  });

  test('rechaza un roadmap con menos de 3 fases', () => {
    const dosFases = { ...roadmapValido, phases: roadmapValido.phases.slice(0, 2) };
    expect(reskillingRoadmapSchema.safeParse(dosFases).success).toBe(false);
  });

  test('rechaza fases con numeros de step repetidos', () => {
    const stepsRepetidos = {
      ...roadmapValido,
      phases: [
        { ...roadmapValido.phases[0], step: 1 },
        { ...roadmapValido.phases[1], step: 1 },
        { ...roadmapValido.phases[2], step: 2 },
      ],
    };
    // Sin esta validacion, dos fases compartirian la misma clave `${id}-1` en la UI
    // y una de ellas desaparecería silenciosamente del render.
    expect(reskillingRoadmapSchema.safeParse(stepsRepetidos).success).toBe(false);
  });

  test('rechaza menos de 3 keySoftSkills', () => {
    const pocasSkills = { ...roadmapValido, keySoftSkills: ['Solo una'] };
    expect(reskillingRoadmapSchema.safeParse(pocasSkills).success).toBe(false);
  });

  test('rechaza una fase a la que le falta recommendedCourse', () => {
    // El prefijo _ marca la variable como descartada a proposito.
    const { recommendedCourse: _omitido, ...faseIncompleta } = roadmapValido.phases[0];
    const conFaseIncompleta = { ...roadmapValido, phases: [faseIncompleta, roadmapValido.phases[1], roadmapValido.phases[2]] };
    expect(reskillingRoadmapSchema.safeParse(conFaseIncompleta).success).toBe(false);
  });

  test('rechaza al que le falta un campo obligatorio de nivel superior', () => {
    const { overview: _omitido, ...incompleto } = roadmapValido;
    expect(reskillingRoadmapSchema.safeParse(incompleto).success).toBe(false);
  });
});
