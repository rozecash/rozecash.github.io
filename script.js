// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAmJNWl_5VFaUQwjzMjBKbX6ZoLxdr5mko",
  authDomain: "fakefreeflipdatabase.firebaseapp.com",
  projectId: "fakefreeflipdatabase",
  storageBucket: "fakefreeflipdatabase.appspot.com",
  messagingSenderId: "127508082386",
  appId: "1:127508082386:web:883c2be8b481b3c6e5870b",
  measurementId: "G-RW520XL4R4"
};

// Import Firebase App and Firebase SDK services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global variables
let user = null;
let balance = 0;

// Show notification
function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Update balance display
function updateBalanceDisplay() {
  const balanceElement = document.getElementById("balance");
  if (balanceElement) {
    balanceElement.innerText = balance.toFixed(2);
  } else {
    console.error("Balance element not found");
  }
}

// Update UI after login
function showMainUI() {
  const authBox = document.getElementById("authBox");
  const profileContainer = document.getElementById("profile-container");
  const usernameDisplay = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");

  if (authBox && profileContainer && usernameDisplay && logoutBtn) {
    authBox.style.display = "none"; // Hide login tab
    profileContainer.style.display = "block"; // Show profile
    usernameDisplay.innerText = user.displayName || "User"; // Update username
    logoutBtn.style.display = "block"; // Show logout button
  }

  // Load user profile only if user is authenticated
  if (user) {
    loadUserProfile();
  }
}

// Update UI after logout
function showAuthUI() {
  const authBox = document.getElementById("authBox");
  const profileContainer = document.getElementById("profile-container");
  const logoutBtn = document.getElementById("logoutBtn");

  if (authBox && profileContainer && logoutBtn) {
    authBox.style.display = "block"; // Show login tab
    profileContainer.style.display = "none"; // Hide profile
    logoutBtn.style.display = "none"; // Hide logout button
  }
}

// Firebase authentication functions
function register() {
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  createUserWithEmailAndPassword(auth, username + "@fake.com", password)
    .then((userCredential) => {
      user = userCredential.user;
      return updateProfile(user, { displayName: username });
    })
    .then(() => {
      showNotification("Registration successful!", "success");
      showMainUI();
      saveUserData(username);
    })
    .catch((error) => {
      showNotification(error.message, "error");
    });
}

function login() {
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  signInWithEmailAndPassword(auth, username + "@fake.com", password)
    .then((userCredential) => {
      user = userCredential.user;
      showNotification("Login successful!", "success");
      showMainUI();
    })
    .catch((error) => {
      showNotification(error.message, "error");
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      showNotification("Logged out successfully!", "success");
      showAuthUI();
    })
    .catch((error) => {
      showNotification(error.message, "error");
    });
}

// Update UI based on user authentication status
onAuthStateChanged(auth, (userCredential) => {
  if (userCredential) {
    user = userCredential.user;
    showMainUI();
  } else {
    user = null; // Reset user object
    showAuthUI();
  }
});

// Save user data to Firestore
function saveUserData(username) {
  if (!user) {
    showNotification("User not authenticated.", "error");
    return;
  }

  setDoc(doc(db, "users", user.uid), {
    username: username,
    balance: 0,
    profilePicture: null,
  })
    .then(() => {
      updateBalanceDisplay();
    })
    .catch((error) => {
      showNotification("Error saving user data: " + error.message, "error");
    });
}

// Load user profile data
function loadUserProfile() {
  if (!user) {
    showNotification("User not authenticated.", "error");
    return;
  }

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
      showNotification("Error loading user profile: " + error.message, "error");
    });
}

// Event listeners for buttons
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("signUpBtn").addEventListener("click", register);
  document.getElementById("logoutBtn").addEventListener("click", logout);
});

// Update balance display on page load
updateBalanceDisplay();
