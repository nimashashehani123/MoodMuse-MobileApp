import { Text, View, Button } from "react-native";
import { registerUser, loginUser, logoutUser } from "../services/authService";

export default function Index() {
  const handleRegister = async () => {
    try {
      const user = await registerUser("nimashashehani0715@gmail.com", "Nimasha@123");
      console.log("Registered:", user.email);
    } catch (e) {}
  };

  const handleLogin = async () => {
    try {
      const user = await loginUser("nimashashehani0715@gmail.com", "Nimasha@123");
      console.log("Logged in:", user.email);
    } catch (e) {}
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold">🔥 Firebase Auth Test</Text>
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
