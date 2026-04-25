// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6q899Sp9xOsuOf5A4r36AK_C_FrT1nIM",
  authDomain: "fir-tutorial-ade86.firebaseapp.com",
  projectId: "fir-tutorial-ade86",
  storageBucket: "fir-tutorial-ade86.firebasestorage.app",
  messagingSenderId: "68651479795",
  appId: "1:68651479795:web:7eba7d8752844ce205fd86",
  measurementId: "G-YV1RHP3TRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);