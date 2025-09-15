// Settings.tsx
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
import { useRouter } from "expo-router";
import { logoutUser, saveProfilePic } from "@/services/authService";
import { auth, db } from "@/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const Settings = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [modalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState<string>("App Terms go here...");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  // 🔹 Subscribe realtime user data
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.photoURL) setProfilePic(data.photoURL);
        if (data.lang) setLang(data.lang);
        if (data.darkMode !== undefined) setDarkMode(data.darkMode);
      }
    });

    return () => unsub();
  }, []);

  // 🔹 Pick + Save Profile Photo
  const changeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const uid = auth.currentUser?.uid;

      if (!uid) {
        Alert.alert("Error", "No logged-in user found");
        return;
      }

      setLoading(true);
      try {
        // save locally
        const localPath = await saveProfilePic(uid, uri);

        // 👉 Immediately update state with cache-busting
        setProfilePic(`${localPath}?t=${Date.now()}`);

        // 🔹 Firestore update
        await setDoc(
          doc(db, "users", uid),
          { photoURL: localPath },
          { merge: true }
        );
      } catch (err: any) {
        Alert.alert("Upload Failed", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // 🔹 Language Switch
  const toggleLang = async () => {
    const newLang = lang === "en" ? "si" : "en";
    setLang(newLang);

    const uid = auth.currentUser?.uid;
    if (uid) {
      await setDoc(doc(db, "users", uid), { lang: newLang }, { merge: true });
    }
  };

  // 🔹 Dark Mode Switch
  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);

    const uid = auth.currentUser?.uid;
    if (uid) {
      await setDoc(doc(db, "users", uid), { darkMode: value }, { merge: true });
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Profile Picture */}
      <View style={styles.section}>
        {profilePic ? (
          <Image
            source={{ uri: `${profilePic}?t=${Date.now()}` }} // 👈 cache-busting
            style={styles.profilePic}
          />
        ) : (
          <View style={[styles.profilePic, styles.profilePlaceholder]}>
            <Text style={{ fontSize: 32, color: theme.text }}>👤</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="small" color={theme.text} />
        ) : (
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={changeProfilePic}
          >
            <Text style={styles.buttonText}>Change Photo</Text>
          </Pressable>
        )}
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Language</Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={toggleLang}
        >
          <Text style={styles.buttonText}>
            {lang === "en" ? "Switch to Sinhala" : "Switch to English"}
          </Text>
        </Pressable>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>App Info</Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>View Terms</Text>
        </Pressable>
      </View>

      {/* Dark Mode */}
      <View style={styles.sectionRow}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
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
            <Text style={styles.text}>{terms}</Text>
          </ScrollView>
          <Pressable
            style={[styles.button, { marginTop: 20, backgroundColor: "#6366F1" }]}
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

// Themes
const lightTheme = {
  background: "#F9FAFB",
  text: "#111827",
  primary: "#6366F1",
};

const darkTheme = {
  background: "#1F2937",
  text: "#F9FAFB",
  primary: "#8B5CF6",
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
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
