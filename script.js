let balance = 100;
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");

function updateBalanceDisplay() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function switchGame(game) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = ""; // Clear the game area before loading new game

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
  } else if (game === "coinflip") {
    gameArea.innerHTML = `
      <h2>🪙 Coinflip</h2>
      <div>
        <button onclick="flipCoin('red')">Red</button>
        <button onclick="flipCoin('blue')">Blue</button>
      </div>
    `;
  } else if (game === "lottery") {
    gameArea.innerHTML = `
      <h2>🎲 Lottery</h2>
      <button onclick="playLottery()">Play Lottery</button>
    `;
  }
}

function clickToEarn() {
  balance += 0.25;
  updateBalanceDisplay();
}

function flipCoin(side) {
  const result = Math.random() > 0.5 ? 'red' : 'blue';
  if (result === side) {
    balance += 5;
    alert(`You won! ${side} was the right choice!`);
  } else {
    balance -= 5;
    alert(`You lost! ${result} was the right choice.`);
  }
  updateBalanceDisplay();
}

function playLottery() {
  const prize = Math.floor(Math.random() * 100) + 1;
  balance += prize;
  alert(`You won ${prize} coins in the lottery!`);
  updateBalanceDisplay();
}

// Chat functionality
function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = "";
  }
}

chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Initial load
switchGame("clicker");
updateBalanceDisplay();
