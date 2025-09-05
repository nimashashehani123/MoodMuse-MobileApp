import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  FacebookAuthProvider, 
  signInWithCredential 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

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
