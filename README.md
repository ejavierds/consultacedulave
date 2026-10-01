# 🇻🇪 Consulta Cédula Venezuela - Serverless Proxy

![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Frontend-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)

Un sistema de consulta de datos de identificación venezolanos diseñado con una arquitectura **Serverless** y un enfoque **Mobile-First**. 

Este proyecto actúa como un proxy seguro para comunicarse con proveedores externos de datos (CNE / Identificación), garantizando que las credenciales de la API nunca queden expuestas en el navegador del cliente.

---

## 🏗️ Arquitectura del Sistema

El sistema sigue un patrón de diseño desacoplado optimizado para la plataforma de [Vercel](https://vercel.com/):

- **Frontend (`/public`)**: Aplicación web estática (SPA) construida con Vanilla JavaScript y estilizada mediante **Tailwind CSS**. Implementa peticiones asíncronas (AJAX/Fetch) hacia el backend propio y renderizado reactivo del DOM para mostrar los datos en tarjetas de información.
- **Backend (`/api`)**: Compuesto por Vercel Serverless Functions en **Node.js**. Actúa como una capa intermedia de abstracción (Proxy) encargada de inyectar los tokens de autenticación mediante variables de entorno (Secrets) antes de despachar la petición a la API externa (`api.cedula.com.ve`).

---

## ✨ Características Principales

- 🛡️ **Seguridad por Diseño**: Evita el filtrado de credenciales (`app_id` y `token`) delegando la petición HTTP real a la función Serverless.
- 📱 **Interfaz Mobile-First**: UI limpia y moderna que se adapta dinámicamente a cualquier tamaño de pantalla.
- ⚡ **Alta Disponibilidad**: Despliegue en la Edge Network de Vercel.
- 🛠️ **Manejo de Errores Resiliente**: Captura y notificación de errores de red, respuestas HTTP no válidas (ej. 404/500) y formatos inesperados de la API origen.

---

## 📂 Estructura del Proyecto

```text
📁 Consulta Cedula Ve/
├── 📁 api/
│   └── 📄 cedula.js        # Serverless Function (Node.js Proxy)
├── 📁 public/
│   ├── 📄 index.html       # Interfaz de Usuario UI
│   └── 📄 GPL.md           # Archivo de Licencia
├── 📄 package.json         # Configuración del entorno Node.js
├── 📄 vercel.json          # Reglas de enrutamiento y config de Vercel
└── 📄 .env.example         # Plantilla de variables de entorno
```

---

## ⚙️ Configuración y Despliegue

### 1. Requisitos Previos
* Cuenta activa en [Vercel](https://vercel.com/).
* Credenciales de acceso a la API externa (`APP_ID` y `TOKEN`).

### 2. Variables de Entorno (Environment Variables)
Para que la Serverless Function se autentique con el proveedor externo, es obligatorio definir las siguientes variables de entorno en la configuración de Vercel (Pestaña *Settings > Environment Variables*):

| Variable | Descripción |
| :--- | :--- |
| `CEDULA_APP_ID` | Identificador de aplicación proporcionado por la API origen. |
| `CEDULA_TOKEN` | Token criptográfico de acceso para consumo de datos. |

*(Nota: En desarrollo local, puedes crear un archivo `.env` basado en el `.env.example` proporcionado).*

### 3. Desarrollo Local (Vercel CLI)

Para ejecutar este proyecto en tu máquina local y probar la Serverless Function, utiliza el CLI oficial de Vercel:

```bash
# 1. Instalar Vercel CLI globalmente (si no lo tienes)
npm i -g vercel

# 2. Iniciar el entorno de desarrollo local
vercel dev
```

El CLI emulará el enrutamiento de la nube y levantará el proyecto localmente (usualmente en `http://localhost:3000`).

---

## 📄 Licencia

Este proyecto se distribuye bajo los términos de la **GNU General Public License v3.0** (GPLv3). Para más detalles, consulta el archivo [GPL.md](./public/GPL.md).
