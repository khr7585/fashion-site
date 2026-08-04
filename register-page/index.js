// const API_BASE = "https://fashion-site-0onq.onrender.com";
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fashion-site-0onq.onrender.com";
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
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Signup failed.");
    }
    showMessage(
      `Welcome, ${name}! Check your email to verify your account. Redirecting...`,
      true
    );
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (e) {
    btn.textContent = "CREATE ACCOUNT";
    btn.disabled = false;
    showMessage(e.message);
  }
});
document.getElementById("confirm").addEventListener("keydown", (e) => {
  if (e.key === "Enter") btn.click();
});