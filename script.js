let balance = parseFloat(localStorage.getItem('balance')) || 0;  // Fetch balance from localStorage

// Function to update balance display
function updateBalanceDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(2);
  localStorage.setItem('balance', balance);  // Store balance in localStorage
}

// Function to switch between game modes
function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";  // Clear current game content

  if (game === "clicker") {
    gameArea.innerHTML = `
      <div class="game-area">
        <h2>🖱️ Click to Earn</h2>
        <button class="game-button" onclick="clickToEarn()">Click Me</button>
        <p>Click to earn coins. Each click gives you 0.25 coins.</p>
      </div>
    `;
  } else if (game === "slots") {
    gameArea.innerHTML = `
      <div class="game-area">
        <h2>🎰 Slots</h2>
        <button class="game-button" onclick="playSlots()">Spin Slots</button>
        <p>Spin the slots to (maybe) win big!</p>
      </div>
    `;
  } else if (game === "reward") {
    gameArea.innerHTML = `
      <div class="game-area">
        <h2>🎁 Daily Reward</h2>
        <button class="game-button" onclick="claimReward()">Claim 10 Coins</button>
        <p>Come back daily to claim a reward!</p>
      </div>
    `;
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <div class="game-area">
        <h2>🎲 Lottery</h2>
        <button class="game-button" onclick="playLottery()">Play Lottery</button>
        <p>Try your luck and win huge rewards!</p>
      </div>
    `;
  } else if (game === "coinflip") {
    gameArea.innerHTML = `
      <div class="game-area coinflip">
        <h2>🪙 Coinflip</h2>
        <p>Pick a side: Red or Blue</p>
        <button class="game-button" onclick="flipCoin('red')">Red</button>
        <button class="game-button" onclick="flipCoin('blue')">Blue</button>
        <p class="coin">Bet: 5 Coins</p>
      </div>
    `;
  }
}

// Coinflip Game Mode (Red or Blue)
function flipCoin(side) {
  if (balance < 5) {
    alert("Not enough coins to play!");
    return;
  }

  balance -= 5;
  updateBalanceDisplay();

  const result = Math.random() < 0.5 ? "red" : "blue";
  alert(result === side ? "You Win!" : "You Lose!");
  if (result === side) balance += 10;  // Win 10 coins
  updateBalanceDisplay();
}

// Lottery Game Mode
function playLottery() {
  if (balance < 10) {
    alert("You need at least 10 coins to play the lottery.");
    return;
  }

  balance -= 10;
  updateBalanceDisplay();

  const winChance = Math.random();
  if (winChance < 0.2) {
    alert("You won the lottery! You get 100 coins!");
    balance += 100;
  } else {
    alert("You didn't win this time.");
  }
  updateBalanceDisplay();
}

// Slots Game Mode
function playSlots() {
  if (balance < 5) {
    alert("You need at least 5 coins to play slots.");
    return;
  }

  balance -= 5;
  updateBalanceDisplay();

  const slotOutcome = Math.random();
  if (slotOutcome < 0.2) {
    alert("You hit the jackpot! You won 50 coins!");
    balance += 50;
  } else {
    alert("Better luck next time.");
  }
  updateBalanceDisplay();
}

// Claim daily reward
function claimReward() {
  balance += 10;
  updateBalanceDisplay();
}

// Click to Earn Game
function clickToEarn() {
  balance += 0.25;
  updateBalanceDisplay();
}

// Chat system
const chatInput = document.querySelector(".chat-input");
const chatBox = document.querySelector(".chat-box");

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);

    // Scroll to the bottom of chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear the input field
    chatInput.value = "";
  }
}

// Handle message send with enter key
chatInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
