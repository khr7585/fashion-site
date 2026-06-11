import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔧 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAv5wV8B3oW_yBtaOjCUbb83QWGQFPDXAE",
  authDomain: "fashion-site-c7a4d.firebaseapp.com",
  projectId: "fashion-site-c7a4d",
  storageBucket: "fashion-site-c7a4d.firebasestorage.app",
  messagingSenderId: "862721379399",
  appId: "1:862721379399:web:3ec81f51565e1cc6197562",
  measurementId: "G-QZBJX9YVYB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── If already logged in, skip login page ──────────────
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     window.location.href = "../index.html"; // redirect to home
//   }
// });

// ── Show error helper ──────────────────────────────────
function showError(msg) {
  let err = document.getElementById("authError");
  if (!err) {
    err = document.createElement("p");
    err.id = "authError";
    err.style.cssText =
      "color:#e53e3e; font-size:0.85rem; margin-top:0.5rem; font-family:'Montserrat',sans-serif;";
    document.querySelector(".btn-login").before(err);
  }
  err.textContent = msg;
}

// ── Sign In ────────────────────────────────────────────
document.querySelector(".btn-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.querySelector(".btn-login");

  // Basic validation
  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }

  // Loading state
  btn.textContent = "Signing in...";
  btn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "../index.html"; // ✅ redirect after login
  } catch (e) {
    btn.textContent = "Sign in";
    btn.disabled = false;
    showError(friendlyError(e.code));
  }
});

// ── Enter key support ──────────────────────────────────
document.getElementById("password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.querySelector(".btn-login").click();
});

// ── Friendly error messages ────────────────────────────
function friendlyError(code) {
  const map = {
    "auth/invalid-email": "Invalid email address.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

// ── Forgot Password ────────────────────────────────────
// import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.querySelector(".forgot").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) {
    showError("Enter your email above first, then click Forgot password.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showError("✅ Reset email sent! Check your inbox.");
  } catch (e) {
    showError(friendlyError(e.code));
  }
});
