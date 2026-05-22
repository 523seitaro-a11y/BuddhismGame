const correctOrder = [
  { id: "bow1", label: "一礼", detail: "鳥居や参道の前で軽く礼" },
  { id: "coin", label: "お賽銭", detail: "気持ちを込めて納める" },
  { id: "bell", label: "鈴", detail: "鈴があれば鳴らす" },
  { id: "bow2", label: "二礼", detail: "深く二回礼" },
  { id: "clap", label: "二拍手", detail: "手を二回打つ" },
  { id: "pray", label: "祈る", detail: "手を合わせて願う" },
  { id: "bow3", label: "一礼", detail: "最後にもう一度礼" },
];

const extraPanels = [
  { id: "photo", label: "写真", detail: "参拝の途中ではない" },
  { id: "run", label: "走る", detail: "参道では落ち着いて歩く" },
];

const slots = document.querySelector("#slots");
const panelGrid = document.querySelector("#panelGrid");
const message = document.querySelector("#message");
const progressBar = document.querySelector("#progressBar");
const result = document.querySelector("#result");
const resetButton = document.querySelector("#resetButton");
const playAgainButton = document.querySelector("#playAgainButton");
const coin = document.querySelector("#coin");

let placed = [];
let selectedPanelId = null;
let suppressNextClick = false;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makePanel(step) {
  const button = document.createElement("button");
  button.className = "action-panel";
  button.type = "button";
  button.draggable = true;
  button.dataset.id = step.id;
  button.innerHTML = `<span>${step.label}</span><small>${step.detail}</small>`;
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", step.id);
    selectedPanelId = step.id;
  });
  button.addEventListener("pointerdown", (event) => beginPointerDrag(event, button, step.id));
  button.addEventListener("click", () => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    selectPanel(step.id);
  });
  return button;
}

function beginPointerDrag(event, panel, id) {
  if (panel.disabled || event.pointerType === "mouse") return;

  const startX = event.clientX;
  const startY = event.clientY;
  let dragging = false;

  selectedPanelId = id;
  panel.setPointerCapture(event.pointerId);

  function move(moveEvent) {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;
    if (!dragging && Math.hypot(dx, dy) > 8) {
      dragging = true;
      panel.classList.add("dragging");
    }
    if (dragging) {
      moveEvent.preventDefault();
      panel.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    }
  }

  function end(endEvent) {
    panel.releasePointerCapture(event.pointerId);
    panel.removeEventListener("pointermove", move);
    panel.removeEventListener("pointerup", end);
    panel.removeEventListener("pointercancel", cancel);

    if (!dragging) return;

    suppressNextClick = true;
    panel.classList.remove("dragging");
    panel.style.transform = "";

    const dropTarget = document.elementFromPoint(endEvent.clientX, endEvent.clientY)?.closest(".slot");
    if (dropTarget) {
      tryPlace(id, Number(dropTarget.dataset.index));
    } else {
      selectPanel(id);
    }
  }

  function cancel() {
    panel.classList.remove("dragging");
    panel.style.transform = "";
    panel.removeEventListener("pointermove", move);
    panel.removeEventListener("pointerup", end);
    panel.removeEventListener("pointercancel", cancel);
  }

  panel.addEventListener("pointermove", move);
  panel.addEventListener("pointerup", end);
  panel.addEventListener("pointercancel", cancel);
}

function makeSlot(index) {
  const slot = document.createElement("button");
  slot.className = "slot";
  slot.type = "button";
  slot.dataset.index = String(index);
  slot.innerHTML = `<span class="slot-number">${index + 1}</span><span class="slot-text">ここに入れる</span>`;
  slot.addEventListener("dragover", (event) => event.preventDefault());
  slot.addEventListener("drop", (event) => {
    event.preventDefault();
    tryPlace(event.dataTransfer.getData("text/plain"), index);
  });
  slot.addEventListener("click", () => {
    if (selectedPanelId) tryPlace(selectedPanelId, index);
  });
  return slot;
}

function render() {
  slots.innerHTML = "";
  correctOrder.forEach((_, index) => slots.append(makeSlot(index)));

  panelGrid.innerHTML = "";
  shuffle([...correctOrder, ...extraPanels]).forEach((step) => panelGrid.append(makePanel(step)));

  placed = Array(correctOrder.length).fill(null);
  selectedPanelId = null;
  result.hidden = true;
  message.textContent = "下のパネルを、初詣の作法の順番に中央の枠へ入れよう。タップでも操作できます。";
  updateProgress();
}

function selectPanel(id) {
  selectedPanelId = id;
  document.querySelectorAll(".action-panel").forEach((panel) => {
    panel.classList.toggle("selected", panel.dataset.id === id);
  });
  const step = [...correctOrder, ...extraPanels].find((item) => item.id === id);
  message.textContent = `「${step.label}」を選択中。入れたい枠をタップしてください。`;
}

function tryPlace(id, index) {
  const expected = correctOrder[index];
  const panel = document.querySelector(`.action-panel[data-id="${id}"]`);
  const slot = document.querySelector(`.slot[data-index="${index}"]`);

  if (!panel || !slot || placed[index]) return;

  if (id !== expected.id) {
    slot.classList.add("shake");
    message.textContent = `その枠は「${expected.label}」の順番です。もう一度考えてみよう。`;
    setTimeout(() => slot.classList.remove("shake"), 420);
    return;
  }

  placed[index] = id;
  slot.classList.add("filled");
  slot.innerHTML = `<span class="slot-number">${index + 1}</span><span class="slot-text">${expected.label}</span>`;
  panel.disabled = true;
  panel.classList.remove("selected");
  selectedPanelId = null;
  message.textContent = `${expected.label}、正解です。次の作法を入れましょう。`;

  if (id === "coin") {
    coin.classList.remove("animate");
    window.requestAnimationFrame(() => coin.classList.add("animate"));
  }

  updateProgress();
  checkClear();
}

function updateProgress() {
  const count = placed.filter(Boolean).length;
  progressBar.style.width = `${(count / correctOrder.length) * 100}%`;
}

function checkClear() {
  if (placed.every(Boolean)) {
    message.textContent = "クリア。初詣の基本の流れを並べられました。";
    result.hidden = false;
  }
}

resetButton.addEventListener("click", render);
playAgainButton.addEventListener("click", render);

render();
