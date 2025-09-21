import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  FacebookAuthProvider, 
  signInWithCredential, 
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db} from "../firebase";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Register Email/Password
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
    console.error("Register Error:", error.message);
    throw error;
  }
};


// Login Email/Password
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optional: update Firestore login timestamp
    await setDoc(
      doc(db, "users", user.uid),
      { lastLogin: serverTimestamp() },
      { merge: true }
    );

    return user;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err: any) {
    console.error("Forgot Password Error:", err.message);
    throw err;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error: any) {
    console.error("Logout Error:", error.message);
    throw error;
  }
};

export const signInWithFacebookToken = async (accessToken: string) => {
  try {
    const credential = FacebookAuthProvider.credential(accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Modify photoURL to get higher-res image
   const fbUid = user.providerData.find(p => p.providerId === "facebook.com")?.uid;

const finalPhotoURL = fbUid
  ? `https://graph.facebook.com/${fbUid}/picture?width=200&height=200`
  : null;


    // Save user to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        photoURL: finalPhotoURL,
        createdAt: serverTimestamp(),
      },
      { merge: true } // merge so existing users are not overwritten
    );

    return user;
  } catch (err: any) {
    console.error("Facebook Firebase SignIn Error:", err.message);
    throw err;
  }
};


export const saveProfilePic = async (uid: string, uri: string) => {
  try {
    // Folder path
    const folder = `${FileSystem.documentDirectory}profilePics/`;
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

    // New file path
    const newPath = `${folder}${uid}.jpg`;

    // 🔹 Old file check & delete
    const fileInfo = await FileSystem.getInfoAsync(newPath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(newPath, { idempotent: true });
    }

    // 🔹 Copy new file
    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    console.log("✅ Profile pic saved locally at:", newPath);

    // 🔹 Save path to AsyncStorage
    await AsyncStorage.setItem("profilePic", newPath);

    return newPath;
  } catch (err) {
    console.error("❌ Save Profile Pic Error:", err);
    throw err;
  }
};

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
  } catch (err: any) {
    console.error("Update Profile Error:", err.message);
    throw err;
  }
};

