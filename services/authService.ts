import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

// Register New User
export const registerUser = async (email: string, password: string, name?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔥 Save user details into Firestore
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

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error: any) {
    console.error("Logout Error:", error.message);
    throw error;
  }
};
