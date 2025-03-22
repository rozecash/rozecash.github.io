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
const storage = firebase.storage();

// DOM elements
const authBox = document.getElementById('authBox');
const signUpBtn = document.getElementById('signUpBtn');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const sendMessageButton = document.getElementById('sendMessageButton');
const chatInput = document.getElementById('chatInput');
const usernameDisplay = document.getElementById('username');
const pfpDisplay = document.querySelector('.pfp');
const gameArea = document.getElementById('gameArea');

// Sign Up functionality
signUpBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      email: email,
      balance: 0, // Default balance
      profilePicture: 'default.jpg' // Default profile picture
    });

    // Update UI after successful sign-up
    usernameDisplay.textContent = user.email;
    pfpDisplay.src = 'path/to/default.jpg'; // Default profile picture

    authBox.style.display = 'none'; // Hide authentication box after sign-up

  } catch (error) {
    alert(error.message);
  }
});

// Login functionality
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Retrieve user data from Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    // Update UI after successful login
    usernameDisplay.textContent = user.email;
    pfpDisplay.src = userData.profilePicture; // Use the stored profile picture URL

    authBox.style.display = 'none'; // Hide authentication box after login

  } catch (error) {
    alert(error.message);
  }
});

// Send message functionality for chat
sendMessageButton.addEventListener('click', async () => {
  const message = chatInput.value;
  if (message.trim() === '') return;

  const currentUser = auth.currentUser;
  if (currentUser) {
    const messageData = {
      text: message,
      sender: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Save message to Firestore
    await db.collection('chat').add(messageData);
    chatInput.value = ''; // Clear input after sending message
  }
});

// Listen for new chat messages
db.collection('chat')
  .orderBy('timestamp', 'asc')
  .onSnapshot(snapshot => {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Clear previous messages
    snapshot.forEach(doc => {
      const messageData = doc.data();
      const messageElement = document.createElement('p');
      messageElement.textContent = `${messageData.sender}: ${messageData.text}`;
      chatMessages.appendChild(messageElement);
    });
  });

// Admin Panel: Add balance to any user
const addBalance = async (uid, amount) => {
  const userDoc = await db.collection('users').doc(uid).get();
  if (userDoc.exists) {
    const currentBalance = userDoc.data().balance;
    const newBalance = currentBalance + amount;

    // Update balance in Firestore
    await db.collection('users').doc(uid).update({
      balance: newBalance
    });

    alert('Balance updated successfully!');
  } else {
    alert('User not found!');
  }
};

// Example: Add 100 balance to a user with a specific UID (replace with dynamic data)
const exampleUid = 'USER_UID'; // Replace with the actual UID
addBalance(exampleUid, 100);

// Listen for Auth state changes (Login/Logout)
auth.onAuthStateChanged(user => {
  if (user) {
    // User is logged in
    console.log('User logged in:', user.email);
    usernameDisplay.textContent = user.email;
    pfpDisplay.src = 'path/to/user/pfp.jpg'; // Dynamic profile picture
    authBox.style.display = 'none';
  } else {
    // No user is logged in
    console.log('User logged out');
    authBox.style.display = 'block';
    usernameDisplay.textContent = 'Guest';
    pfpDisplay.src = 'path/to/default.jpg'; // Default profile picture
  }
});

// Log out functionality
const logout = async () => {
  try {
    await auth.signOut();
    alert('You have logged out!');
  } catch (error) {
    alert(error.message);
  }
};
