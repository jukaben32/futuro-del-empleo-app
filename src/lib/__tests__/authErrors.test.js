import { describe, test, expect } from 'vitest';
import { getFriendlyAuthError } from '../authErrors';

describe('getFriendlyAuthError', () => {
  // Este es el error real que devolvio Supabase cuando el remitente SMTP
  // era una direccion @gmail.com y Resend lo rechazaba con un 550.
  test('explica el fallo de SMTP en vez de repetir el error en ingles', () => {
    const resultado = getFriendlyAuthError('Error sending magic link email');
    expect(resultado).toContain('SMTP');
    expect(resultado).not.toBe('Error sending magic link email');
  });

  test('explica el limite de correos por hora', () => {
    expect(getFriendlyAuthError('email rate limit exceeded')).toContain('limite de correos');
  });

  test('explica que el enlace ya se uso', () => {
    expect(getFriendlyAuthError('Email link is invalid or has expired')).toContain('Pide uno nuevo');
  });

  test('explica que el registro esta desactivado', () => {
    expect(getFriendlyAuthError('Signups not allowed for otp')).toContain('desactivado');
  });

  test('deja pasar sin tocar un error que no reconoce', () => {
    expect(getFriendlyAuthError('Network request failed')).toBe('Network request failed');
  });

  test('no revienta con null o undefined', () => {
    expect(() => getFriendlyAuthError(null)).not.toThrow();
    expect(() => getFriendlyAuthError(undefined)).not.toThrow();
  });
});
