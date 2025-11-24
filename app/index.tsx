import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { setEmail } = useAuth();
  const [email, setEmailInput] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = () => {
    if (password !== '1234') {
      setError('Contraseña incorrecta');
      return;
    }

    if (!email) {
      setError('Ingresa un email');
      return;
    }

    setError('');
    setEmail(email);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de sesión</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmailInput}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="tuemail@correo.com"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
