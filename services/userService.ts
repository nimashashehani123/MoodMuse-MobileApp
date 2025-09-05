// services/userService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export interface UserProfile {
  displayName: string;
  email: string;
  [key: string]: any; // optional other fields
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
};
