const choices = [
  {
    id: "plain",
    label: "白黒の水引",
    text: "弔事でよく使われる落ち着いた包み。",
    correct: true,
  },
  {
    id: "celebration",
    label: "紅白の水引",
    text: "お祝いごとで使う包み。",
    correct: false,
  },
  {
    id: "flashy",
    label: "金色の豪華な包み",
    text: "華やかすぎて弔事には向きません。",
    correct: false,
  },
];

const title = document.querySelector("#title");
const play = document.querySelector("#play");
const choiceList = document.querySelector("#choices");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");

function render() {
  result.hidden = true;
  choiceList.innerHTML = "";
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.innerHTML = `<strong>${choice.label}</strong><br><span>${choice.text}</span>`;
    button.addEventListener("click", () => choose(choice, button));
    choiceList.append(button);
  });
}

function choose(choice, button) {
  document.querySelectorAll(".choice").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  resultTitle.textContent = choice.correct ? "正解" : "もう一度確認";
  resultText.textContent = choice.correct
    ? "弔事では、白黒など落ち着いた水引のお香典を選びます。"
    : "紅白や豪華な包みはお祝い向きです。弔事には落ち着いた包みを選びます。";
  result.hidden = false;
}

startButton.addEventListener("click", () => {
  title.hidden = true;
  play.hidden = false;
  render();
});

resetButton.addEventListener("click", render);
