import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function DeliveriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Deliveries placeholder</Text>
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
