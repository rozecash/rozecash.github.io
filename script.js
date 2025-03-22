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
  } else if (game === "reward") {
    gameArea.innerHTML = `
      <h2>🎁 Daily Reward</h2>
      <button onclick="claimReward()">Claim 10 Coins</button>
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
