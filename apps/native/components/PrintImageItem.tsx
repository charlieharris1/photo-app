import { FileObject } from "@supabase/storage-js";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../config/initSupabase";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../provider/AuthProvider";

// Image item component that displays the image from Supabase Storage and a delte button
const PrintImageItem = ({
  item,
  userId,
  onRemoveImage,
}: {
  item: FileObject;
  userId: string;
  onRemoveImage: () => void;
}) => {
  const { session } = useAuth();
  const [image, setImage] = useState<string>("");
  const [printed, setPrinted] = useState<boolean>(false);

  const onPrint = async () => {
    // Make a request to the server with the access token and image ID.
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/print?imageId=${item.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    if (response.ok) {
      setPrinted(true);
    }
  };

  supabase.storage
    .from("files")
    .download(`${userId}/${item.name}`)
    .then(({ data }) => {
      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImage(fr.result as string);
      };
    });

  return (
    <View
      style={{ flexDirection: "row", margin: 1, alignItems: "center", gap: 5 }}
    >
      {image ? (
        <Image style={{ width: 80, height: 80 }} source={{ uri: image }} />
      ) : (
        <View style={{ width: 80, height: 80, backgroundColor: "#1A1A1A" }} />
      )}
      <Text style={{ flex: 1, color: "#fff" }}>{item.name}</Text>
      {/* Delete image button */}
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={"#fff"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPrint}>
        <Ionicons
          name="print-outline"
          size={20}
          color={printed ? "#42f58d" : "#fff"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PrintImageItem;
