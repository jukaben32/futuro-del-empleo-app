import { supabase } from './supabaseClient';

// Duplicado deliberado de normalizeTitle (api/predict-role.js): esa version vive en
// una funcion serverless y no vale la pena cruzar el limite servidor/cliente por
// una funcion de 1 linea. Debe normalizar EXACTAMENTE igual para que el historial
// (guardado desde el navegador) case con la cache de diagnosticos (guardada desde
// el servidor) bajo la misma clave (normalized_title, country).
export function normalizeTitle(jobTitle) {
  return jobTitle.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Clave estable para el progreso de un roadmap generado por IA (ver ReskillingRoadmap.jsx):
// el id sintetico "ai-custom" por si solo no alcanza porque es el mismo para cualquier
// profesion — sin esto, el progreso de dos profesiones distintas colisionaria.
export function buildCustomProgressKey(jobTitle, country) {
  return `custom:${normalizeTitle(jobTitle)}:${country || 'global'}`;
}

// --- Perfil minimo (ultimo puesto y pais consultados) ---

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('current_job_title, country')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('getUserProfile failed:', error.message);
    return null;
  }
  return data;
}

export async function saveUserProfile(userId, { currentRole, country }) {
  const { error } = await supabase
    .from('user_profiles')
    .upsert(
      { user_id: userId, current_job_title: currentRole, country: country || 'global', updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('saveUserProfile failed:', error.message);
  }
}

// --- Historial de diagnosticos ---

export async function listDiagnosisHistory(userId) {
  const { data, error } = await supabase
    .from('user_diagnosis_history')
    .select('id, job_title, normalized_title, country, diagnosis, roadmap, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('listDiagnosisHistory failed:', error.message);
    return [];
  }
  return data || [];
}

// Devuelve la fila resultante (con su id real, sea nueva o actualizada) para que
// el llamador pueda refrescar su lista local sin adivinar un id ni volver a pedir.
export async function saveDiagnosisHistory(userId, { jobTitle, country, diagnosis, roadmap = null }) {
  const normalizedTitle = normalizeTitle(jobTitle);
  const { data, error } = await supabase
    .from('user_diagnosis_history')
    .upsert(
      {
        user_id: userId,
        normalized_title: normalizedTitle,
        country: country || 'global',
        job_title: jobTitle,
        diagnosis,
        roadmap,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,normalized_title,country' }
    )
    .select('id, job_title, normalized_title, country, diagnosis, roadmap, updated_at')
    .single();

  if (error) {
    console.error('saveDiagnosisHistory failed:', error.message);
    return null;
  }
  return data;
}

export async function deleteDiagnosisHistoryEntry(id) {
  const { error } = await supabase.from('user_diagnosis_history').delete().eq('id', id);
  if (error) {
    console.error('deleteDiagnosisHistoryEntry failed:', error.message);
  }
}

// --- Progreso del plan de reskilling ---
// pathKey identifica el plan: uno de los 3 ids fijos de RESKILLING_PATHS para las
// rutas curadas, o AIRolePredictor arma uno propio (`custom:${normalizedTitle}:${country}`)
// para los roadmaps generados por IA, ya que cada profesion necesita su propio progreso.

export async function getRoadmapProgress(userId, pathKey) {
  const { data, error } = await supabase
    .from('user_roadmap_progress')
    .select('completed_steps')
    .eq('user_id', userId)
    .eq('path_key', pathKey)
    .maybeSingle();

  if (error) {
    console.error('getRoadmapProgress failed:', error.message);
    return {};
  }
  return data?.completed_steps || {};
}

export async function saveRoadmapProgress(userId, pathKey, completedSteps) {
  const { error } = await supabase
    .from('user_roadmap_progress')
    .upsert(
      { user_id: userId, path_key: pathKey, completed_steps: completedSteps, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,path_key' }
    );

  if (error) {
    console.error('saveRoadmapProgress failed:', error.message);
  }
}

// --- Diagnostico compartible (lectura publica, sin sesion) ---
// Deliberadamente solo el diagnostico, sin el roadmap generado: mantiene la fila
// compartida autocontenida y simple. Ver README para el porque de este limite.

export async function createSharedDiagnosis(userId, { jobTitle, diagnosis }) {
  const { data, error } = await supabase
    .from('shared_diagnoses')
    .insert({ created_by: userId, job_title: jobTitle, diagnosis })
    .select('id')
    .single();

  if (error) {
    console.error('createSharedDiagnosis failed:', error.message);
    return null;
  }
  return data.id;
}

export async function getSharedDiagnosis(shareId) {
  const { data, error } = await supabase
    .from('shared_diagnoses')
    .select('job_title, diagnosis, created_at')
    .eq('id', shareId)
    .maybeSingle();

  if (error) {
    console.error('getSharedDiagnosis failed:', error.message);
    return null;
  }
  return data;
}
