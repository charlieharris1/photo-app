import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../provider/AuthProvider";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={30} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#151515",
  },
  text: {
    color: "#fff",
  },
});
