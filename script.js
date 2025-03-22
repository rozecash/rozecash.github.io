// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAmJNWl_5VFaUQwjzMjBKbX6ZoLxdr5mko",
  authDomain: "fakefreeflipdatabase.firebaseapp.com",
  projectId: "fakefreeflipdatabase",
  storageBucket: "fakefreeflipdatabase.firebasestorage.app",
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
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
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

// Update balance display
function updateBalanceDisplay() {
  const balanceElement = document.getElementById("balance");
  if (balanceElement) {
    balanceElement.innerText = balance.toFixed(2);
  } else {
    console.error("Balance element not found");
  }
}

// Switch between different game modes
function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  if (!gameArea) {
    console.error("Game area not found");
    return;
  }

  gameArea.innerHTML = "";

  if (game === "coinflip") {
    gameArea.innerHTML = `
      <h2>🪙 Coinflip</h2>
      <p>Select a side and flip the coin!</p>
      <button id="coinflipBtn">Flip Coin</button>
    `;
    document.getElementById("coinflipBtn").addEventListener("click", coinflip);
  } else if (game === "slots") {
    gameArea.innerHTML = `
      <h2>🎰 Slots</h2>
      <p>Spin to win!</p>
      <button id="spinSlotsBtn">Spin</button>
    `;
    document.getElementById("spinSlotsBtn").addEventListener("click", spinSlots);
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <h2>🎟️ Lottery</h2>
      <p>Buy tickets and win big!</p>
      <button id="buyLotteryBtn">Buy Ticket</button>
    `;
    document.getElementById("buyLotteryBtn").addEventListener("click", buyLottery);
  } else if (game === "rewards") {
    gameArea.innerHTML = `
      <h2>🎁 Rewards</h2>
      <button id="claimRewardBtn">Claim 10 Coins</button>
    `;
    document.getElementById("claimRewardBtn").addEventListener("click", claimReward);
  } else if (game === "chat") {
    gameArea.innerHTML = `
      <div class="chat-box" id="chatBox">
        <div id="chatMessages"></div>
        <div class="chat-input">
          <input id="chatInput" type="text" placeholder="Type a message..." />
          <button id="sendMessageBtn">Send</button>
        </div>
      </div>
    `;
    document.getElementById("sendMessageBtn").addEventListener("click", sendMessage);
    loadChat();
  }
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
  const authContainer = document.getElementById("authContainer");
  const mainUI = document.getElementById("mainUI");
  if (authContainer && mainUI) {
    authContainer.style.display = "none";
    mainUI.style.display = "block";
  }

  if (user && user.displayName) {
    document.getElementById("userName").innerText = user.displayName;
  } else {
    document.getElementById("userName").innerText = "User"; // Set a default name if displayName is not available
  }

  loadUserProfile();
}


function showAuthUI() {
  const authContainer = document.getElementById("auth-container");
  const profileContainer = document.getElementById("profile-container");
  if (authContainer && profileContainer) {
    authContainer.style.display = "block";
    profileContainer.style.display = "none";
  }
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
}

function coinflip() {
  const flipResult = Math.random() > 0.5 ? "Heads" : "Tails";
  alert(`You flipped: ${flipResult}`);
}

function spinSlots() {
  const slotResult = Math.floor(Math.random() * 7) + 1;
  alert(`You spun: ${slotResult}`);
}

function buyLottery() {
  alert("Lottery ticket purchased! Good luck!");
}

// Chat functions
function sendMessage() {
  const message = document.getElementById("chatInput").value;
  if (message.trim() === "") return;
  db.collection("chat").add({ message, timestamp: Date.now() });
  document.getElementById("chatInput").value = "";
}

function loadChat() {
  const chatMessages = document.getElementById("chatMessages");
  db.collection("chat")
    .orderBy("timestamp")
    .onSnapshot((snapshot) => {
      chatMessages.innerHTML = "";
      snapshot.forEach((doc) => {
        chatMessages.innerHTML += `<p>${doc.data().message}</p>`;
      });
    });
}

// Event listeners for buttons
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("register-btn").addEventListener("click", register);
document.getElementById("logout-btn").addEventListener("click", logout);

// Update balance display on page load
updateBalanceDisplay();
