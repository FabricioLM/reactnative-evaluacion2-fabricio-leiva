import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { email } = useAuth();

  useEffect(() => {
    console.log('Home montada. Email actual:', email);
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>
      {email && <Text style={styles.text}>Has iniciado sesión como: {email}</Text>}
      <Text style={styles.text}>
        Esta es la pantalla principal (Home) de la Evaluación 2.
      </Text>
      <Text style={styles.text}>
        Usa la pestaña "TODO List" para gestionar tus tareas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
