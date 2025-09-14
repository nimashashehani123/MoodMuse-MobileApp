import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { logoutUser, uploadProfilePic } from "@/services/authService";
import TermsModal from "@/components/TermsModal";
import { auth } from "@/firebase";


const Settings = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [modalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const savedLang = await AsyncStorage.getItem("appLanguage");
    if (savedLang) setLang(savedLang as "en" | "si");

    const savedPic = await AsyncStorage.getItem("profilePic");
    if (savedPic) setProfilePic(savedPic);
  };

// Pick + Upload Profile Photo
const changeProfilePic = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const uid = auth.currentUser?.uid; // <-- Firebase logged-in user id

    if (!uid) {
      Alert.alert("Error", "No logged-in user found");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrl = await uploadProfilePic(uid, uri); // ✅ Pass both args
      setProfilePic(uploadedUrl);

      await AsyncStorage.setItem("profilePic", uploadedUrl);
    } catch (err: any) {
      Alert.alert("Upload Failed", err.message);
    } finally {
      setLoading(false);
    }
  }
};


  // Language Switch
  const toggleLang = async () => {
    const newLang = lang === "en" ? "si" : "en";
    setLang(newLang);
    await AsyncStorage.setItem("appLanguage", newLang);
    // reload app texts using i18n
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <View style={styles.section}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <View style={[styles.profilePic, styles.profilePlaceholder]}>
            <Text style={{ fontSize: 32, color: "#666" }}>👤</Text>
          </View>
        )}
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Pressable style={styles.button} onPress={changeProfilePic}>
            <Text style={styles.buttonText}>Change Photo</Text>
          </Pressable>
        )}
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.label}>Language</Text>
        <Pressable style={styles.button} onPress={toggleLang}>
          <Text style={styles.buttonText}>
            {lang === "en" ? "Switch to Sinhala" : "Switch to English"}
          </Text>
        </Pressable>
      </View>

      {/* Terms */}
      <View style={styles.section}>
        <Text style={styles.label}>App Info</Text>
      <TermsModal />
      </View>

      {/* Dark Mode */}
      <View style={styles.sectionRow}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <Pressable
          style={[styles.button, { backgroundColor: "#DC2626" }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>

      {/* Terms Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <ScrollView style={{ marginTop: 10 }}>
            <Text style={styles.text}>{terms || "Loading..."}</Text>
          </ScrollView>
          <Pressable
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  section: {
    alignItems: "center",
    marginBottom: 30,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  profilePlaceholder: {
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
  },
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#374151",
  },
});
