# 🟣 VIDEO DEMOSTRATIVO (GOOGLE DRIVE)

📌 **Link del video:**
👉 https://drive.google.com/drive/folders/1lNbN2SH72LdO3lS3BNX8577cyscYWaCM?usp=sharing

---

# Evaluación 3 – React Native con Expo (TODO List + Backend)

**Estudiante:** Fabricio Leiva
**Proyecto:** App móvil con Login (API) + TODO List (CRUD 100% Backend)
**Tecnologías:** React Native, Expo, TypeScript, Expo Router, AsyncStorage, Fetch API

---

## 🧠 Objetivo

Esta aplicación fue desarrollada para la **Evaluación 3**, integrando una app Expo con un **backend real**, incluyendo autenticación, persistencia de sesión y CRUD completo de tareas usando únicamente la API.

Backend (Swagger):
👉 https://todo-list.dobleb.cl/docs

---

## ✅ Requisitos cumplidos (según rúbrica)

### 1) Integración backend funcional

- Listar tareas (GET)
- Crear tareas (POST)
- Actualizar tareas (PATCH)
- Eliminar tareas (DELETE)

### 2) Autenticación y persistencia del token

- Login real contra API
- Token JWT persistido en AsyncStorage
- Rutas protegidas

### 3) Calidad de código

- Servicios separados
- Contexto de autenticación
- Manejo de errores

### 4) Video demostrativo

- Flujo completo mostrado en menos de 2 minutos

### 5) Repositorio e informe

- README claro
- Sin node_modules

---

## 📱 Funcionalidades principales

### 🔐 Login

- Autenticación con backend
- Manejo de errores
- Persistencia de sesión

### 🧭 Navegación

- Stack + Tabs con Expo Router
- Rutas protegidas

### ✅ TODO List

- CRUD completo usando API
- Tareas asociadas al usuario autenticado
- Captura de ubicación (lat/lon)

> El manejo de imágenes es **opcional** y no fue implementado para priorizar estabilidad.

### 👤 Perfil

- Sesión activa
- Cierre de sesión

---

## 🗂️ Estructura del proyecto

app/
context/
services/
.env

---

## 🤖 Uso de Inteligencia Artificial

La IA (ChatGPT) fue utilizada **exclusivamente para la redacción del README.md**.
Todo el código fue desarrollado y probado manualmente.

---

## ▶️ Video demostrativo

👉 https://drive.google.com/drive/folders/1lNbN2SH72LdO3lS3BNX8577cyscYWaCM?usp=sharing

---

## ⚙️ Configuración y ejecución

```bash
npm install
npx expo install expo-location @react-native-async-storage/async-storage
npx expo start
```
