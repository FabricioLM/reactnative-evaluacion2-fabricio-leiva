import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Pantalla de Login (inicial) */}
        <Stack.Screen
          name="index"
          options={{ title: 'Login' }}
        />
        {/* Grupo de tabs (Home, Todos, Perfil) */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
