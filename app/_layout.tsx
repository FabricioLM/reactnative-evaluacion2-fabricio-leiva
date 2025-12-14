import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function Guard() {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace(token ? "/(tabs)/home" : "/");
    }
  }, [token, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <Guard />
    </AuthProvider>
  );
}
