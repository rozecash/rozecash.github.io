// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmJNWl_5VFaUQwjzMjBKbX6ZoLxdr5mko",
  authDomain: "fakefreeflipdatabase.firebaseapp.com",
  projectId: "fakefreeflipdatabase",
  storageBucket: "fakefreeflipdatabase.firebasestorage.app",
  messagingSenderId: "127508082386",
  appId: "1:127508082386:web:883c2be8b481b3c6e5870b",
  measurementId: "G-RW520XL4R4"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// UI Elements
const authContainer = document.getElementById('auth-container');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');

// Show login form
function showLogin() {
  authContainer.style.display = 'none';
  loginContainer.style.display = 'block';
}

// Show register form
function showRegister() {
  authContainer.style.display = 'none';
  registerContainer.style.display = 'block';
}

// Toggle between login and register
function toggleAuthForm() {
  loginContainer.style.display = loginContainer.style.display === 'none' ? 'block' : 'none';
  registerContainer.style.display = registerContainer.style.display === 'none' ? 'block' : 'none';
  authContainer.style.display = authContainer.style.display === 'none' ? 'block' : 'none';
}

// Login user
function loginUser() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      showMainUI(user);
    })
    .catch(error => alert(error.message));
}

// Register user
function registerUser() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      showMainUI(user);
    })
    .catch(error => alert(error.message));
}

// Show main UI after login
function showMainUI(user) {
  authContainer.style.display = 'none';
  loginContainer.style.display = 'none';
  registerContainer.style.display = 'none';

  // Add user info and start the game logic
  document.getElementById('wallet').innerText = `Balance: ${user.balance} 🪙`; // You can save the balance to Firestore as well
  switchGame('clicker');
  updateBalanceDisplay();

  // Setup chat
  loadChat();
}

// Load chat from Firestore
function loadChat() {
  db.collection('chats').orderBy('timestamp')
    .onSnapshot(snapshot => {
      chatBox.innerHTML = '';
      snapshot.forEach(doc => {
        const message = doc.data();
        const messageElement = document.createElement("div");
        messageElement.className = 'message';
        messageElement.innerText = `${message.username}: ${message.text}`;
        chatBox.appendChild(messageElement);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Send message to Firestore
function sendMessage() {
  const message = chatInput.value.trim();
  const user = auth.currentUser;

  if (message && user) {
    db.collection('chats').add({
      text: message,
      username: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    chatInput.value = '';
  }
}

// Chat functionality
chatInput.addEventListener('keydown', function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Game logic
let balance = 0;

function updateBalanceDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";

  if (game === "clicker") {
    gameArea.innerHTML = `
      <h2>🖱️ Click to Earn</h2>
      <button onclick="clickToEarn()">Click Me</button>
    `;
  } else if (game === "slots") {
    gameArea.innerHTML = `
      <h2>🎰 Slots (Coming Soon)</h2>
      <p>Spin the slots to (maybe) win!</p>
    `;
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <h2>🎱 Lottery</h2>
      <button onclick="enterLottery()">Enter for 10 Coins</button>
    `;
  } else if (game === "coinflip") {
    gameArea.innerHTML = `
      <h2>🪙 Coinflip</h2>
      <button onclick="flipCoin('red')">Red</button>
      <button onclick="flipCoin('blue')">Blue</button>
    `;
  }
}

function clickToEarn() {
  balance += 0.25;
  updateBalanceDisplay();
}

function enterLottery() {
  balance -= 10;
  updateBalanceDisplay();
  // Add lottery functionality here
}

function flipCoin(side) {
  const result = Math.random() > 0.5 ? 'red' : 'blue';
  if (side === result) {
    balance += 20;
  } else {
    balance -= 10;
  }
  updateBalanceDisplay();
}
