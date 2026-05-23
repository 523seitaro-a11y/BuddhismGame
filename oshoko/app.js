const title = document.querySelector("#title");
const play = document.querySelector("#play");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const ash = document.querySelector("#ash");
const sceneStage = document.querySelector("#sceneStage");
const faceZone = document.querySelector(".face-zone");
const startZone = document.querySelector(".start-zone");
const count = document.querySelector("#count");
const result = document.querySelector("#result");

let current = 0;
let dragging = false;
let visitedFace = false;
let offsetX = 0;
let offsetY = 0;

function reset() {
  current = 0;
  dragging = false;
  visitedFace = false;
  count.textContent = "0";
  result.hidden = true;
  ash.hidden = false;
  ash.classList.remove("dragging", "near-face", "near-start");
  resetAshPosition();
}

function resetAshPosition() {
  ash.style.left = "42%";
  ash.style.top = "23%";
}

function overlaps(first, second) {
  const a = first.getBoundingClientRect();
  const b = second.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;
  return ax >= b.left && ax <= b.right && ay >= b.top && ay <= b.bottom;
}

function updateZones() {
  const nearFace = overlaps(ash, faceZone);
  const nearStart = overlaps(ash, startZone);
  ash.classList.toggle("near-face", nearFace);
  ash.classList.toggle("near-start", nearStart && visitedFace);
  if (nearFace) visitedFace = true;
  return { nearStart };
}

function finishCycleIfReady() {
  const { nearStart } = updateZones();
  if (!visitedFace || !nearStart) return false;
  current += 1;
  count.textContent = String(current);
  visitedFace = false;
  resetAshPosition();
  ash.classList.remove("near-face", "near-start");
  if (current >= 3) {
    result.hidden = false;
    ash.hidden = true;
  }
  return true;
}

function startDrag(event) {
  if (current >= 3) return;
  event.preventDefault();
  dragging = true;
  ash.classList.add("dragging");
  ash.setPointerCapture(event.pointerId);
  const rect = ash.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;
}

function moveAsh(event) {
  if (!dragging) return;
  event.preventDefault();
  const stage = sceneStage.getBoundingClientRect();
  const x = event.clientX - stage.left - offsetX;
  const y = event.clientY - stage.top - offsetY;
  ash.style.left = `${(x / stage.width) * 100}%`;
  ash.style.top = `${(y / stage.height) * 100}%`;
  updateZones();
}

function endDrag(event) {
  if (!dragging) return;
  dragging = false;
  ash.releasePointerCapture(event.pointerId);
  ash.classList.remove("dragging");
  if (!finishCycleIfReady()) {
    updateZones();
  }
}

startButton.addEventListener("click", () => {
  title.hidden = true;
  play.hidden = false;
  reset();
});

resetButton.addEventListener("click", reset);
ash.addEventListener("pointerdown", startDrag);
ash.addEventListener("pointermove", moveAsh);
ash.addEventListener("pointerup", endDrag);
ash.addEventListener("pointercancel", endDrag);
