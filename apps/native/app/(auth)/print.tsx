import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../provider/AuthProvider";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../../config/initSupabase";
import { FileObject } from "@supabase/storage-js";
import PrintImageItem from "../../components/PrintImageItem";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result!.toString().split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

const print = () => {
  const { user, session } = useAuth();
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load user images
    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from("files").list(user!.id);
    if (data) {
      setFiles(data);
    }
  };

  const addFileToCurrentPrint = async (filePath: string) => {
    // TODO: Handle errors.
    await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/current-print-batch/files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({
          files: [{ filePath }],
        }),
      }
    );
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Save image if not cancelled
    if (!result.canceled) {
      const img = result.assets[0];

      let base64;
      if (Platform.OS === "web") {
        // Web-specific handling
        const response = await fetch(img.uri);
        const blob = await response.blob();
        base64 = await blobToBase64(blob);
      } else {
        // Mobile-specific handling
        base64 = await FileSystem.readAsStringAsync(img.uri, {
          encoding: "base64",
        });
      }

      // TODO: No point handling videos here. May also need to support things other than pngs?
      const filePath = `${user!.id}/${new Date().getTime()}.${img.type === "image" ? "png" : "mp4"}`;
      const contentType = img.type === "image" ? "image/png" : "video/mp4";
      await supabase.storage
        .from("files")
        .upload(filePath, decode(base64), { contentType });

      await addFileToCurrentPrint(filePath);
      loadImages();
    }
  };

  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    supabase.storage.from("files").remove([`${user!.id}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  const onPrint = async () => {
    console.log("Print");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.photosContainer}>
        {files.map((item, index) => (
          <PrintImageItem
            key={item.id}
            item={item}
            userId={user!.id}
            onRemoveImage={() => onRemoveImage(item, index)}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onSelectImage} style={styles.button}>
            <Ionicons name="camera-outline" size={30} color={"#fff"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPrint} style={styles.button}>
            <Ionicons name="print-outline" size={30} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
  },
  photosContainer: {
    padding: 20,
  },
  buttonsContainer: {
    flex: 1,
    bottom: 40,
    position: "absolute",
    width: "100%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    columnGap: 20,
  },
  button: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    backgroundColor: "#2b825b",
    borderRadius: 100,
  },
});

export default print;
