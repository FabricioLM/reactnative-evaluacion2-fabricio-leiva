# 🟣 VIDEO DEMOSTRATIVO (GOOGLE DRIVE)
📌 Link del video:  
👉 https://drive.google.com/drive/folders/1lNbN2SH72LdO3lS3BNX8577cyscYWaCM?usp=sharing

---

# Evaluación 2 – React Native con Expo (TODO List)

**Estudiante:** Fabricio Leiva  
**Proyecto:** App móvil con Login + TODO List  
**Tecnologías:** React Native, Expo, TypeScript, Expo Router, AsyncStorage

---

## 🧠 Objetivo

Esta aplicación fue desarrollada para la **Evaluación 2**, cumpliendo con los siguientes puntos:

- Uso de **React Native con Expo**.
- Proyecto en **TypeScript** (`.tsx`).
- Navegación con **Expo Router** (Stack + Tabs).
- Reutilización del **login** creado en la Evaluación 1.
- Implementación de un **TODO List** con:
  - Creación de tareas con **título**, **foto** y **ubicación**.
  - Marcar tareas como **completadas / no completadas**.
  - **Eliminar** tareas.
  - Tareas asociadas al **usuario logeado** (por email).
  - Persistencia en **AsyncStorage**.
  - Fotos guardadas en el sistema de archivos local con **expo-file-system**.

---

## 📱 Funcionalidades principales

### 1. Login

- Pantalla de inicio de sesión con:
  - Campo **Email**
  - Campo **Password**
- Validación:
  - Si la contraseña es distinta de `1234` → muestra “Contraseña incorrecta”.
  - Si la contraseña es `1234` → navega a las tabs.
- Al iniciar sesión:
  - Se guarda el email en un **AuthContext**.
  - Se usa ese email para asociar las tareas del TODO List.

### 2. Navegación con Expo Router

- `app/_layout.tsx` define un **Stack**:
  - `index` → Login
  - `(tabs)` → Grupo de tabs
- `app/(tabs)/_layout.tsx` define tabs:
  - **Home**
  - **TODO List**
  - **Perfil**

### 3. TODO List

Pantalla: `app/(tabs)/todos.tsx`

- Formulario para crear tareas:
  - Campo **título**
  - Botón **Seleccionar foto** (galería)
  - Captura de ubicación con **expo-location**
- Guardado de imagen:
  - Se pide permiso a la galería.
  - Se copia la imagen a `FileSystem.documentDirectory/photos`.
  - Se guarda la ruta local de la imagen.
- Guardado de tareas:
  - Se guarda cada tarea en **AsyncStorage**, bajo una clave por usuario:  
    `todos_v1_EMAIL_DEL_USUARIO`
  - Cada tarea incluye:
    - `id`
    - `title`
    - `imageUri`
    - `completed`
    - `userEmail`
    - `latitude`, `longitude`
    - `createdAt`
- Listado:
  - Se muestran solo las tareas del usuario actual.
  - Posibilidad de:
    - Marcar completada / pendiente.
    - Eliminar la tarea.

### 4. Perfil

Pantalla: `app/(tabs)/perfil.tsx`

- Muestra el **email** del usuario logeado.
- Indica que las tareas del TODO List están asociadas a ese usuario.

---

## 👨‍💻 Integrantes del grupo y roles

En esta evaluación el trabajo fue realizado de forma **individual**:

- **Fabricio Leiva**
  - Diseño de la solución
  - Implementación del login y navegación
  - Implementación del TODO List
  - Integración de AsyncStorage, expo-image-picker, expo-location y expo-file-system
  - Pruebas en dispositivo físico con Expo Go
  - Elaboración del README e informe

---

## 🤖 Uso de Inteligencia Artificial

El uso de Inteligencia Artificial (ChatGPT) en esta evaluación se limitó exclusivamente a la **creación y redacción del archivo README.md**, con el fin de presentar la documentación de manera clara, ordenada y profesional.

Todo el código de la aplicación —incluyendo el login, navegación, manejo de tareas, integración de fotos, ubicación, almacenamiento local y pruebas en dispositivo físico— fue desarrollado, revisado y probado manualmente por el estudiante.


---

## ▶️ Video demostrativo

El video (máx. 2 minutos) muestra:

1. Inicio de sesión con contraseña incorrecta → mensaje de error.  
2. Inicio de sesión correcto con contraseña `1234`.  
3. Navegación a la tab **TODO List**.  
4. Creación de una tarea:
   - Escribir título.
   - Seleccionar foto.
   - Captura de ubicación.
   - Guardado de la tarea.
5. Visualización de la tarea creada en la lista.
6. Marcado de tarea como completada.
7. Eliminación de la tarea.
8. Navegación a **Perfil**, mostrando el email del usuario.

👉 Enlace al video:  
https://drive.google.com/drive/folders/1lNbN2SH72LdO3lS3BNX8577cyscYWaCM?usp=sharing

---

## ⚙️ Cómo ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Instalar dependencias nativas usadas en la Evaluación 2
npx expo install expo-image-picker expo-location expo-file-system @react-native-async-storage/async-storage

# Ejecutar la app
npx expo start
