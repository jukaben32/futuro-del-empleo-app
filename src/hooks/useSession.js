import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function getAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash);

  return {
    code: url.searchParams.get('code'),
    error: url.searchParams.get('error') || hashParams.get('error'),
    errorDescription:
      url.searchParams.get('error_description') ||
      hashParams.get('error_description') ||
      url.searchParams.get('error_code') ||
      hashParams.get('error_code'),
    hasHashSession: Boolean(hashParams.get('access_token') || hashParams.get('refresh_token'))
  };
}

// Exportado para que App.jsx decida, en el primer render, si el visitante vuelve
// de un enlace magico (saltar la landing page e ir directo al login/carga) o es
// una visita nueva (mostrar la landing primero).
export function hasAuthCallbackParams() {
  const { code, error, hasHashSession } = getAuthParamsFromUrl();
  return Boolean(code || error || hasHashSession);
}

function cleanAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  const paramsToRemove = [
    'code',
    'error',
    'error_code',
    'error_description',
    'refresh_token',
    'access_token',
    'expires_at',
    'expires_in',
    'provider_token',
    'provider_refresh_token',
    'token_type',
    'type'
  ];

  paramsToRemove.forEach((param) => url.searchParams.delete(param));
  url.hash = '';

  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setLoading(false);
    });

    async function loadSession() {
      const authParams = getAuthParamsFromUrl();

      if (authParams.error) {
        setAuthError(authParams.errorDescription || 'No pudimos completar el inicio de sesion.');
        cleanAuthParamsFromUrl();
      }

      if (authParams.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(authParams.code);

        if (error) {
          setAuthError(error.message);
        }

        cleanAuthParamsFromUrl();
      }

      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session);
      setLoading(false);

      if (authParams.hasHashSession) {
        cleanAuthParamsFromUrl();
      }
    }

    loadSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, authError };
}
