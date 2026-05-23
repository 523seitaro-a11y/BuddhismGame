const title = document.querySelector("#title");
const play = document.querySelector("#play");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const actionButton = document.querySelector("#actionButton");
const hand = document.querySelector("#hand");
const count = document.querySelector("#count");
const result = document.querySelector("#result");

let current = 0;
let moving = false;

function reset() {
  current = 0;
  moving = false;
  count.textContent = "0";
  result.hidden = true;
  actionButton.disabled = false;
  actionButton.textContent = "焼香する";
}

function doOshoko() {
  if (moving || current >= 3) return;
  moving = true;
  hand.classList.remove("move");
  window.requestAnimationFrame(() => hand.classList.add("move"));
  setTimeout(() => {
    current += 1;
    count.textContent = String(current);
    hand.classList.remove("move");
    moving = false;
    if (current === 3) {
      result.hidden = false;
      actionButton.disabled = true;
      actionButton.textContent = "完了";
    }
  }, 720);
}

startButton.addEventListener("click", () => {
  title.hidden = true;
  play.hidden = false;
  reset();
});

resetButton.addEventListener("click", reset);
actionButton.addEventListener("click", doOshoko);
