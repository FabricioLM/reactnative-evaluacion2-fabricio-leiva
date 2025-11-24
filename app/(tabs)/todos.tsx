import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

type Todo = {
  id: string;
  title: string;
  imageUri: string;
  completed: boolean;
  userEmail: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

export default function TodosScreen() {
  const { email } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [locationText, setLocationText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const storageKey = email ? `todos_v1_${email}` : null;

  useEffect(() => {
    const loadTodos = async () => {
      if (!storageKey) {
        setTodos([]);
        setLoading(false);
        return;
      }
      try {
        const json = await AsyncStorage.getItem(storageKey);
        if (json) {
          const parsed: Todo[] = JSON.parse(json);
          setTodos(parsed);
        } else {
          setTodos([]);
        }
      } catch (error) {
        console.error('Error cargando tareas', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [storageKey]);

  const saveTodos = async (data: Todo[]) => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando tareas', error);
      Alert.alert('Error', 'No se pudieron guardar las tareas.');
    }
  };

  const handlePickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso requerido', 'Debes otorgar permiso para acceder a tus fotos.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
    base64: true, // ← IMPORTANTE PARA iPhone
  });

  if (result.canceled) return;

  const asset = result.assets[0];

  try {
    // Creamos carpeta "photos"
    const photosDir =
      (FileSystem.documentDirectory ?? FileSystem.cacheDirectory) + 'photos/';

    // mkdir sin getInfoAsync (EXPO 54+)
    await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });

    const fileName = `${Date.now()}.jpg`;
    const destPath = photosDir + fileName;

    // Reescribimos nosotros mismos la imagen en base64
    await FileSystem.writeAsStringAsync(destPath, asset.base64!, {
      encoding: FileSystem.EncodingType.Base64,
    });

    setImageUri(destPath);
  } catch (error) {
    console.error('Error guardando imagen', error);
    Alert.alert('Error', 'No se pudo guardar la imagen.');
  }
};


  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationText('Permiso de ubicación denegado.');
      return null;
    }

    const pos = await Location.getCurrentPositionAsync({});
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    setLocationText(`Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`);

    return { latitude: lat, longitude: lon };
  };

  const handleAddTodo = async () => {
    if (!email) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para crear tareas.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Título requerido', 'Ingresa un título para la tarea.');
      return;
    }

    if (!imageUri) {
      Alert.alert('Imagen requerida', 'Selecciona una foto para la tarea.');
      return;
    }

    setSaving(true);
    try {
      const loc = await getLocation();

      const newTodo: Todo = {
        id: Date.now().toString(),
        title: title.trim(),
        imageUri,
        completed: false,
        userEmail: email,
        latitude: loc?.latitude,
        longitude: loc?.longitude,
        createdAt: new Date().toISOString(),
      };

      const updated = [newTodo, ...todos];
      setTodos(updated);
      await saveTodos(updated);

      // Reset formulario
      setTitle('');
      setImageUri(null);
      if (!loc) {
        setLocationText('Sin ubicación (permiso denegado o error).');
      }
    } catch (error) {
      console.error('Error creando tarea', error);
      Alert.alert('Error', 'No se pudo crear la tarea.');
    } finally {
      setSaving(false);
    }
  };

  const toggleTodo = async (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    await saveTodos(updated);
  };

  const deleteTodo = async (id: string) => {
    Alert.alert('Eliminar tarea', '¿Estás seguro que deseas eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const updated = todos.filter((t) => t.id !== id);
          setTodos(updated);
          await saveTodos(updated);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={[styles.todoItem, item.completed && styles.todoItemCompleted]}>
      <Image source={{ uri: item.imageUri }} style={styles.todoImage} />
      <View style={styles.todoInfo}>
        <Text style={styles.todoTitle}>
          {item.title} {item.completed ? '✅' : '⏳'}
        </Text>
        {item.latitude && item.longitude && (
          <Text style={styles.todoLocation}>
            Ubicación: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </Text>
        )}
        <View style={styles.todoActions}>
          <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.todoButton}>
            <Text style={styles.todoButtonText}>
              {item.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteTodo(item.id)}
            style={[styles.todoButton, styles.todoButtonDelete]}
          >
            <Text style={styles.todoButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!email) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>TODO List</Text>
        <Text style={styles.text}>
          Debes iniciar sesión para ver y crear tus tareas.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO List</Text>
      <Text style={styles.text}>
        Crea tareas con título, foto y ubicación. Solo verás tus propias tareas.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Título de la tarea</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Comprar comida para el gato"
        />

        <Button title="Seleccionar foto" onPress={handlePickImage} />

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        {locationText ? (
          <Text style={styles.locationText}>{locationText}</Text>
        ) : null}

        {saving ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : (
          <Button title="Crear tarea" onPress={handleAddTodo} />
        )}
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Mis tareas</Text>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : todos.length === 0 ? (
          <Text style={styles.text}>Aún no has creado tareas.</Text>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    textAlign: 'center',
    marginBottom: 8,
  },
  form: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  previewImage: {
    width: '100%',
    height: 160,
    marginTop: 8,
    borderRadius: 8,
  },
  locationText: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.8,
  },
  listContainer: {
    flex: 1,
    marginTop: 8,
  },
  todoItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    gap: 8,
  },
  todoItemCompleted: {
    opacity: 0.7,
  },
  todoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  todoInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  todoLocation: {
    fontSize: 12,
    opacity: 0.8,
  },
  todoActions: {
    marginTop: 4,
    gap: 4,
  },
  todoButton: {
    paddingVertical: 4,
  },
  todoButtonDelete: {
    marginTop: 2,
  },
  todoButtonText: {
    fontSize: 13,
    color: '#007AFF',
  },
});
