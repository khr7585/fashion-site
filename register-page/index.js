import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// ── If already logged in, skip register page ──────────
// onAuthStateChanged(auth, (user) => {
//   if (user) window.location.href = "../index.html";
// });

// ── Password strength checker ─────────────────────────
// Must be on window so inline oninput="checkStrength(...)" can reach it
window.checkStrength = function (val) {
  let bar = document.getElementById("strengthBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "strengthBar";
    bar.style.cssText =
      "height:3px; border-radius:2px; margin-top:6px; transition:all 0.3s;";
    document.getElementById("password").after(bar);
  }

  if (val.length === 0) {
    bar.style.width = "0%";
    return;
  }

  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { width: "20%", color: "#e53e3e" },
    { width: "40%", color: "#e53e3e" },
    { width: "60%", color: "#d69e2e" },
    { width: "80%", color: "#38a169" },
    { width: "100%", color: "#2f855a" },
  ];
  bar.style.width = levels[score - 1]?.width || "20%";
  bar.style.background = levels[score - 1]?.color || "#e53e3e";
};

// ── Error/success message helper ──────────────────────
function showMessage(msg, isSuccess = false) {
  let el = document.getElementById("authMsg");
  if (!el) {
    el = document.createElement("p");
    el.id = "authMsg";
    el.style.cssText =
      "font-size:0.85rem; margin-top:0.5rem; font-family:'Montserrat',sans-serif;";
    document.querySelector(".btn-login").before(el);
  }
  el.style.color = isSuccess ? "#2f855a" : "#e53e3e";
  el.textContent = msg;
}

// ── Friendly Firebase error messages ──────────────────
function friendlyError(code) {
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Invalid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

// ── type="module" is already deferred — DOM is ready here ──
const btn = document.querySelector(".btn-login");

btn.addEventListener("click", async () => {
  const name = document.getElementById("fname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!name) {
    showMessage("Please enter your name.");
    return;
  }
  if (!email) {
    showMessage("Please enter your email.");
    return;
  }
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }
  if (password !== confirm) {
    showMessage("Passwords don't match.");
    return;
  }

  btn.textContent = "Creating account...";
  btn.disabled = true;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    showMessage(`Welcome, ${name}! Redirecting...`, true);

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  } catch (e) {
    btn.textContent = "CREATE ACCOUNT";
    btn.disabled = false;
    showMessage(friendlyError(e.code));
  }
});

// ── Enter on confirm field triggers submit ─────────────
document.getElementById("confirm").addEventListener("keydown", (e) => {
  if (e.key === "Enter") btn.click();
});
