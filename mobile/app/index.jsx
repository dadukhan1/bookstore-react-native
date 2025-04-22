import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from '../store/authStore.js';
import { useEffect } from "react";

export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore();

  console.log("User:", user);
  console.log("Token:", token);

  const logoutt = () => {
    logout();
  }

  useEffect(() => {
    checkAuth();
  }, [])

  return (
    <View
    >
      <Text>Welcome to the app! {user?.username}</Text>
      <TouchableOpacity onPress={logoutt}>
        <Text>
          Logout
        </Text>
      </TouchableOpacity>
      <Link href="/(auth)">Login</Link>
      <Link href="/(auth)/signup">Signup</Link>
      <Text>Let him cock</Text>
    </View>
  );
}
