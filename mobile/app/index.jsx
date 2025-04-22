import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from '../store/authStore.js';
import { useEffect } from "react";

export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore();

  console.log("User:", user);
  console.log("Token:", token);

  useEffect(() => {
    checkAuth();
  }, [])

  return (
    <View
    >
      <Text>Welcome to the app! {user?.username}{token}</Text>
      <Link href="/(auth)">Login</Link>
      <Link href="/(auth)/signup">Signup</Link>
      <Text>Let him cock</Text>
    </View>
  );
}
