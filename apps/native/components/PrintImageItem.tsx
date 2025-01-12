import { FileObject } from "@supabase/storage-js";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../config/initSupabase";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../provider/AuthProvider";

// Image item component that displays the image from Supabase Storage and a delte button
const PrintImageItem = ({
  filePath,
  onRemoveImage,
}: {
  filePath: string;
  userId: string;
  onRemoveImage: () => void;
}) => {
  const [image, setImage] = useState<string>("");

  supabase.storage
    .from("files")
    .download(filePath)
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
      {/* Delete image button */}
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
};

export default PrintImageItem;
