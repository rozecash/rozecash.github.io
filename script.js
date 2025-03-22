let balance = 0;

function updateBalanceDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";

  if (game === "coinflip") {
    gameArea.innerHTML = `
      <h2>🪙 Coinflip</h2>
      <p>Select a side and flip the coin!</p>
    `;
  } else if (game === "slots") {
    gameArea.innerHTML = `
      <h2>🎰 Slots</h2>
      <p>Spin to win!</p>
    `;
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <h2>🎟️ Lottery</h2>
      <p>Buy tickets and win big!</p>
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

function claimReward() {
  balance += 10;
  updateBalanceDisplay();
}

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

// Show Login/Registration Forms
function showLogin() {
  // Your login logic here
}

function showRegister() {
  // Your registration logic here
}

updateBalanceDisplay();
