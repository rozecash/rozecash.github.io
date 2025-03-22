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
      <h2>🖱️ Click to Earn</h2>
      <button onclick="clickToEarn()">Click Me</button>
      <p>Click to earn coins. Each click gives you 0.25 coins.</p>
    `;
  } else if (game === "slots") {
    gameArea.innerHTML = `
      <h2>🎰 Slots (Coming Soon)</h2>
      <p>Spin the slots to (maybe) win big!</p>
    `;
  } else if (game === "reward") {
    gameArea.innerHTML = `
      <h2>🎁 Daily Reward</h2>
      <button onclick="claimReward()">Claim 10 Coins</button>
      <p>Come back daily to claim a reward!</p>
    `;
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <h2>🎲 Lottery (Coming Soon)</h2>
      <p>Enter the lottery for a chance to win a huge reward!</p>
    `;
  } else if (game === "coinflip") {
    gameArea.innerHTML = `
      <h2>🪙 Coinflip</h2>
      <p>Pick a side: Heads or Tails</p>
      <button onclick="flipCoin('heads')">Heads</button>
      <button onclick="flipCoin('tails')">Tails</button>
      <p class="coinflip">Bet: 5 Coins</p>
    `;
  } else if (game === "multiplayerCoinflip") {
    gameArea.innerHTML = `
      <h2>🤝 Multiplayer Coinflip</h2>
      <p>Join a coinflip with other players!</p>
      <button onclick="joinMultiplayerGame()">Join Game</button>
    `;
  }
}

// Coinflip Game Mode (Single-player)
function flipCoin(side) {
  if (balance < 5) {
    alert("Not enough coins to play!");
    return;
  }

  balance -= 5;
  updateBalanceDisplay();

  const result = Math.random() < 0.5 ? "heads" : "tails";
  alert(result === side ? "You Win!" : "You Lose!");
  if (result === side) balance += 10;  // Win 10 coins
  updateBalanceDisplay();
}

// Multiplayer Coinflip Mode (Join a game)
function joinMultiplayerGame() {
  if (balance < 10) {
    alert("You need at least 10 coins to join a multiplayer game.");
    return;
  }

  const otherPlayerChoice = Math.random() < 0.5 ? "heads" : "tails";  // Simulate other player's choice
  const userChoice = prompt("Pick your side: heads or tails");

  if (userChoice !== "heads" && userChoice !== "tails") {
    alert("Invalid choice. Please select heads or tails.");
    return;
  }

  const result = Math.random() < 0.5 ? "heads" : "tails";
  if (result === userChoice) {
    alert("You won the multiplayer game!");
    balance += 20;  // Reward for winning
  } else {
    alert("You lost the multiplayer game.");
    balance -= 10;  // Deduct coins for losing
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

// Initial load
switchGame("clicker");
updateBalanceDisplay();
