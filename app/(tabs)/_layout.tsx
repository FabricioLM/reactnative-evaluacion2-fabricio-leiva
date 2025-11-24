import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="todos"
        options={{ title: 'TODO List' }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil' }}
      />
    </Tabs>
  );
}
