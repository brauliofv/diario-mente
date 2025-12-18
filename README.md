# 🧠 NeuroLog - Diario de Memoria & Gimnasio Mental

> Una aplicación web diseñada científicamente para estimular la memoria episódica mediante ejercicios cognitivos intercalados y reflexión diaria. Construida con **Vanilla JavaScript** moderno para un rendimiento máximo.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-green.svg)
![Tech](https://img.shields.io/badge/stack-VanillaJS%20%7C%20Tailwind%20%7C%20Vite-orange.svg)

## 📋 Descripción

**NeuroLog** no es solo un diario. Es una herramienta de **neuroeducación** que guía al usuario a través de una sesión de 15 minutos diseñada para fortalecer el hipocampo y la retención de memoria a largo plazo.

A diferencia de las aplicaciones pesadas basadas en frameworks complejos, NeuroLog utiliza la potencia nativa del navegador, ofreciendo una experiencia fluida, offline-first y totalmente responsiva.

### 🎯 Objetivo del Proyecto
Ayudar a las personas a combatir el "piloto automático" diario. Al obligar al cerebro a reconstruir los eventos del día (o del día anterior) en orden cronológico y espacial, se fortalecen las conexiones neuronales asociadas a la memoria episódica.

---

## 🚀 Características Principales

*   **Dos Modos de Sesión:**
    *   ☀️ **Matutina:** Activación cognitiva recordando el día de ayer (Recuperación diferida).
    *   🌙 **Nocturna:** Consolidación de memoria recordando el día actual antes de dormir.
*   **🧩 Ejercicios Cognitivos Intercalados:** Desafío de memoria de trabajo (memorizar y recuperar objetos) integrado en el flujo del diario.
*   **☁️ Sincronización en la Nube:** Integración real con **Google Drive** para guardar tu progreso sin servidores intermediarios.
*   **🔒 Privacidad Total:** Los datos viven en tu navegador o en tu Drive personal. No hay bases de datos externas.
*   **💾 Backup Local:** Importación y exportación de copias de seguridad en formato JSON.
*   **📅 Calendario y Estadísticas:** Visualización de rachas y revisión de entradas pasadas.
*   **🎨 UI/UX Moderna:** Diseño limpio, Modo Oscuro automático y transiciones suaves.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto demuestra que no siempre necesitas React o Vue para crear aplicaciones web complejas y reactivas.

*   **Core:** HTML5, CSS3, **Vanilla JavaScript (ES Modules)**.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (vía PostCSS).
*   **Build Tool:** [Vite](https://vitejs.dev/) (para un entorno de desarrollo ultrarrápido y optimización de producción).
*   **Iconos:** [Lucide Icons](https://lucide.dev/).
*   **API:** Google Drive API (Client-side OAuth 2.0).

---

## 📖 Cómo Funciona (Paso a Paso)

1.  **Inicio:** El usuario selecciona el tipo de sesión.
2.  **Calentamiento:** Se inicia un cronómetro para mantener el enfoque.
3.  **Recuerdo Cronológico:** Se guía al usuario por bloques de tiempo (Mañana, Mediodía, Tarde).
4.  **Codificación (Encoding):** A mitad de la sesión, se muestran 5 objetos aleatorios durante 30 segundos.
5.  **Recuerdo Espacial y Emocional:** Se pide recordar trayectos físicos y anécdotas.
6.  **Recuperación (Retrieval):** Al finalizar, el usuario debe seleccionar los 5 objetos vistos anteriormente entre distractores.
7.  **Feedback:** El sistema calcula una puntuación y ofrece un consejo de neuroeducación basado en el rendimiento.

---

## 💻 Instalación y Uso Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina.

### Prerrequisitos
*   Node.js (v16 o superior)
*   Git

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/neurolog-vanilla.git
    cd neurolog-vanilla
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # O si usas pnpm (recomendado):
    pnpm install
    ```

3.  **Configurar Google Drive (Importante):**
    *   Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
    *   Habilita la **Google Drive API**.
    *   Crea credenciales OAuth 2.0 para Web.
    *   Añade `http://localhost:5173` en "Orígenes autorizados de JavaScript".
    *   Copia tu `CLIENT_ID` y pégalo en el archivo `js/constants.js`.

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Construir para producción:**
    ```bash
    npm run build
    ```
    Esto generará una carpeta `dist/` lista para subir a GitHub Pages, Vercel o Netlify.

---

## 🔮 Roadmap y Siguientes Pasos

El proyecto es funcional, pero tenemos grandes planes para la versión 2.0, enfocados en integrar **Inteligencia Artificial Real**.

*   [x] Lógica base y almacenamiento local.
*   [x] Integración con Google Drive.
*   [ ] **Integración con IA (Gemini/OpenAI):**
    *   Reemplazar el feedback estático por análisis semántico real.
    *   Detectar patrones de estado de ánimo en el texto del diario.
    *   Generar preguntas personalizadas basadas en lo que escribiste ("Mencionaste a Juan, ¿cómo te sentiste al verlo?").
*   [ ] **PWA (Progressive Web App):** Hacerla instalable en móviles.
*   [ ] **Gamificación:** Sistema de niveles y medallas más complejo.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar el código, arreglar bugs o añadir traducciones:

1.  Haz un **Fork** del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Haz tus cambios y **Commit** (`git commit -m 'Add some AmazingFeature'`).
4.  Haz **Push** a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un **Pull Request**.

---

## ❤️ Apoya el Proyecto

El desarrollo de software open-source requiere tiempo y dedicación (y mucho café ☕). Si NeuroLog te ha sido útil o te gusta la iniciativa de crear software ligero y eficiente, considera hacer una pequeña donación.

Ayudará a pagar los costos de integración de IA futura y el mantenimiento.

[![Invítame un café en Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/brauliofv)

También puedes apoyar simplemente dejando una ⭐ **Estrella** en este repositorio.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](LICENSE.md) para más detalles.

---
*Desarrollado con 🧠 por [Braulio](https://github.com/brauliofv)*