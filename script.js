// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const profileSection = document.getElementById('profileSection');
const usernameElement = document.getElementById('username');
const profilePicElement = document.getElementById('profile-pic');
const adminPanel = document.getElementById('admin-panel');
const usernameInput = document.getElementById('usernameInput');
const amountInput = document.getElementById('amountInput');
const updateBalanceForm = document.getElementById('updateBalanceForm');
const profilePicInput = document.getElementById('profilePicInput');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

// Switch between login and register forms
loginLink.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
});

registerLink.addEventListener('click', () => {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Register New User
registerButton.addEventListener('click', async () => {
    const email = registerEmail.value;
    const password = registerPassword.value;
    const file = profilePicInput.files[0];

    if (email && password && file) {
        try {
            // Create user
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Upload Profile Picture
            const storageRef = storage.ref(`profile_pics/${user.uid}`);
            await storageRef.put(file);
            const profilePicURL = await storageRef.getDownloadURL();

            // Save user data to Firestore
            await firestore.collection('users').doc(user.uid).set({
                email: email,
                profilePic: profilePicURL,
                balance: 0 // Initial balance is set to 0
            });

            alert("Account created successfully!");
            // Automatically log in after registration
            loginUser(email, password);
        } catch (error) {
            alert("Error: " + error.message);
        }
    } else {
        alert("Please fill out all fields.");
    }
});

// Login Existing User
loginButton.addEventListener('click', async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    if (email && password) {
        loginUser(email, password);
    } else {
        alert("Please enter your email and password.");
    }
});

async function loginUser(email, password) {
    try {
        // Log in user
        await auth.signInWithEmailAndPassword(email, password);
        alert("Logged in successfully!");
        loadUserData();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Load User Data
function loadUserData() {
    const user = auth.currentUser;

    if (user) {
        // Show profile section
        profileSection.style.display = 'block';
        usernameElement.innerText = user.email;

        // Display profile picture
        firestore.collection('users').doc(user.uid).get().then(doc => {
            const userData = doc.data();
            profilePicElement.src = userData.profilePic;
        });

        // Check if the logged-in user is 'a1xsas' for admin panel access
        if (user.email === 'a1xsas') {
            adminPanel.style.display = 'block';
        }

        // Hide auth form
        document.getElementById('authForm').style.display = 'none';
    }
}

// Admin Panel: Update balance
updateBalanceForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const amount = parseInt(amountInput.value);

    if (username && amount) {
        try {
            const userSnapshot = await firestore.collection('users').where('email', '==', username).get();

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userRef = userDoc.ref;
                await userRef.update({
                    balance: firebase.firestore.FieldValue.increment(amount)
                });

                alert(`Balance for ${username} updated by ${amount}.`);
            } else {
                alert("User not found.");
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    } else {
        alert("Please provide valid username and amount.");
    }
});

// Logout User
auth.onAuthStateChanged(user => {
    if (!user) {
        // Show auth form if no user is logged in
        document.getElementById('authForm').style.display = 'block';
        profileSection.style.display = 'none';
        adminPanel.style.display = 'none';
    }
});
