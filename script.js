let balance = 1000;
let rewardClaimed = false;

function updateBalance() {
  document.getElementById("balanceAmount").innerText = balance;
}

function clickToEarn() {
  balance += 50;
  updateBalance();
}

function playSlots() {
  if (balance < 100) {
    alert("Not enough balance!");
    return;
  }

  balance -= 100;
  const win = Math.random() > 0.7;
  if (win) {
    const prize = 500;
    balance += prize;
    document.getElementById("slotResult").innerText = `🎉 You won $${prize}!`;
  } else {
    document.getElementById("slotResult").innerText = `😢 You lost...`;
  }

  updateBalance();
}

function claimReward() {
  if (rewardClaimed) {
    document.getElementById("rewardStatus").innerText = "✅ Already claimed!";
    return;
  }

  balance += 500;
  rewardClaimed = true;
  updateBalance();
  document.getElementById("rewardStatus").innerText = "🎁 Reward claimed!";
}

function switchGame(game) {
  const allGames = document.querySelectorAll(".game-card");
  allGames.forEach(g => g.style.display = "none");
  document.getElementById(game + "Game").style.display = "block";
}
