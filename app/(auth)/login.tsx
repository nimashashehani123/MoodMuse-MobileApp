import { 
  ActivityIndicator, Alert, Pressable, Text, TextInput, TouchableOpacity, View, 
  KeyboardAvoidingView, Platform, ScrollView, Animated, Easing, Dimensions
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { forgotPassword, loginUser, signInWithFacebookToken } from "@/services/authService";
import { Mail, Lock, Eye, EyeOff, Facebook, Heart, Sparkles } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../localization";
import * as FacebookAuth from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState<"en" | "si">("en");
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const bgPan = useRef(new Animated.Value(0)).current;
  const buttonCurve = useRef(new Animated.Value(0)).current;

  // Facebook Auth hook
  const [request, response, promptAsync] = FacebookAuth.useAuthRequest({
    clientId: "2622206424823409", 
    scopes: ["public_profile", "email"],
  });

  // Inside your component
const handleForgotPassword = async () => {
  if (!email.trim()) {
    Alert.alert("Enter Email", "Please enter your email to reset password");
    return;
  }

  setLoading(true);
  try {
    await forgotPassword(email);
    Alert.alert(
      "Password Reset Email Sent",
      `Check ${email} for password reset instructions.`
    );
  } catch (err: any) {
    Alert.alert("Error", err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang === "si") setLang("si");
    };
    loadLanguage();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.03,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.timing(bgPan, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  // Handle Facebook login response
  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      const loginFacebook = async () => {
        setLoading(true);
        try {
          const accessToken = response?.authentication?.accessToken;
          if (accessToken) {
            await signInWithFacebookToken(accessToken);
          }
          if (Platform.OS === "web") {
            router.replace("/admin");
          } else {
            router.replace("/home"); // mobile users home page
          }
        } catch (err: any) {
          Alert.alert("Facebook Login Failed", err.message);
        } finally {
          setLoading(false);
        }
      };
      loginFacebook();
    }
  }, [response]);

  // Email/Password login
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    
    // Animate button curve on press
    Animated.sequence([
      Animated.timing(buttonCurve, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonCurve, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      await loginUser(email, password);
      if (Platform.OS === "web") {
        router.replace("/admin");
      } else {
        router.replace("/home"); // mobile users home page
      }
    } catch (err: any) {
      Alert.alert(strings[lang].login + " Failed", "Invalid email or password");
    } finally {
      setLoading(false); 
    }
  };

  // Button press animation
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

  const interpolatedBg = bgPan.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolation for button curve animation
  const buttonCurveInterpolation = buttonCurve.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -15, 0]
  });

return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Light Theme Background */}
      <Animated.View 
        style={{
          position: 'absolute',
          width: 390 * 1.2,
          height: 844 * 1.2,
          transform: [{ rotate: interpolatedBg }],
          top: -100,
          left: -50,
        }}
      >
        <LinearGradient
          colors={["#E0E7FF", "#F3E8FF", "#FEF3C7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, opacity: 0.4 }}
        />
      </Animated.View>

      {/* Light decorative elements */}
      <Animated.View 
        style={{
          position: 'absolute',
          top: 80,
          right: 30,
          opacity: 0.1,
          transform: [{ scale: logoScale }]
        }}
      >
        <View style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 20,
          backgroundColor: '#6366F1',
        }} />
      </Animated.View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}
        >
          {/* Compact Full Screen Design */}
          <View style={{
            width: 342,
            alignSelf: 'center',
          }}>
            
            {/* Compact Logo Section */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <Animated.View 
                style={{ transform: [{ scale: logoScale }] }}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                    shadowColor: '#6366F1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                  }}
                >
                  <Heart size={36} color="white" fill="white" />
                </LinearGradient>
              </Animated.View>
              
              <Text style={{
                fontSize: 32,
                fontWeight: '800',
                color: '#1F2937',
                marginBottom: 6,
                letterSpacing: -0.5,
                textAlign: 'center',
              }}>
                MoodMuse
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#6B7280',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                {strings[lang].welcomeBack}
              </Text>
            </View>

            {/* Compact Input Fields */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 8,
                marginLeft: 4,
              }}>
                {strings[lang].emailPlaceholder}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
              }}>
                <View style={{
                  backgroundColor: '#6366F1',
                  padding: 6,
                  borderRadius: 8,
                  marginRight: 10,
                }}>
                  <Mail color="white" size={16} />
                </View>
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#1F2937',
                    fontWeight: '500',
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 8,
                marginLeft: 4,
              }}>
                {strings[lang].passwordPlaceholder}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
              }}>
                <View style={{
                  backgroundColor: '#6366F1',
                  padding: 6,
                  borderRadius: 8,
                  marginRight: 10,
                }}>
                  <Lock color="white" size={16} />
                </View>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#1F2937',
                    fontWeight: '500',
                  }}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    backgroundColor: '#F3F4F6',
                    padding: 6,
                    borderRadius: 8,
                    marginLeft: 6,
                  }}
                >
                  {showPassword ? (
                    <EyeOff color="#6B7280" size={16} />
                  ) : (
                    <Eye color="#6B7280" size={16} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

           <Pressable 
  onPress={handleForgotPassword} 
  style={{ alignSelf: 'flex-end', marginBottom: 24 }}
>
  <Text style={{
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  }}>
    {strings[lang].forgotPassword}?
  </Text>
</Pressable>


            {/* Compact Login Button */}
            <Animated.View style={{ 
              transform: [
                { scale: buttonScale },
                { translateY: buttonCurveInterpolation }
              ],
              marginBottom: 20,
            }}>
              <TouchableOpacity 
                activeOpacity={0.9} 
                onPressIn={animateButtonPress}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 16,
                    shadowColor: '#6366F1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={{
                      color: 'white',
                      fontSize: 17,
                      fontWeight: '700',
                      textAlign: 'center',
                      letterSpacing: 0.5,
                    }}>
                      {strings[lang].login}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Compact Divider */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 18,
            }}>
              <View style={{ 
                flex: 1, 
                height: 1, 
                backgroundColor: '#E5E7EB' 
              }} />
              <Text style={{
                marginHorizontal: 12,
                color: '#9CA3AF',
                fontSize: 14,
                fontWeight: '500',
              }}>
                or continue with
              </Text>
              <View style={{ 
                flex: 1, 
                height: 1, 
                backgroundColor: '#E5E7EB' 
              }} />
            </View>

            {/* Facebook Button */}
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPressIn={animateButtonPress}
              onPress={() => promptAsync()}
              disabled={loading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1877F2',
                borderRadius: 16,
                paddingVertical: 14,
                shadowColor: '#1877F2',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Facebook color="#fff" size={18} />
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Continue with Facebook
              </Text>
            </TouchableOpacity>

            {/* Sign up link */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#F3F4F6',
            }}>
              <Text style={{
                color: '#6B7280',
                fontSize: 15,
                fontWeight: '500',
              }}>
                {strings[lang].dontHaveAccount} 
              </Text>
              <Pressable 
                onPress={() => router.push("/register")}
                style={{ marginLeft: 4 }}
              >
                <Text style={{
                  color: '#6366F1',
                  fontSize: 15,
                  fontWeight: '700',
                }}>
                  {strings[lang].register}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default Login;