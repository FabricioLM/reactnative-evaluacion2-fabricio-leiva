import {
  apiCreateTodo,
  apiDeleteTodo,
  apiGetTodos,
  ApiTodo,
  apiUpdateTodo,
} from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard, // Importamos Keyboard para bajar el teclado
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Todos() {
  const [todos, setTodos] = useState<ApiTodo[]>([]);
  const [title, setTitle] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  // Estado para la carga inicial de la pantalla
  const [loading, setLoading] = useState(true);
  // Estado para saber si estamos guardando algo (bloquear botón)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modificamos load para aceptar un parámetro 'silent' (silencioso)
  // Si silent es true, NO pone la pantalla en blanco cargando.
  const load = async (silent = false) => {
    try {
      setError(null);
      if (!silent) setLoading(true); // Solo carga pantalla completa si no es silencioso

      console.log("Cargando tareas...");
      const data = await apiGetTodos();
      console.log("Tareas cargadas:", data.length);

      setTodos(data);
    } catch (e: any) {
      console.error("Error al cargar:", e);
      setError(e?.message ?? "Error cargando tareas");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // La primera vez carga normal (con spinner)
    load(false);
  }, []);

  const getLocation = async () => {
    try {
      setError(null);
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        setError("Permiso denegado para ubicación");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    } catch (e: any) {
      setError("Error al obtener ubicación");
    }
  };

  const create = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Debes escribir un título");
      return;
    }

    try {
      setError(null);
      setSaving(true);
      Keyboard.dismiss(); // Bajamos el teclado para ver mejor

      console.log("Enviando tarea:", cleanTitle, coords);

      // 1. Crear la tarea
      await apiCreateTodo({
        title: cleanTitle,
        latitude: coords?.lat,
        longitude: coords?.lon,
      });

      console.log("Tarea creada con éxito. Recargando lista...");

      // 2. Limpiar formulario
      setTitle("");
      setCoords(null);

      // 3. Recargar la lista SIN bloquear la pantalla (silent = true)
      await load(true);
    } catch (e: any) {
      console.error("Error al crear:", e);
      setError(e?.message ?? "Error al crear tarea");
      Alert.alert("Error", "No se pudo crear la tarea. Revisa la consola.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item: ApiTodo) => {
    try {
      // Optimistic update: cambia visualmente antes de esperar al server (se siente más rápido)
      const updatedTodos = todos.map((t) =>
        t.id === item.id ? { ...t, completed: !t.completed } : t
      );
      setTodos(updatedTodos);

      await apiUpdateTodo(item.id, { completed: !item.completed });
      await load(true); // Recarga silenciosa para asegurar consistencia
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo actualizar");
      load(true); // Si falla, recarga para volver al estado real
    }
  };

  const remove = async (item: ApiTodo) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            // Eliminamos visualmente primero
            setTodos((prev) => prev.filter((t) => t.id !== item.id));
            await apiDeleteTodo(item.id);
            // No es necesario recargar si ya lo quitamos visualmente,
            // pero podemos hacer una carga silenciosa por seguridad.
            load(true);
          } catch (e) {
            Alert.alert("Error", "No se pudo eliminar");
            load(true);
          }
        },
      },
    ]);
  };

  // Renderizado de carga inicial (pantalla completa)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10, color: "#6B7280" }}>
          Cargando tus tareas...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- FORMULARIO DE CREACIÓN --- */}
      <View style={styles.formCard}>
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="¿Qué tienes pendiente hoy?"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={getLocation}
            style={[styles.locationBtn, coords && styles.locationBtnActive]}
          >
            <Ionicons
              name={coords ? "location" : "location-outline"}
              size={20}
              color={coords ? "white" : "#4B5563"}
            />
            <Text style={[styles.locationText, coords && { color: "white" }]}>
              {coords ? "Ubicación lista" : "Ubicación"}
            </Text>
          </Pressable>

          <Pressable onPress={create} disabled={saving} style={styles.addBtn}>
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.addBtnText}>Agregar</Text>
                <Ionicons name="add-circle" size={20} color="white" />
              </>
            )}
          </Pressable>
        </View>
      </View>

      {/* --- LISTA DE TAREAS --- */}
      <FlatList
        data={todos}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(i) => String(i.id)} // Aseguramos que sea string
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50, opacity: 0.5 }}>
            <Ionicons name="document-text-outline" size={50} color="gray" />
            <Text>No hay tareas pendientes</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.todoCard,
              item.completed && styles.todoCardCompleted,
            ]}
          >
            <View style={styles.todoContent}>
              <Pressable onPress={() => toggle(item)} style={styles.checkArea}>
                <Ionicons
                  name={item.completed ? "checkbox" : "square-outline"}
                  size={28}
                  color={item.completed ? "#10B981" : "#4F46E5"}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.todoTitle,
                      item.completed && styles.textCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {/* Verificamos que existan coordenadas antes de renderizar */}
                  {item.latitude && item.longitude && (
                    <Text style={styles.coordsText}>
                      📍 {Number(item.latitude).toFixed(4)},{" "}
                      {Number(item.longitude).toFixed(4)}
                    </Text>
                  )}
                </View>
              </Pressable>
            </View>

            <Pressable onPress={() => remove(item)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  formCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
    marginBottom: 12,
    color: "#1F2937",
  },
  inputRow: { marginBottom: 10 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    gap: 5,
  },
  locationBtnActive: { backgroundColor: "#10B981" },
  locationText: { fontWeight: "600", color: "#4B5563" },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  addBtnText: { color: "white", fontWeight: "700" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
  errorText: { color: "#EF4444", fontWeight: "600" },

  // Todo Item Styles
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4F46E5",
  },
  todoCardCompleted: { borderLeftColor: "#10B981", opacity: 0.8 },
  todoContent: { flex: 1 },
  checkArea: { flexDirection: "row", alignItems: "center", gap: 12 },
  todoTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
  textCompleted: { textDecorationLine: "line-through", color: "#9CA3AF" },
  coordsText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  deleteBtn: { padding: 8 },
});
