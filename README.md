# 🇻🇪 Consulta Cédula Venezuela - Serverless Proxy

![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Frontend-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Security-Cloudflare_Turnstile-F38020?logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)

Un sistema de consulta de datos de identificación venezolanos y registro electoral, diseñado con una arquitectura **Serverless**, protegido por **Captcha**, y optimizado para una experiencia **Mobile-First**. 

Diseñado y desarrollado por [@ejavierds](https://ejavierds.vercel.app).

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa un patrón de Proxy Seguro enfocado en la privacidad y la protección de datos:

- **Frontend (`/public`)**: Aplicación web estática y reactiva construida con Vanilla JS y **Tailwind CSS**. Implementa previsualización de metadatos (Open Graph y Twitter Cards) para redes sociales, y un sistema anti-bots con **Cloudflare Turnstile**.
- **Backend (`/api`)**: Vercel Serverless Functions (**Node.js**). Actúa como un middleware para firmar las peticiones a la API original (`api.cedula.com.ve`) y validar criptográficamente el Captcha, asegurando que las credenciales maestras de la API jamás se expongan al cliente.

---

## ✨ Características Principales

- 🔐 **Zero-Data Retention**: Sistema diseñado como un pasillo (proxy). No se almacenan ni se rastrean los datos consultados.
- 🛡️ **Protección Anti-Bots**: Integración con *Cloudflare Turnstile* del lado del servidor para evitar scrapers y ataques de denegación de servicio (DDoS).
- 📱 **Responsive UI**: Diseño limpio que adapta los resultados (Nombres, F. de Nacimiento, Centro Electoral, etc.) a Tarjetas de Información.
- ⚡ **Optimización Edge**: Despliegue distribuido de las funciones en Vercel.

---

## ⚙️ Configuración y Despliegue

### 1. Variables de Entorno (Environment Variables)

Para el correcto funcionamiento del proxy y la validación de seguridad, debes configurar las siguientes variables de entorno en Vercel:

| Variable | Descripción |
| :--- | :--- |
| `CEDULA_APP_ID` | App ID otorgado por *api.cedula.com.ve*. |
| `CEDULA_TOKEN` | Token de acceso secreto para la API original. |
| `TURNSTILE_SECRET_KEY` | Clave secreta (Server-Side) proporcionada por *Cloudflare Turnstile* para validar el Captcha. |

### 2. Clave del Sitio de Turnstile
En el archivo `/public/index.html`, asegúrate de actualizar el atributo `data-sitekey` del *div* correspondiente con tu **Clave del Sitio** (Client-Side) asignada en tu cuenta de Cloudflare.

### 3. Desarrollo Local
Para ejecutar en local y emular el entorno de red de Vercel:
```bash
npm i -g vercel
vercel dev
```

---

## 📄 Licencia

Este código abierto se distribuye bajo la **GNU General Public License v3.0** (GPLv3). Consulta el archivo [GPL.md](./public/GPL.md) para conocer las políticas de uso, modificación y distribución.
