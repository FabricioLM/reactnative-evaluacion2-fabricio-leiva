import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { email } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {email ? (
        <Text style={styles.text}>Email: {email}</Text>
      ) : (
        <Text style={styles.text}>
          No se encontró email. Vuelve a iniciar sesión.
        </Text>
      )}
      <Text style={styles.textNote}>
        Las tareas del TODO List están asociadas a este usuario y solo son visibles para él.
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
  textNote: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
});
