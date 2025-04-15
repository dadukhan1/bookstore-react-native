import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
    >
      <Link href="/(auth)">Login</Link>
      <Link href="/(auth)/signup">Signup</Link>
      <Text>Let him cock</Text>
    </View>
  );
}
