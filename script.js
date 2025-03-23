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
  query,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
  const usernameDisplay = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");

  if (authBox && usernameDisplay && logoutBtn) {
    authBox.style.display = "none"; // Hide login tab
    usernameDisplay.innerText = user?.displayName || "User"; // Update username
    logoutBtn.style.display = "block"; // Show logout button
  }

  // Show home page by default
  showPage("homePage");
}

// Update UI after logout
function showAuthUI() {
  const authBox = document.getElementById("authBox");
  const usernameDisplay = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");

  if (authBox && usernameDisplay && logoutBtn) {
    authBox.style.display = "block"; // Show login tab
    usernameDisplay.innerText = "Guest"; // Reset username
    logoutBtn.style.display = "none"; // Hide logout button
  }
}

// Show a specific page
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.style.display = page.id === pageId ? "block" : "none";
  });
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
      saveUserData(username);
      showMainUI();
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
    loadUserProfile();
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

        // Update profile picture
        const profilePic = document.getElementById("profilePic");
        if (data.profilePicture) {
          profilePic.src = data.profilePicture;
        }
      }
    })
    .catch((error) => {
      showNotification("Error loading user profile: " + error.message, "error");
    });
}

// Upload profile picture
document.getElementById("pfpUpload")?.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const storageRef = ref(storage, `profilePictures/${user.uid}`);
  uploadBytes(storageRef, file)
    .then(() => {
      return getDownloadURL(storageRef);
    })
    .then((downloadURL) => {
      // Update Firestore with the new profile picture URL
      return setDoc(doc(db, "users", user.uid), { profilePicture: downloadURL }, { merge: true });
    })
    .then(() => {
      // Update the profile picture on the page
      const profilePic = document.getElementById("profilePic");
      profilePic.src = downloadURL;
      showNotification("Profile picture updated!", "success");
    })
    .catch((error) => {
      showNotification("Error uploading profile picture: " + error.message, "error");
    });
});

// Load chat messages
function loadChat() {
  const chatMessages = document.getElementById("chatMessages");
  const chatRef = collection(db, "chat");

  // Listen for new messages
  onSnapshot(query(chatRef, orderBy("timestamp", "desc")), (snapshot) => {
    chatMessages.innerHTML = ""; // Clear existing messages

    // Limit to 50 messages
    const messages = snapshot.docs.slice(0, 50);

    // Display messages in reverse order (latest at the bottom)
    messages.reverse().forEach((doc) => {
      const data = doc.data();
      const messageElement = document.createElement("p");
      messageElement.innerHTML = `
        <img src="${data.profilePicture || "images/default.jpg"}" alt="Profile Picture" />
        <strong>${data.username}:</strong> ${data.message}
      `;
      chatMessages.appendChild(messageElement);
    });

    // Automatically scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

// Send chat message
function sendMessage() {
  const message = document.getElementById("chatInput").value;
  if (message.trim() === "") return;

  if (!user) {
    showNotification("You must be logged in to send messages.", "error");
    return;
  }

  addDoc(collection(db, "chat"), {
    message: message,
    timestamp: Date.now(),
    username: user.displayName || "Anonymous",
    profilePicture: user.photoURL || "images/default.jpg",
  })
    .then(() => {
      document.getElementById("chatInput").value = "";
    })
    .catch((error) => {
      showNotification("Error sending message: " + error.message, "error");
    });
}

// Event listeners for buttons
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn")?.addEventListener("click", login);
  document.getElementById("signUpBtn")?.addEventListener("click", register);
  document.getElementById("logoutBtn")?.addEventListener("click", logout);

  // Navigation buttons
  document.getElementById("homeBtn")?.addEventListener("click", () => showPage("homePage"));
  document.getElementById("profileBtn")?.addEventListener("click", () => showPage("profilePage"));

  // Chat functionality
  document.getElementById("sendMessageButton")?.addEventListener("click", sendMessage);
});

// Load chat when the page loads
loadChat();

// Update balance display on page load
updateBalanceDisplay();
