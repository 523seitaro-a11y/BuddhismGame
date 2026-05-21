const stages = [
  {
    lesson: "呼吸を観る",
    title: "一息だけ、静かに座る",
    text: "目の前のことを急いで変えようとせず、まず息が入って出ていくことに気づいてみます。",
    choices: ["すぐに正解を探す", "息の出入りを一回だけ感じる", "嫌な気分を押し返す", "別の画面へ逃げる"],
    answer: 1,
    insight: "仏教の入口は、特別な気分になることではなく、今ここで起きていることに気づく練習です。",
    badge: "気づき"
  },
  {
    lesson: "無常を知る",
    title: "気持ちは、ずっと同じ形ではない",
    text: "小さな不安が出てきました。次の瞬間、体の感覚や考えは少しずつ変わっています。",
    choices: ["変わるものとして眺める", "自分は不安そのものだと決める", "全部なかったことにする", "誰かのせいにする"],
    answer: 0,
    insight: "無常とは、すべてが移り変わるという見方です。つらさも固定された自分ではありません。",
    badge: "無常"
  },
  {
    lesson: "慈悲を選ぶ",
    title: "となりの人も、何かを抱えている",
    text: "困っている人に気づきました。自分も疲れていますが、小さな関わり方を選べます。",
    choices: ["見ないふりをする", "無理に全部背負う", "できる範囲で声をかける", "相手を評価する"],
    answer: 2,
    insight: "慈悲は大きな犠牲だけではありません。できる範囲で苦しみを減らそうとする姿勢です。",
    badge: "慈悲"
  },
  {
    lesson: "中道を歩く",
    title: "がんばりすぎず、投げ出しすぎず",
    text: "最後の場面です。学びを日常へ持ち帰るために、無理のない一歩を選びます。",
    choices: ["毎日完璧に修行すると決める", "今日は何もしないと決める", "一日一回だけ立ち止まる", "結果だけを急ぐ"],
    answer: 2,
    insight: "中道は、極端に偏らず、現実の中で続けられる道を選ぶことです。小さな一歩で十分です。",
    badge: "中道"
  }
];

const lessonLabel = document.querySelector("#lessonLabel");
const stageTitle = document.querySelector("#stageTitle");
const stageText = document.querySelector("#stageText");
const choices = document.querySelector("#choices");
const insight = document.querySelector("#insight");
const insightText = document.querySelector("#insightText");
const nextButton = document.querySelector("#nextButton");
const progressBar = document.querySelector("#progressBar");
const stageNumber = document.querySelector("#stageNumber");
const badgeList = document.querySelector("#badgeList");
const shareButton = document.querySelector("#shareButton");

let currentStage = 0;
const collected = new Set();

function renderBadges() {
  badgeList.innerHTML = stages
    .map((stage) => {
      const active = collected.has(stage.badge) ? "active" : "";
      return `<li class="${active}">${stage.badge}</li>`;
    })
    .join("");
}

function renderStage() {
  const stage = stages[currentStage];
  lessonLabel.textContent = stage.lesson;
  stageTitle.textContent = stage.title;
  stageText.textContent = stage.text;
  stageNumber.textContent = String(currentStage + 1);
  progressBar.style.width = `${((currentStage + 1) / stages.length) * 100}%`;
  insight.hidden = true;
  insightText.textContent = "";

  choices.innerHTML = "";
  stage.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => choose(index));
    choices.append(button);
  });

  renderBadges();
}

function choose(index) {
  const stage = stages[currentStage];
  const buttons = [...document.querySelectorAll(".choice")];
  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === stage.answer) {
      button.classList.add("correct");
    } else if (buttonIndex === index) {
      button.classList.add("missed");
    }
  });

  collected.add(stage.badge);
  insightText.textContent = stage.insight;
  nextButton.textContent = currentStage === stages.length - 1 ? "もう一度遊ぶ" : "次へ";
  insight.hidden = false;
  renderBadges();
}

nextButton.addEventListener("click", () => {
  if (currentStage === stages.length - 1) {
    currentStage = 0;
    collected.clear();
  } else {
    currentStage += 1;
  }
  renderStage();
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "BuddhismGame",
    text: "仏教体験を学べるミニゲーム",
    url: window.location.href
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
  shareButton.setAttribute("aria-label", "URLをコピーしました");
  shareButton.textContent = "✓";
  window.setTimeout(() => {
    shareButton.setAttribute("aria-label", "共有");
    shareButton.textContent = "↗";
  }, 1400);
});

renderStage();
