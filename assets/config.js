// Configuración de Nutribites Paneles.
// Deja los valores vacíos para usar el MODO DEMO (datos de ejemplo en el navegador).
// Para producción pega aquí la URL y la clave "anon public" de tu proyecto Supabase
// (Project Settings → API). La clave anon es pública por diseño; la seguridad la dan las reglas RLS de supabase/schema.sql.
window.NB_CONFIG = {
  SUPABASE_URL: "https://jukpaqtriemqvxormrgb.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a3BhcXRyaWVtcXZ4b3JtcmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzODY1ODQsImV4cCI6MjEwNTk2MjU4NH0.4PPIVK2HvvgwrGEtNVn7CozqDCldvlFWnK2rpgrOmHE",
  SCHEMA: "nutribites",          // schema de Postgres donde viven las tablas (debe estar en "Exposed schemas")
  CENTRO: [-1.2491, -78.6168],   // Ambato
  RADIO_LLEGADA_M: 150           // distancia máxima al cliente para validar la llegada
};
