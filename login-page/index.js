// Subtle pan animation on left bg after load
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("pageBg").classList.add("loaded");
  }, 100);
});

// Basic login handler — wire up to your backend
function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    shake(document.querySelector(".form-wrap"));
    return;
  }

  // Replace with your actual auth logic / API call
  console.log("Login attempt:", email);
}

// Shake animation on validation fail
function shake(el) {
  el.style.transition = "transform 0.07s ease";
  const steps = [6, -6, 4, -4, 2, -2, 0];
  let i = 0;
  const interval = setInterval(() => {
    el.style.transform = `translateX(${steps[i]}px)`;
    i++;
    if (i >= steps.length) {
      clearInterval(interval);
      el.style.transform = "";
    }
  }, 55);
}

// Enter key submits
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});
