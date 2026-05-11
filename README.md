# Sistema de Chat Colaborativo - Ágora

## Visión del Sistema
Aplicación Web (SPA) diseñada para permitir la comunicación y colaboración en tiempo real entre empleados de una empresa. El sistema utiliza exclusivamente el protocolo WebSocket para garantizar una mensajería instantánea y bidireccional, evitando técnicas tradicionales como polling.

Este proyecto forma parte de la asignatura de Sistemas Colaborativos.

## Tecnologías Utilizadas

*   **Backend:** Node.js, `ws` (Librería nativa de WebSocket), Express.
*   **Frontend:** React, Vite (Herramienta de construcción).
*   **Servidor:** NGROK.
*   **Metodología:** Scrum (Gestión de proyecto mediante [Trello/Notion]).
*   **Control de Versiones:** Git y GitHub.

## Requisitos Previos

Para ejecutar este proyecto de manera local, es necesario contar con las siguientes herramientas instaladas en el sistema operativo:

*   [Node.js](https://nodejs.org/) (Versión 16.x o superior recomendada).
*   Gestor de paquetes `npm` (incluido con Node.js).
*   Git.

## Estructura del Proyecto

El repositorio está dividido en dos directorios principales:

*   `/chat-backend`: Contiene la lógica del servidor WebSocket.
*   `/chat-frontend`: Contiene la aplicación web cliente (SPA) construida en React.

---

## Instrucciones de Instalación y Ejecución

Debes levantar tanto el servidor como el cliente en terminales separadas para que el sistema funcione correctamente.

### 1. Ejecución del Servidor (Backend)

1. Abre una terminal y navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Ejecuta el servidor:
   ```bash
   node server.js
   ```

  Se estableció una maquina como un servidor usando NGROK para que todos puedan comunicarse remotamente

### 2. Ejecución del Cliente (Frontend)

1. Abre otra terminal y navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

   La aplicación se abrirá en `http://localhost:5173`

### 3. Acceso a la Aplicación

Una vez que ambos servidores estén ejecutándose, abre tu navegador web y ve a `http://localhost:5173` para acceder al chat colaborativo.

Asegúrate de que el backend esté corriendo antes de iniciar el frontend, ya que el cliente se conecta al servidor WebSocket.