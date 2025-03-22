// Import Firebase components
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmJNWl_5VFaUQwjzMjBKbX6ZoLxdr5mko",
  authDomain: "fakefreeflipdatabase.firebaseapp.com",
  projectId: "fakefreeflipdatabase",
  storageBucket: "fakefreeflipdatabase.firebasestorage.app",
  messagingSenderId: "127508082386",
  appId: "1:127508082386:web:883c2be8b481b3c6e5870b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global variables
let balance = 0;
let user = null;

// Update balance display
function updateBalanceDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

// Switch between different game modes
function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";

  if (game === "coinflip") {
    gameArea.innerHTML = `
      <h2>🪙 Coinflip</h2>
      <p>Select a side and flip the coin!</p>
      <button onclick="coinflip()">Flip Coin</button>
    `;
  } else if (game === "slots") {
    gameArea.innerHTML = `
      <h2>🎰 Slots</h2>
      <p>Spin to win!</p>
      <button onclick="spinSlots()">Spin</button>
    `;
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <h2>🎟️ Lottery</h2>
      <p>Buy tickets and win big!</p>
      <button onclick="buyLottery()">Buy Ticket</button>
    `;
  } else if (game === "rewards") {
    gameArea.innerHTML = `
      <h2>🎁 Rewards</h2>
      <button onclick="claimReward()">Claim 10 Coins</button>
    `;
  } else if (game === "chat") {
    gameArea.innerHTML = `
      <div class="chat-box" id="chatBox">
        <div id="chatMessages"></div>
        <div class="chat-input">
          <input id="chatInput" type="text" placeholder="Type a message..." />
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
    `;
    loadChat();
  }
}

// Firebase authentication functions
function register() {
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

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
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

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
  signOut(auth).then(() => {
    user = null;
    showAuthUI();
  }).catch((error) => {
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
  document.getElementById("authContainer").style.display = "none";
  document.getElementById("mainUI").style.display = "block";
  document.getElementById("userName").innerText = user.displayName || "User";
  loadUserProfile();
}

function showAuthUI() {
  document.getElementById("authContainer").style.display = "block";
  document.getElementById("mainUI").style.display = "none";
}

// Save user data to Firestore
function saveUserData(username) {
  setDoc(doc(db, "users", user.uid), {
    username: username,
    balance: 0,
    profilePicture: null
  }).then(() => {
    updateBalanceDisplay();
  }).catch((error) => {
    alert("Error saving user data: " + error.message);
  });
}

// Load user profile data
function loadUserProfile() {
  const userRef = doc(db, "users", user.uid);
  getDoc(userRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      balance = data.balance;
      updateBalanceDisplay();
    }
  });
}

// Handle game actions (coinflip, slots, lottery, etc.)
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

  addDoc(collection(db, "chat"), { message, timestamp: Date.now() });
  document.getElementById("chatInput").value = "";
}

function loadChat() {
  const chatMessages = document.getElementById("chatMessages");
  const q = query(collection(db, "chat"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    chatMessages.innerHTML = "";
    snapshot.forEach((docSnapshot) => {
      chatMessages.innerHTML += `<p>${docSnapshot.data().message}</p>`;
    });
  });
}

// Update balance display on page load
updateBalanceDisplay();
