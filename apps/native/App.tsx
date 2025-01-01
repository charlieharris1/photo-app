import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import { View, Text } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function Native() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  );
}

// import { StyleSheet, Text, View } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { Button } from "@repo/ui";
// import { useEffect, useState } from "react";

// interface User {
//   userId: string;
// }

// export default function Native() {
//   const [isLoading, setLoading] = useState(true);
//   const [data, setData] = useState<User>();

//   const getUser = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.EXPO_PUBLIC_API_URL}/user/123`
//       );
//       const json = await response.json();
//       setData(json);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Native</Text>
//       {isLoading ? (
//         <Text>Loading...</Text>
//       ) : (
//         <Text>User ID: {data?.userId}</Text>
//       )}
//       <Button
//         onClick={() => {
//           console.log("Pressed!");
//           alert("Pressed!");
//         }}
//         text="Boop"
//       />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     fontWeight: "bold",
//     marginBottom: 20,
//     fontSize: 36,
//   },
// });
