import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "@/app/localization";

const tabs = [
  { name: "home", icon: "home-filled", labelKey: "tabHome" },
  { name: "mood", icon: "mood", labelKey: "tabTask" },
  { name: "profile", icon: "person", labelKey: "tabProfile" }, // journal -> profile
  { name: "settings", icon: "settings", labelKey: "tabSettings" }, // profile -> settings
] as const;

export default function DashboardLayout() {
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
        tabBarActiveTintColor: "#6366F1", // Indigo-500
        tabBarInactiveTintColor: "#9CA3AF", // Gray-400
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 30,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: "#ffffff",
          // iOS shadow
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          // Android shadow
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      {tabs.map(({ name, icon, labelKey }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: strings[lang][labelKey],
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={icon} size={24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
