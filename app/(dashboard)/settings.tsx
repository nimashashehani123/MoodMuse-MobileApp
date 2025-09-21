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
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { logoutUser, saveProfilePic } from "@/services/authService";
import { auth, db } from "@/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Settings = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [modalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState<string>(`
Welcome to our App!

1. You agree to use this app responsibly.
2. We respect your privacy and protect your data.
3. Tasks and moods are for personal use only.
4. The app may receive updates without prior notice.
5. By using this app, you agree to these terms.

Thank you!
`);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

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
        if (data.name) setUserName(data.name);
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
        const localPath = await saveProfilePic(uid, uri);
        setProfilePic(`${localPath}?t=${Date.now()}`);
        await setDoc(doc(db, "users", uid), { photoURL: localPath }, { merge: true });
      } catch (err: any) {
        Alert.alert("Upload Failed", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // 🔹 Lang
  const toggleLang = async () => {
    const newLang = lang === "en" ? "si" : "en";
    setLang(newLang);
    const uid = auth.currentUser?.uid;
    if (uid) {
      await setDoc(doc(db, "users", uid), { lang: newLang }, { merge: true });
    }
  };

  // 🔹 Dark Mode
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
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
        {profilePic ? (
          <Image
            source={{ uri: `${profilePic}?t=${Date.now()}` }}
            style={styles.profilePic}
          />
        ) : (
          <View style={[styles.profilePic, styles.profilePlaceholder]}>
            <Text style={{ fontSize: 32, color: theme.text }}>👤</Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.profileName, { color: theme.text }]}>
            {userName || "User"}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.subtext }]}>
            {auth.currentUser?.email}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={theme.text} />
        ) : (
          <Pressable onPress={changeProfilePic}>
            <Ionicons name="camera-outline" size={22} color={theme.primary} />
          </Pressable>
        )}
      </View>

      {/* Preferences Section */}
      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Preferences</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Pressable style={styles.row} onPress={toggleLang}>
          <Text style={[styles.rowText, { color: theme.text }]}>Language</Text>
          <Text style={{ color: theme.subtext }}>{lang === "en" ? "English" : "සිංහල"}</Text>
        </Pressable>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={[styles.rowText, { color: theme.text }]}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* App Section */}
      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>App</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Pressable style={styles.row} onPress={() => setModalVisible(true)}>
          <Text style={[styles.rowText, { color: theme.text }]}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
        </Pressable>
      </View>

      {/* Logout Section */}
      <View style={[styles.card, { backgroundColor: theme.card, marginTop: 30 }]}>
        <Pressable style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: darkMode ? "#1F2937" : "#fff",
              borderRadius: 20,
              maxHeight: "80%",
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 12,
                color: darkMode ? "#F9FAFB" : "#111827",
              }}
            >
              Terms & Conditions
            </Text>

            <ScrollView style={{ marginVertical: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: darkMode ? "#E5E7EB" : "#333",
                }}
              >
                {terms}
              </Text>
            </ScrollView>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "#FF3B30",
                padding: 12,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Settings;

// Themes
const lightTheme = {
  background: "#F3F4F6",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  primary: "#6366F1",
};

const darkTheme = {
  background: "#111827",
  card: "#1F2937",
  text: "#F9FAFB",
  subtext: "#9CA3AF",
  primary: "#8B5CF6",
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 80,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  profilePic: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  profilePlaceholder: {
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginHorizontal: 16,
  },
  logoutRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    marginLeft: 8,
  },
});
