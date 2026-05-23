const amounts = ["5千円", "1万円", "5万円", "100万円"];

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
  resultTitle.textContent = "";
  resultText.textContent = "";
  choiceList.innerHTML = "";

  for (let index = 0; index < 3; index += 1) {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.setAttribute("aria-label", `${index + 1}番の御香典を選ぶ`);
    button.innerHTML = `
      <img src="assets/gokoden.png" alt="" aria-hidden="true">
      <span>${index + 1}</span>
    `;
    button.addEventListener("click", () => choose(button));
    choiceList.append(button);
  }
}

function choose(button) {
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  document.querySelectorAll(".choice").forEach((item) => {
    item.classList.remove("selected");
    item.disabled = true;
  });
  button.classList.add("selected");
  resultTitle.textContent = "中身は...";
  resultText.textContent = amount;
  result.hidden = false;
}

startButton.addEventListener("click", () => {
  title.hidden = true;
  play.hidden = false;
  render();
});

resetButton.addEventListener("click", render);
