// Traduce los errores tecnicos de Supabase Auth a mensajes que expliquen que hacer.
// Vive aparte del componente para poder testearlo sin montar React ni el cliente
// de Supabase (que necesita variables de entorno solo para instanciarse).
export function getFriendlyAuthError(message) {
  const normalizedMessage = String(message || '').toLowerCase();

  if (normalizedMessage.includes('error sending') && normalizedMessage.includes('email')) {
    // El servidor SMTP rechazo el envio (remitente sin dominio verificado, credenciales malas, etc.).
    // Revisa Supabase > Authentication > Emails > SMTP Settings y los logs de Auth.
    return 'No pudimos enviar el correo: el servidor de correo (SMTP) rechazo el envio. Revisa la configuracion de SMTP en Supabase.';
  }

  if (normalizedMessage.includes('email rate limit exceeded')) {
    return 'Se alcanzo el limite de correos por hora. Espera un rato antes de pedir otro enlace o configura un SMTP propio para produccion.';
  }

  if (normalizedMessage.includes('invalid') && normalizedMessage.includes('expired')) {
    return 'Ese enlace ya se uso o expiro. Pide uno nuevo y abrelo desde este mismo navegador.';
  }

  if (normalizedMessage.includes('signups not allowed') || normalizedMessage.includes('signup is disabled')) {
    return 'El registro de nuevos usuarios esta desactivado en Supabase (Authentication > Providers > Email).';
  }

  return message;
}
