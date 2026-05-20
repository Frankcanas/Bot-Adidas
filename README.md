# Adidas Colombia Chatbot MVP (RAG Local) 🚀

Este proyecto es un **MVP (Producto Mínimo Viable)** desarrollado para una actividad universitaria. Se trata de un chatbot de atención al cliente para Adidas Colombia que utiliza la arquitectura **RAG (Retrieval-Augmented Generation)** con un modelo de lenguaje local.

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript Vanilla y **Vite** para el servidor de desarrollo.
- **Backend:** **Node.js** con **Express**.
- **IA Local:** **Ollama** ejecutando el modelo `gemma:2b`.
- **Arquitectura:** RAG basado en búsqueda semántica/palabras clave sobre archivos JSON.

## 📋 Requisitos Previos
1. Tener [Node.js](https://nodejs.org/) instalado (Versión 18 o superior).
2. Tener [Ollama](https://ollama.com/) instalado.
3. Descargar el modelo en Ollama:
   ```powershell
   ollama pull gemma:2b
   ```

## 🚀 Guía de Ejecución (Paso a Paso)

Para que el proyecto funcione correctamente, debes tener **tres terminales** abiertas:

### Paso 1: Generar la Base de Conocimientos
En la carpeta del proyecto, ejecuta una vez para crear los datos simulados:
```powershell
node server/mock-scraper.js
```

### Paso 2: Iniciar el Servidor Backend (Terminal 1)
Este servidor maneja la lógica de búsqueda (RAG) y la conexión con la IA:
```powershell
node server/index.js
```
*Mantén esta terminal abierta durante toda la demo.*

### Paso 3: Iniciar el Servidor Frontend (Terminal 2)
Utilizamos Vite para evitar problemas de seguridad del navegador:
```powershell
npx vite client
```
*Copia el enlace que te dé (ej: http://localhost:5173) y ábrelo en tu navegador.*

### Paso 4: Asegurar Ollama (Terminal 3 o App)
Asegúrate de que la aplicación de Ollama esté abierta en tu barra de tareas.

---

## 🎓 Explicación Técnica para la Exposición

### 1. ¿Qué es RAG en este proyecto?
RAG significa **Generación Aumentada por Recuperación**. En lugar de dejar que la IA invente respuestas (alucinaciones), nuestro sistema:
1.  **Recupera:** Busca en `knowledge.json` los fragmentos de texto que coinciden con la pregunta del usuario.
2.  **Aumenta:** Inserta ese texto en un "Prompt" especial.
3.  **Genera:** Le pide a la IA que responda **únicamente** usando ese texto.

### 2. El Algoritmo de Búsqueda (Scoring)
En `server/index.js`, implementamos un algoritmo que asigna puntos a cada sección de la base de datos:
- +1 punto si la palabra clave está en el contenido.
- +2 puntos si está en la categoría.
Esto asegura que si el usuario pregunta por "zapatos", el sistema priorice la sección de devoluciones o productos.

### 3. Seguridad y Privacidad
Al usar **Ollama**, todos los datos se procesan localmente. Ninguna información de Adidas ni del usuario sale de la computadora hacia servidores externos (como OpenAI), lo que garantiza 100% de privacidad.

### 4. Módulo de Ingesta (Scraping Simulado)
Explicamos que, debido a los firewalls de alta seguridad de Adidas (Akamai/Cloudflare), se implementó un **Módulo de Datos Curados** (`mock-scraper.js`) que estructura la información oficial en un formato JSON optimizado para la búsqueda del RAG.

---

## 👨‍💻 Autor
Desarrollado para fines académicos - Proyecto Chatbot Adidas RAG.
