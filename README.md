# 💻 Real State System App - Documentación del Frontend

Este documento proporciona un análisis detallado de la arquitectura, estructura y flujos de trabajo del proyecto frontend. El objetivo es servir como una guía completa para facilitar el desarrollo continuo y la integración con el backend.

---

## 🚀 Tecnologías y Arquitectura

El proyecto está construido sobre un stack moderno de tecnologías para el desarrollo de aplicaciones web con React:

- **Framework Principal:** [Next.js](https://nextjs.org/) 16+ (usando App Router).
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño basado en utilidades.
- **Componentes de UI:** La estructura sigue las mejores prácticas de [Shadcn/UI](https://ui.shadcn.com/), utilizando `class-variance-authority` para variantes y `tailwind-merge` para la fusión de clases. Los iconos son de `lucide-react`.
- **Formularios:** [React Hook Form](https://react-hook-form.com/) para una gestión eficiente y performante de los formularios.
- **Validación de Datos:** [Zod](https://zod.dev/) para la definición de esquemas y validación tanto en cliente como (potencialmente) en servidor.
- **Cliente HTTP:** [Axios](https://axios-http.com/) para realizar peticiones a la API.

---

## 📁 Estructura de Carpetas

La organización del proyecto sigue una lógica de separación de responsabilidades clara:

- **`/app`**: Contiene el enrutamiento y las vistas principales de la aplicación, siguiendo la convención del App Router de Next.js.
  - **`/(auth)`**: Grupo de rutas para las páginas de autenticación (Login, Registro, etc.).
  - **`/(dashboard)`**: Grupo de rutas para las páginas protegidas que requieren autenticación.
- **`/components`**: Alberga componentes de React reusables.
  - **`/ui`**: Componentes de bajo nivel, altamente reusables y agnósticos a la lógica de negocio (Button, Input, Card, etc.), siguiendo el patrón de Shadcn/UI.
  - **`/shared`**: Componentes compartidos en varias partes de la aplicación (ej. Header, Footer).
  - **`/auth`**, **`/users`**: Componentes específicos para una funcionalidad o dominio concreto.
- **`/hooks`**: Contiene los hooks personalizados de React, que encapsulan lógica de estado y efectos secundarios.
  - **`use-auth.ts`**: Hook central para gestionar el estado de autenticación global (usuario, token, etc.).
  - **`use-users.ts`**: Hook para la gestión de datos de usuarios (CRUD).
- **`/lib`**: Utilidades, configuración y código de soporte.
  - **`/api/client.ts`**: Configuración centralizada del cliente Axios para las llamadas a la API.
  - **`/schemas`**: Definiciones de esquemas de validación con Zod.
  - **`/utils.ts`**: Funciones de utilidad generales.
- **`/services`**: Capa de abstracción para la comunicación con la API. Su responsabilidad es desacoplar la lógica de la aplicación del cliente HTTP.
  - **`auth.service.ts`**: Contiene los métodos para las operaciones de autenticación (`login`, `logout`, etc.).
  - **`user.service.ts`**: Métodos para el CRUD de usuarios.
- **`/types`**: Define las interfaces y tipos de TypeScript que se usan a lo largo de la aplicación.

---

## 🔑 Flujo de Autenticación (Implementación Actual - SIMULADA)

El flujo de login actual está **completamente simulado en el frontend** para permitir el desarrollo de la interfaz de usuario sin depender de un backend funcional. Es un flujo de dos pasos (credenciales + 2FA).

**Para iniciar sesión en el entorno de desarrollo, utiliza cualquier correo y la contraseña que desees. Cuando se te pida el código de seguridad, introduce `123456`.**

A continuación se detalla el proceso paso a paso:

**Paso 1: Envío de Credenciales**

1.  **UI (Componente):** El usuario navega a `/login`. La página `app/(auth)/login/page.tsx` renderiza un formulario construido con `react-hook-form` y componentes de `/components/ui`.
2.  **Validación:** Antes del envío, Zod (`lib/schemas/auth.schema.ts`) valida que el email y la contraseña cumplan con el formato requerido.
3.  **Llamada al Servicio:** Al enviar el formulario, se invoca a `authService.login()` desde `services/auth.service.ts`.
4.  **Simulación de API:** Dentro de `authService.login()`, la llamada a la API está comentada. En su lugar, una `Promise` con `setTimeout` de 1.5 segundos simula una llamada de red y **siempre** devuelve `{ requires2FA: true }`.
5.  **Transición de UI:** La página de login recibe esta respuesta y actualiza su estado para mostrar el segundo paso del formulario: la solicitud del código 2FA.

**Paso 2: Verificación del Código 2FA**

1.  **UI (Componente):** El usuario ve un campo para introducir un código de 6 dígitos.
2.  **Validación:** Zod vuelve a actuar para asegurar que el código es un string de 6 caracteres.
3.  **Llamada al Servicio:** Al enviar el código, se invoca a `authService.verify2FA()`.
4.  **Simulación de API:** Dentro de `authService.verify2FA()`, otro `setTimeout` simula una espera. El servicio comprueba si el código introducido es exactamente **`123456`**.
    -   **Si el código es `123456`**, la promesa se resuelve con un objeto `AuthResponse` falso, que incluye un `fake-jwt-token` y un objeto de usuario simulado.
    -   **Si el código es diferente**, la promesa se rechaza con un error, que se muestra en la interfaz.
5.  **Finalización de Sesión:** Si la verificación es exitosa, el componente de login llama a `startSession(authResponse)` del hook `useAuth`.
6.  **Gestión de Estado Global:** El hook `useAuth` (`hooks/use-auth.ts`) recibe los datos, guarda el token (probablemente en `localStorage` o `sessionStorage`) y actualiza su estado interno con la información del usuario.
7.  **Redirección:** Un `useEffect` en la página de login, que está suscrito a los cambios en el estado del `user` del `useAuth`, detecta el nuevo usuario y redirige automáticamente al `/dashboard`.

---

## 🛠️ Cómo Integrar el Backend Real

Para conectar esta aplicación a un backend real, sigue estos pasos:

1.  **Configurar el Cliente API:**
    -   Abre `lib/api/client.ts`.
    -   Establece la `baseURL` de Axios para que apunte a la URL raíz de tu backend (ej. `http://localhost:3000/api/v1`).
    -   Configura interceptores si necesitas añadir el token JWT a las cabeceras de las peticiones salientes.

2.  **Actualizar el Servicio de Autenticación (`services/auth.service.ts`):**
    -   **En `login()`:** Elimina la simulación con `setTimeout` y descomenta la línea `const response = await apiClient.post("/auth/login", credentials);`. Asegúrate de que la ruta `/auth/login` y el cuerpo de la petición coinciden con lo que espera el backend.
    -   **En `verify2FA()`:** Haz lo mismo: elimina la simulación y descomenta la llamada a `apiClient.post("/auth/verify-2fa", payload)`. Adapta la ruta y el payload si es necesario.
    -   Ajusta los tipos en `types/auth.types.ts` para que coincidan exactamente con las respuestas que enviará el backend real.

3.  **Manejar Errores Reales:**
    -   Modifica los bloques `catch` en los componentes y hooks para interpretar y mostrar los mensajes de error que provienen del backend, en lugar de los mensajes genéricos actuales.

4.  **Revisar los demás servicios:**
    -   Aplica el mismo proceso para `user.service.ts` y cualquier otro servicio, reemplazando la lógica simulada por llamadas reales con `apiClient`.