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

  const { nacionalidad, cedula } = req.query;

  // Validación de parámetros
  if (!nacionalidad || !cedula) {
    return res.status(400).json({ error: 'Nacionalidad y Cédula son requeridas.' });
  }

  // Lectura de variables de entorno seguras
  const appId = process.env.CEDULA_APP_ID;
  const token = process.env.CEDULA_TOKEN;

  if (!appId || !token) {
    console.error('Faltan variables de entorno CEDULA_APP_ID o CEDULA_TOKEN');
    return res.status(500).json({ error: 'Error de configuración del servidor interno.' });
  }

  try {
    // Construcción de la URL hacia el servicio externo
    const apiUrl = `https://api.cedula.com.ve/api/v1?nacionalidad=${nacionalidad}&cedula=${cedula}`;
    
    // Fetch interno protegido
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app_id': appId,
        'token': token
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Persona no encontrada en la base de datos.' });
      }
      throw new Error(`API respondió con estado ${response.status}`);
    }

    const data = await response.json();
    
    // Retornamos la data al cliente
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error al realizar la petición a la API externa:', error);
    return res.status(500).json({ error: 'Error interno del servidor al consultar la cédula.' });
  }
}
