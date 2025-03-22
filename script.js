let balance = 0;

function updateBalanceDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = ""; // Clear current game

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
  }
}

function clickToEarn() {
  balance += 0.25;
  updateBalanceDisplay();
}

function claimReward() {
  balance += 10;
  updateBalanceDisplay();
}

// Initial load
switchGame("clicker");
updateBalanceDisplay();
