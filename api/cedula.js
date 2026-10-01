export default async function handler(req, res) {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejo del preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Validación del método
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const { nacionalidad, cedula, cf_token } = req.query;

  // Validación de parámetros
  if (!nacionalidad || !cedula) {
    return res.status(400).json({ error: 'Nacionalidad y Cédula son requeridas.' });
  }

  if (!cf_token) {
    return res.status(400).json({ error: 'El Captcha es obligatorio.' });
  }

  // Claves de entorno
  const appId = process.env.CEDULA_APP_ID;
  const token = process.env.CEDULA_TOKEN;
  // Fallback a la clave estática si no está en las variables (aunque es mejor usar process.env)
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAAFLZ3PH1xtAm_ulNBWqyOdE9xfk';

  if (!appId || !token) {
    console.error('Faltan variables de entorno CEDULA_APP_ID o CEDULA_TOKEN');
    return res.status(500).json({ error: 'Error de configuración del servidor interno.' });
  }

  try {
    // 1. Validar Captcha Turnstile
    const verifyFormData = new URLSearchParams();
    verifyFormData.append('secret', turnstileSecret);
    verifyFormData.append('response', cf_token);
    
    // Obtener la IP del cliente (Opcional pero recomendado para Turnstile)
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    if (clientIp) {
      verifyFormData.append('remoteip', clientIp);
    }

    const turnstileVerify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verifyFormData
    });
    const turnstileData = await turnstileVerify.json();

    if (!turnstileData.success) {
      return res.status(403).json({ error: 'Fallo de verificación humana (Captcha).' });
    }

    // 2. Si el Captcha es válido, consultar a la API de cédulas
    // La API externa requiere app_id y token en la URL (query string)
    const apiUrl = `https://api.cedula.com.ve/api/v1?app_id=${appId}&token=${token}&nacionalidad=${nacionalidad}&cedula=${cedula}`;
    
    // Fetch interno protegido
    const response = await fetch(apiUrl, {
      method: 'GET'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Persona no encontrada en la base de datos.' });
      }
      throw new Error(`API respondió con estado ${response.status}`);
    }

    const data = await response.json();
    
    // api.cedula.com.ve retorna un status 200 pero con data.error = true si fallan las credenciales o no se encuentra
    if (data.error) {
       return res.status(400).json({ error: data.error_str || 'Error en la consulta (verifique credenciales o si la cédula existe).' });
    }

    // Retornamos la data al cliente
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error al realizar la petición a la API externa:', error);
    return res.status(500).json({ error: 'Error interno del servidor al consultar la cédula.' });
  }
}
