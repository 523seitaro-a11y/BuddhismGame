const correctOrder = [
  { id: "coin", label: "お賽銭", detail: "気持ちを込めて納める" },
  { id: "bell", label: "鈴を鳴らす", detail: "鈴があれば静かに鳴らす" },
  { id: "gassho", label: "合掌", detail: "手を合わせて祈願" },
  { id: "bow", label: "礼", detail: "最後に丁寧に礼" },
];

const extraPanels = [
  { id: "clap", label: "拍手", detail: "お寺では使わない" },
];

const allPanels = [...correctOrder, ...extraPanels];
const actionMessages = {
  coin: "お賽銭を納めます。",
  bell: "鈴を鳴らします。",
  gassho: "静かに合掌します。",
  bow: "最後に礼をします。",
  clap: "拍手しました。お寺では拍手ではなく合掌です。",
};

const titleMenu = document.querySelector("#titleMenu");
const gameScreen = document.querySelector("#gameScreen");
const startButton = document.querySelector("#startButton");
const slots = document.querySelector("#slots");
const panelGrid = document.querySelector("#panelGrid");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const resetButton = document.querySelector("#resetButton");
const playAgainButton = document.querySelector("#playAgainButton");
const decideButton = document.querySelector("#decideButton");
const sceneImage = document.querySelector("#sceneImage");

const sceneImages = {
  default: "assets/default.png",
  coin: "assets/coin.png",
  bell: "assets/bell.png",
  gassho: "assets/gassho.png",
  bow: "assets/bow.png",
  clap: "assets/clap.png",
};

let placed = [];
let selectedPanelId = null;
let suppressNextClick = false;
let checking = false;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makePanel(step) {
  const button = document.createElement("button");
  button.className = "action-panel";
  button.type = "button";
  button.draggable = false;
  button.dataset.id = step.id;
  button.innerHTML = `<span>${step.label}</span><small>${step.detail}</small>`;
  button.addEventListener("click", () => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    selectPanel(step.id);
  });
  return button;
}

function makeSlot(index) {
  const slot = document.createElement("button");
  slot.className = "slot";
  slot.type = "button";
  slot.dataset.index = String(index);
  slot.innerHTML = `<span class="slot-number">${index + 1}</span><span class="slot-text">空き</span>`;
  slot.addEventListener("click", () => {
    if (placed[index]) {
      placed[index] = null;
      resetSlot(index);
      updateDecideState();
      return;
    }
    if (selectedPanelId) placePanel(selectedPanelId, index);
  });
  return slot;
}

function render() {
  slots.innerHTML = "";
  correctOrder.forEach((_, index) => slots.append(makeSlot(index)));

  panelGrid.innerHTML = "";
  shuffle(allPanels).forEach((step) => panelGrid.append(makePanel(step)));

  placed = Array(correctOrder.length).fill(null);
  selectedPanelId = null;
  checking = false;
  result.hidden = true;
  decideButton.disabled = true;
  decideButton.textContent = "決定";
  clearAction();
  updateDecideState();
}

function selectPanel(id) {
  if (checking) return;
  selectedPanelId = selectedPanelId === id ? null : id;
  document.querySelectorAll(".action-panel").forEach((panel) => {
    panel.classList.toggle("selected", panel.dataset.id === selectedPanelId);
  });
}

function placePanel(id, index) {
  if (checking) return;
  const panel = document.querySelector(`.action-panel[data-id="${id}"]`);
  const slot = document.querySelector(`.slot[data-index="${index}"]`);
  const step = allPanels.find((item) => item.id === id);

  if (!panel || !slot || !step) return;

  placed[index] = id;
  slot.classList.add("filled");
  slot.innerHTML = `<span class="slot-number">${index + 1}</span><span class="slot-text">${step.label}</span>`;
  panel.classList.add("selected");
  selectedPanelId = id;
  updateDecideState();
}

function resetSlot(index) {
  const slot = document.querySelector(`.slot[data-index="${index}"]`);
  slot.classList.remove("filled", "right", "wrong");
  slot.innerHTML = `<span class="slot-number">${index + 1}</span><span class="slot-text">空き</span>`;
}

function updateDecideState() {
  const count = placed.filter(Boolean).length;
  decideButton.disabled = count !== correctOrder.length || checking;
}

async function decide() {
  if (decideButton.disabled) return;
  checking = true;
  decideButton.disabled = true;
  result.hidden = true;
  document.querySelectorAll(".action-panel, .slot").forEach((button) => {
    button.disabled = true;
  });

  for (const id of placed) {
    await playAction(id);
  }

  showAnswer();
  checking = false;
  decideButton.textContent = "答え合わせ済み";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playAction(id) {
  clearAction();
  const step = allPanels.find((item) => item.id === id);
  resultText.textContent = actionMessages[id] || `${step.label}をします。`;
  sceneImage.src = sceneImages[id] || sceneImages.default;
  await wait(850);
  clearAction();
  await wait(120);
}

function clearAction() {
  sceneImage.src = sceneImages.default;
}

function showAnswer() {
  const isCorrect = placed.every((id, index) => id === correctOrder[index].id);
  placed.forEach((id, index) => {
    const slot = document.querySelector(`.slot[data-index="${index}"]`);
    slot.classList.add(id === correctOrder[index].id ? "right" : "wrong");
  });

  resultTitle.textContent = isCorrect ? "正解です" : "答え合わせ";
  resultText.textContent = isCorrect
    ? "お寺の初詣の流れを正しく並べられました。"
    : "正しい順番を確認しましょう。お寺では拍手ではなく、合掌して祈願します。";
  result.hidden = false;
}

function startGame() {
  titleMenu.hidden = true;
  gameScreen.hidden = false;
  render();
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", render);
playAgainButton.addEventListener("click", render);
decideButton.addEventListener("click", decide);
