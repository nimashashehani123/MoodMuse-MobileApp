import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Mail, Lock, User as UserIcon, EyeOff, Eye } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser } from "@/services/authService";
import { strings } from "../localization";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "si">("en");
  const [showPassword, setShowPassword] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang === "si") setLang("si");
    };
    loadLanguage();

    // Slide & fade in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRegister = async () => {
    if (loading) return;
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    setLoading(true);
    await registerUser(email, password, name)
      .then(() => router.replace("/login"))
      .catch((err) => {
        console.error(err);
        Alert.alert(strings[lang].register + " Failed", "Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={["#A5F3FC", "#C4B5FD", "#FBCFE8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
              backgroundColor: "white",
              borderRadius: 24,
              padding: 24,
              width: "90%",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
              marginBottom: 40,
            }}
          >
            {/* Logo */}
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <LinearGradient
                colors={["#6366F1", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                  shadowColor: "#6366F1",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                }}
              >
                <UserIcon size={36} color="white" />
              </LinearGradient>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#1F2937",
                  marginBottom: 6,
                  letterSpacing: -0.5,
                  textAlign: "center",
                }}
              >
                MoodMuse
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                {strings[lang].registerAccount}
              </Text>
            </View>

            {/* Name */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                {strings[lang].namePlaceholder || "Full Name"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                }}
              >
                <View style={{ backgroundColor: "#6366F1", padding: 6, borderRadius: 8, marginRight: 10 }}>
                  <UserIcon color="white" size={16} />
                </View>
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  style={{ flex: 1, fontSize: 16, color: "#1F2937", fontWeight: "500" }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                {strings[lang].emailPlaceholder}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                }}
              >
                <View style={{ backgroundColor: "#6366F1", padding: 6, borderRadius: 8, marginRight: 10 }}>
                  <Mail color="white" size={16} />
                </View>
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  style={{ flex: 1, fontSize: 16, color: "#1F2937", fontWeight: "500" }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
                {strings[lang].passwordPlaceholder}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                }}
              >
                <View style={{ backgroundColor: "#6366F1", padding: 6, borderRadius: 8, marginRight: 10 }}>
                  <Lock color="white" size={16} />
                </View>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={{ flex: 1, fontSize: 16, color: "#1F2937", fontWeight: "500" }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ backgroundColor: "#F3F4F6", padding: 6, borderRadius: 8, marginLeft: 6 }}
                >
                  {showPassword ? (
                    <EyeOff color="#6B7280" size={16} />
                  ) : (
                    <Eye color="#6B7280" size={16} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }], marginBottom: 20 }}>
              <TouchableOpacity activeOpacity={0.9} onPressIn={animateButtonPress} onPress={handleRegister} disabled={loading}>
                <LinearGradient
                  colors={["#6366F1", "#8B5CF6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 16,
                    shadowColor: "#6366F1",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={{ color: "white", fontSize: 17, fontWeight: "700", textAlign: "center" }}>
                      {strings[lang].register}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login link */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: "#F3F4F6",
              }}
            >
              <Text style={{ color: "#6B7280", fontSize: 15, fontWeight: "500" }}>
                {strings[lang].alreadyHaveAccount}{" "}
              </Text>
              <Pressable onPress={() => router.push("/login")} style={{ marginLeft: 4 }}>
                <Text style={{ color: "#6366F1", fontSize: 15, fontWeight: "700" }}>
                  {strings[lang].login}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Register;
