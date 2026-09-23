# Tarea-2-2026-2-S1 FRONTEND

**RECUERDA**: este repositorio solo sirve para probar tu código de la API. No debes modificarlo a menos que quieras cambiar el puerto en donde se aloja la aplicación.

## Instalación 👷 🛠️

0. Haz un fork de este repositorio.

1. Clona tu repositorio individual:
  ```bash
  git clone <URL-de-tu-repo>
  cd <URL-de-tu-repo>
  ```

2. Crea un archivo `.env` en la raíz del proyecto con la URL de tu API (backend):

```
VITE_API_URL=http://localhost:3000/api
```

3. Instala las dependencias

```bash
    pnpm install
```

4. Levanta el entorno de desarrollo:
```bash
   pnpm run dev
```

5. En caso de que en la consola aparezca algún error o advertencia, lee con atención el output:
Puede solicitarte instalar dependencias adicionales o realizar configuraciones específicas, simplemente guíate por lo que sale. En caso de dudas, puedes preguntar en las issues.

## ⚙️ Requisitos previos
Asegúrate de cumplir con los requerimientos de la aplicación.
- [Node.js](https://nodejs.org/) versión **>= 20**

También puedes usar otro gestor de paquetes :D

## Notas

Importante mencionar la estructura del proyecto no es necesariamente la mejor, para que no sigan estrictamente por modularizaciones de front basados en esta para el futuro. De hecho, probablemente para un proyecto real o en un plazo mayor, se pueden hacer hartas optimizaciones y mejoras en la calidad del código.

### Revisión de endpoints
Se recomienda buscar en su editor de código favorito (VScode, etc.) la siguiente palabra a nivel global: "apiClient". Sí podrán ver todo lo relacionado a llamadas.


### Sesión y autenticación
Este frontend maneja la sesión mediante una **cookie HttpOnly**, no mediante un token guardado en localStorage. El cliente HTTP (`src/api/client.js`) ya está configurado con `withCredentials: true`, por lo que **tu backend debe implementar CORS con `credentials: true` y un origin explícito** (no `*`) para que la cookie de sesión viaje correctamente entre el frontend y tu API.
