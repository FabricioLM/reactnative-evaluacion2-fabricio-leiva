import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="home-outline" size={80} color="#4F46E5" />
      </View>

      <Text style={styles.title}>¡Hola! 👋</Text>
      <Text style={styles.subtitle}>Sesión iniciada correctamente</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Evaluación 3</Text>
        <Text style={styles.text}>
          Esta aplicación gestiona tus tareas conectadas al Backend y utiliza
          Geolocalización.
        </Text>
        <View style={styles.tipBox}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#4F46E5"
          />
          <Text style={styles.tipText}>
            Ve a la pestaña "Mis Tareas" para comenzar.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  tipBox: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
  },
  tipText: {
    color: "#4338CA",
    flex: 1,
    fontWeight: "500",
  },
});
