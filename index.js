function goto_login() {
  window.location.href = "../login-page/index.html";
}
function goto_create() {
  window.location.href = "../register-page/index.html";
}

// //HOME-PAGE (dropdown button)
// const btn = document.querySelector('.more-btn');
// const drop = document.getElementById('dropdownmenu');
// btn.addEventListener('click', (e) => {
//   e.stopPropagation();
//   drop.classList.toggle('active');
// });
// document.addEventListener('click', () => {
//   drop.classList.remove('active');
// });



// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA6q899Sp9xOsuOf5A4r36AK_C_FrT1nIM",
  authDomain: "fir-tutorial-ade86.firebaseapp.com",
  projectId: "fir-tutorial-ade86",
  storageBucket: "fir-tutorial-ade86.firebasestorage.app",
  messagingSenderId: "68651479795",
  appId: "1:68651479795:web:7eba7d8752844ce205fd86",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// LOGIN
document.getElementById("loginBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login Successful ✅");
      console.log(userCredential.user);
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
});


// REGISTER
document.querySelector(".register-form").addEventListener("submit", function (e) {
  e.preventDefault(); // stop refresh

  // const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Check password match
  if (password !== confirmPassword) {
    alert("Passwords do not match ❌");
    return;
  }

  // Create user
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Account Created Successfully ✅");
      console.log(userCredential.user);

      // Optional: redirect to login page
      // window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
});




