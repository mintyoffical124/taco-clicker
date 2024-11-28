let tacoCount = 0;
let tacosPerSecond = 0;
let upgrades = [];

// Upgrade data
const upgradeList = Array.from({ length: 20 }, (_, i) => ({
  name: `Upgrade ${i + 1}`,
  cost: 10 * (i + 1),
  tps: 1 * (i + 1),
}));

// DOM elements
const tacoCountElement = document.getElementById("taco-count");
const tpsElement = document.getElementById("tps");
const upgradesContainer = document.getElementById("upgrades");
const leaderboardList = document.getElementById("leaderboard-list");
const tacoButton = document.getElementById("taco-button");

// Save/Load buttons
document.getElementById("save-game").addEventListener("click", saveGame);
document.getElementById("load-game").addEventListener("click", loadGame);
document.getElementById("submit-score").addEventListener("click", submitScore);
document.getElementById("remove-score").addEventListener("click", removeScore);

// Update UI
function updateUI() {
  tacoCountElement.textContent = tacoCount;
  tpsElement.textContent = tacosPerSecond;

  upgrades.forEach((upgrade, index) => {
    const button = document.querySelector(`#upgrade-${index}`);
    button.disabled = tacoCount < upgrade.cost;
  });
}

// Create upgrades
function createUpgrades() {
  upgradeList.forEach((upgrade, index) => {
    const button = document.createElement("button");
    button.id = `upgrade-${index}`;
    button.textContent = `${upgrade.name} (+${upgrade.tps} TPS) - ${upgrade.cost} Tacos`;
    button.addEventListener("click", () => purchaseUpgrade(index));
    upgradesContainer.appendChild(button);
  });
  upgrades = upgradeList;
}

// Handle taco clicks
tacoButton.addEventListener("click", () => {
  tacoCount += 1;
  updateUI();
});

// Purchase an upgrade
function purchaseUpgrade(index) {
  const upgrade = upgrades[index];
  if (tacoCount >= upgrade.cost) {
    tacoCount -= upgrade.cost;
    tacosPerSecond += upgrade.tps;
    upgrade.cost = Math.floor(upgrade.cost * 1.5);
    document.querySelector(`#upgrade-${index}`).textContent = `${upgrade.name} (+${upgrade.tps} TPS) - ${upgrade.cost} Tacos`;
    updateUI();
  }
}

// Generate tacos per second
setInterval(() => {
  tacoCount += tacosPerSecond;
  updateUI();
}, 1000);

// Save the game
function saveGame() {
  const saveData = {
    tacoCount,
    tacosPerSecond,
    upgrades,
  };
  localStorage.setItem("taco-clicker-save", JSON.stringify(saveData));
  alert("Game saved!");
}

// Load the game
function loadGame() {
  const saveData = JSON.parse(localStorage.getItem("taco-clicker-save"));
  if (saveData) {
    tacoCount = saveData.tacoCount;
    tacosPerSecond = saveData.tacosPerSecond;
    upgrades = saveData.upgrades;
    updateUI();
    alert("Game loaded!");
  } else {
    alert("No save data found.");
  }
}

// Submit score to leaderboard
function submitScore() {
  const name = prompt("Enter your name for the leaderboard:");
  if (name) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score: tacoCount });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
  }
}

// Remove score from leaderboard
function removeScore() {
  const name = prompt("Enter your name to remove from the leaderboard:");
  if (name) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard = leaderboard.filter((entry) => entry.name !== name);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
  }
}

// Update leaderboard display
function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = "";
  leaderboard.forEach((entry) => {
    const div = document.createElement("div");
    div.textContent = `${entry.name}: ${entry.score} tacos`;
    leaderboardList.appendChild(div);
  });
}

// Falling tacos animation
const canvas = document.getElementById("falling-tacos");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tacos = [];
for (let i = 0; i < 50; i++) {
  tacos.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 2 + 1,
    size: Math.random() * 30 + 20,
  });
}

function drawTacos() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tacos.forEach((taco) => {
    taco.y += taco.speed;
    if (taco.y > canvas.height) taco.y = -taco.size;

    ctx.font = `${taco.size}px Arial`;
    ctx.fillText("🌮", taco.x, taco.y);
  });
  requestAnimationFrame(drawTacos);
}

createUpgrades();
updateLeaderboard();
drawTacos();
