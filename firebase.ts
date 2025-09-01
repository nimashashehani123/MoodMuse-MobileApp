import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBCNjHb7ER2oT0H6ZjXgW6xRdTWf5Dw8Rk",
  authDomain: "moodmuse-f66f0.firebaseapp.com",
  projectId: "moodmuse-f66f0",
  storageBucket: "moodmuse-f66f0.firebasestorage.app",
  messagingSenderId: "534378572651",
  appId: "1:534378572651:web:1ee9df24e11efd5badfa2e",
  measurementId: "G-F20QTN7WZJ"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
console.log("Firebase Connected!");