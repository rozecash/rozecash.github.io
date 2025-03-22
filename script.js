// Firebase configuration object (unchanged)
const firebaseConfig = {
  apiKey: "AIzaSyAmJNWl_5VFaUQwjzMjBKbX6ZoLxdr5mko",
  authDomain: "fakefreeflipdatabase.firebaseapp.com",
  projectId: "fakefreeflipdatabase",
  storageBucket: "fakefreeflipdatabase.firebasestorage.app",
  messagingSenderId: "127508082386",
  appId: "1:127508082386:web:883c2be8b481b3c6e5870b",
  measurementId: "G-RW520XL4R4"
};

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global variables
let user = null;
let balance = 0;

// Update balance display
function updateBalanceDisplay() {
  const balanceElement = document.getElementById("balance");
  if (balanceElement) {
    balanceElement.innerText = balance.toFixed(2);
  } else {
    console.error("Balance element not found");
  }
}

// Show notifications
function showNotification(message) {
  const notificationContainer = document.getElementById("notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = message;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 500); // Remove after fade-out
  }, 3000);
}

// Firebase authentication functions
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, username + "@fake.com", password)
    .then((userCredential) => {
      user = userCredential.user;
      showMainUI();
      saveUserData(username);
      showNotification("Registration successful!");
    })
    .catch((error) => {
      alert(error.message);
    });
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, username + "@fake.com", password)
    .then((userCredential) => {
      user = userCredential.user;
      showMainUI();
      showNotification("Login successful!");
    })
    .catch((error) => {
      alert(error.message);
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      user = null;
      showAuthUI();
      showNotification("Logged out successfully!");
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Update UI based on user authentication status
onAuthStateChanged(auth, (userCredential) => {
  if (userCredential) {
    user = userCredential.user;
    showMainUI();
  } else {
    showAuthUI();
  }
});

function showMainUI() {
  const authContainer = document.getElementById("auth-container");
  const profileContainer = document.getElementById("profile-container");

  authContainer.style.display = "none";
  profileContainer.style.display = "block";

  document.getElementById("username-display").innerText = user.displayName || "User";
  loadUserProfile();
}

function showAuthUI() {
  const authContainer = document.getElementById("auth-container");
  const profileContainer = document.getElementById("profile-container");

  authContainer.style.display = "block";
  profileContainer.style.display = "none";
}

// Save user data to Firestore
function saveUserData(username) {
  setDoc(doc(db, "users", user.uid), {
    username: username,
    balance: 0,
    profilePicture: null,
  })
    .then(() => {
      updateBalanceDisplay();
    })
    .catch((error) => {
      alert("Error saving user data: " + error.message);
    });
}

// Load user profile data
function loadUserProfile() {
  const userRef = doc(db, "users", user.uid);
  getDoc(userRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        balance = data.balance;
        updateBalanceDisplay();
      }
    })
    .catch((error) => {
      alert("Error loading user profile: " + error.message);
    });
}

// Handle game actions
function claimReward() {
  balance += 10;
  updateBalanceDisplay();
  showNotification("You claimed 10 coins!");
}

// Event listeners for buttons
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("register-btn").addEventListener("click", register);
document.getElementById("logout-btn").addEventListener("click", logout);

// Update balance display on page load
updateBalanceDisplay();
