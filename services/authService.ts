import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  FacebookAuthProvider, 
  signInWithCredential, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Helper function to map Firebase errors
const mapAuthError = (error: any): string => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email format.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
};

// 📌 Register Email/Password
export const registerUser = async (email: string, password: string, name?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name || "",
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (error: any) {
    throw new Error(mapAuthError(error));
  }
};

// 📌 Login Email/Password
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // update Firestore login timestamp
    await setDoc(
      doc(db, "users", user.uid),
      { lastLogin: serverTimestamp() },
      { merge: true }
    );

    return user;
  } catch (error: any) {
    throw new Error(mapAuthError(error));
  }
};

// 📌 Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    throw new Error(mapAuthError(error));
  }
};

// 📌 Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error: any) {
    throw new Error("Logout failed. Please try again.");
  }
};

// 📌 Facebook Login
export const signInWithFacebookToken = async (accessToken: string) => {
  try {
    const credential = FacebookAuthProvider.credential(accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // get high-res profile photo
    const fbUid = user.providerData.find(p => p.providerId === "facebook.com")?.uid;
    const finalPhotoURL = fbUid
      ? `https://graph.facebook.com/${fbUid}/picture?width=200&height=200`
      : null;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        photoURL: finalPhotoURL,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  } catch (error: any) {
    throw new Error("Facebook login failed. Please try again.");
  }
};

// 📌 Save Profile Picture Locally
export const saveProfilePic = async (uid: string, uri: string) => {
  try {
    const folder = `${FileSystem.documentDirectory}profilePics/`;
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

    const newPath = `${folder}${uid}.jpg`;

    // delete old file if exists
    const fileInfo = await FileSystem.getInfoAsync(newPath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(newPath, { idempotent: true });
    }

    await FileSystem.copyAsync({ from: uri, to: newPath });
    await AsyncStorage.setItem("profilePic", newPath);

    return newPath;
  } catch (error) {
    throw new Error("Failed to save profile picture.");
  }
};

// 📌 Update Profile
export const updateUserProfile = async (
  uid: string,
  updates: { name?: string; language?: string }
) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error: any) {
    throw new Error("Failed to update profile.");
  }
};
