const API_BASE = "http://localhost:3000/api/auth";
function showError(msg, isSuccess = false) {
  let err = document.getElementById("authError");
  if (!err) {
    err = document.createElement("p");
    err.id = "authError";
    err.style.cssText =
      "font-size:0.85rem; margin-top:0.5rem; font-family:'Montserrat',sans-serif;";
    document.querySelector(".btn-login").before(err);
  }
  err.style.color = isSuccess ? "#2f855a" : "#e53e3e";
  err.textContent = msg;
}
document.querySelector(".btn-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.querySelector(".btn-login");
  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }
  btn.textContent = "Signing in...";
  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed.");
    }
    window.location.href = "../index.html";
  } catch (e) {
    btn.textContent = "Sign in";
    btn.disabled = false;
    showError(e.message);
  }
});
document.getElementById("password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.querySelector(".btn-login").click();
});
document.querySelector(".forgot").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) {
    showError("Enter your email above first, then click Forgot password.");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong.");
    showError("✅ " + data.message, true);
  } catch (e) {
    showError(e.message);
  }
});