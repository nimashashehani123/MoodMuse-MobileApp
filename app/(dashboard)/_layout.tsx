import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur"; // luxury blur
import { strings } from "@/app/localization";

const tabs = [
  { name: "home", icon: "home-filled", labelKey: "tabHome" },
  { name: "mood", icon: "mood", labelKey: "tabTask" },
  { name: "profile", icon: "person", labelKey: "tabProfile" },
  { name: "settings", icon: "settings", labelKey: "tabSettings" },
] as const;

const DashboardLayout = () => {
  const [lang, setLang] = useState<"en" | "si">("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang === "si") setLang("si");
    };
    loadLanguage();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 75,
          borderRadius: 35,
          overflow: "hidden",
          borderCurve: "continuous",
          // iOS shadow
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 10,
          elevation: 10, // Android shadow
        },
        tabBarBackground: () => <BlurView intensity={60} tint="light" style={{ flex: 1 }} />,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
          marginTop: 8,
        },
      }}
    >
      {tabs.map(({ name, icon, labelKey }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: strings[lang][labelKey],
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={icon}
                size={focused ? 30 : 24}
                color={color}
                style={{ transform: [{ translateY: focused ? 3 : 7 }] }}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;
