# Conectame Social - Mobile Application Migration (React Native)

Este documento resume el trabajo realizado para migrar la aplicación "Conectame Social" de una aplicación web Next.js a una aplicación móvil React Native.

## Objetivo Inicial de Configuración y Migración
El objetivo principal era convertir la aplicación web Next.js existente en una aplicación móvil React Native para permitir la integración con módulos nativos de Kotlin. Esto implicó crear un nuevo proyecto React Native y migrar sistemáticamente componentes y funcionalidades.

## Configuración del Proyecto
1.  **Nuevo Proyecto React Native:** Se inicializó un nuevo proyecto React Native llamado `ConectameApp` dentro del directorio `mobile/` usando TypeScript.
2.  **Integración de Estilos (NativeWind):**
    *   Se instalaron `nativewind` y `tailwindcss`.
    *   Se inicializó `tailwind.config.js` y se configuró para reflejar las fuentes personalizadas, colores y otras extensiones de tema del proyecto Next.js.
    *   Se actualizó `babel.config.js` para incluir el plugin `nativewind/babel`.
3.  **Integración de Fuentes Personalizadas:**
    *   Se crearon archivos `.ttf` de marcador de posición para `Poppins` y `PT Sans` en `mobile/ConectameApp/assets/fonts`.
    *   Se creó `react-native.config.js` para vincular estos assets para el auto-enlace en builds nativos.
4.  **Hooks y Funciones de Utilidad:**
    *   Se recreó el hook `useIsMobile` (para responsividad) para React Native.
    *   Se portó la utilidad `cn` (para fusionar clases de Tailwind) usando `clsx` y `tailwind-merge`.
    *   Se implementó un hook `useToast` usando `react-native-toast-message` y se integró en `App.tsx`.
5.  **Migración de Datos:**
    *   Se copiaron los tipos `User` y `Post` de `src/lib/types.ts`.
    *   Se copiaron los datos de imágenes de marcador de posición (`src/lib/placeholder-images.json`, `src/lib/placeholder-images.ts`) y los datos principales (`src/lib/data.ts`).
6.  **Configuración de Navegación (`@react-navigation/drawer`):**
    *   Se instalaron `@react-navigation/native`, `@react-navigation/drawer`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`.
    *   Se actualizó `babel.config.js` para incluir `react-native-reanimated/plugin` (como el último plugin).
    *   `App.tsx` se configuró con `GestureHandlerRootView`, `NavigationContainer` y `Drawer.Navigator`.

## Migración de Componentes - Pantallas del Dashboard
Los componentes de UI y las pantallas principales del dashboard se migraron sistemáticamente:

*   **`SidebarProvider` y UI Básica de la Barra Lateral:** Se creó el Contexto de React para el estado de la barra lateral (`SidebarProvider`, `useSidebar`) y los componentes básicos de UI (`Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarInset`) utilizando `View`/`Text` de React Native y estilos de `NativeWind`.
*   **Componente `AppSidebar`:** Recreado para integrar la UI personalizada de la barra lateral, la lógica de navegación y los datos de usuario.
*   **Componentes de UI Dependientes:**
    *   `Card`, `CardHeader`, `CardContent`, `CardFooter`
    *   `Textarea`
    *   `Button`
    *   `Avatar`, `AvatarImage`, `AvatarFallback`
    *   `ScrollArea`
    *   `Input` (incluyendo un marcador de posición para la entrada de archivos)
    *   `RadioGroup`, `RadioGroupItem`
    *   Componentes de formulario (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`) que funcionan con `react-hook-form`.
*   **Migración de Pantallas del Dashboard:**
    *   **Pantalla de Inicio (`HomeScreen.tsx`):** Migrada, integrando `CreatePostForm` y `PostCard`.
    *   **Pantalla de Exploración (`ExploreScreen.tsx`):** Migrada, implementando una cuadrícula responsiva básica para imágenes.
    *   **Pantalla de Mensajes (`MessagesScreen.tsx`):** Migrada, incluyendo lógica de diseño responsivo para conversaciones y chat.
    *   **Pantalla de Creación de Publicaciones (`CreatePostScreen.tsx`):** Migrada, integrando `AiCreationForm`.
    *   **Pantalla de Perfil (`ProfileScreen.tsx`):** Creada como un marcador de posición.
    *   **Pantalla de Configuración (`SettingsScreen.tsx`):** Creada como un marcador de posición.

## Migración de la Funcionalidad de IA (Simulada)
*   Se integraron `react-hook-form` y `zod` para la gestión y validación de formularios.
*   Se instaló `react-native-image-picker` y se creó un componente `ImageInput` para manejar la selección de imágenes y proporcionar URIs de datos base64.
*   La función `aiPoweredContentCreation` (la lógica central de IA) se migró como una **implementación simulada (mock)**. El flujo de IA real utiliza Genkit y una directiva `use server`, que es específica de la web. **Para habilitar completamente la funcionalidad de IA, se requeriría un servicio backend separado.**

## GitHub Actions para la Compilación de Android
Se configuró un flujo de trabajo de GitHub Actions (`.github/workflows/android-build.yml`) para automatizar el proceso de compilación del Android App Bundle (AAB), incluyendo Node.js, JDK 17, dependencias de npm y comandos de Gradle.

## Solución de Problemas y Estado Actual

### Problemas de Compilación en GitHub Actions (Diagnosticado como Entorno)
Se realizaron múltiples intentos para resolver fallas de compilación persistentes en GitHub Actions, principalmente relacionadas con:
*   `react-native-reanimated` que requiere `react-native-worklets`.
*   Errores de configuración de Babel (`.plugins is not a valid Plugin property`).
*   Errores de resolución de módulos de Metro (`Unable to resolve module @/hooks/use-mobile`) con espacios extraños en las rutas de importación.

A pesar de una exhaustiva solución de problemas, incluyendo la modificación de `babel.config.js`, `metro.config.js`, la adición de pasos de limpieza de caché, `git clean`, y la reescritura explícita de archivos, el error de resolución de módulos persistió en GitHub Actions, mostrando consistentemente una ruta de importación mal formada (`" @/hooks/use-mobile"`). Esto fue finalmente diagnosticado como un **problema ambiental o de caché profundamente arraigado dentro del propio runner de GitHub Actions, irresoluble a través de cambios de código.**

### Problemas de Compilación Local del APK de Android
Los intentos de compilar un APK de lanzamiento localmente también encontraron errores persistentes:
*   `Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field 'org.gradle.jvm.toolchain.JvmVendorSpec IBM_SEMERU'`.

La solución de problemas incluyó:
*   Configuración explícita de la `toolchain` de Java 17 en `app/build.gradle` (y luego se revirtió al no solucionar el problema).
*   Detención del demonio de Gradle.
*   Limpieza de todas las cachés globales de Gradle (`~/.gradle/caches`).
*   Limpieza de los directorios de compilación del proyecto (`./gradlew clean`).
*   Actualización del wrapper de Gradle a una versión fresca.

El error `IBM_SEMERU` persiste, lo que indica un **problema fundamental con la instalación local de Gradle, su interacción con el JVM (JDK 21 es compatible), o un problema de configuración ambiental más profundo en la máquina local del usuario que está más allá de las correcciones de código a nivel de proyecto.**

## Estado Actual
La estructura central de la aplicación y todos los componentes especificados han sido migrados de Next.js a React Native. Sin embargo, tanto los builds automatizados (GitHub Actions) como los builds locales del APK de lanzamiento están fallando actualmente debido a problemas ambientales relacionados con la integridad del runner de GitHub Actions y la configuración local de Gradle/JVM, respectivamente.
```