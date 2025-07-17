// QUESTIONS DATA
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Madrid", "Berlin", "Rome"],
    answer: "Paris"
  },
  {
    question: "Who developed React?",
    options: ["Facebook", "Google", "Microsoft", "Twitter"],
    answer: "Facebook"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars"
  },
  {
    question: "What is 5 x 6?",
    options: ["30", "20", "25", "35"],
    answer: "30"
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript"
  }
];

// VARIABLES
const quizContainer = document.getElementById("quiz-container");
const leaderboardContainer = document.getElementById("leaderboard-container");
const leaderboardList = document.getElementById("leaderboard-list");
const playAgainBtn = document.getElementById("play-again-btn");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15; // seconds per question
let selectedAnswer = null;
let answers = []; // store user's answers for review

// INITIALIZE QUIZ
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  selectedAnswer = null;

  const q = questions[currentQuestionIndex];
  quizContainer.innerHTML = `
    <h2>Question ${currentQuestionIndex + 1} of ${questions.length}</h2>
    <div id="timer">⏰ Time Left: ${timeLeft}s</div>
    <h3>${q.question}</h3>
    <ul class="options-list">
      ${q.options.map(
        option => `<li onclick="selectAnswer(this)">${option}</li>`
      ).join('')}
    </ul>
    <button id="next-btn" disabled>Next</button>
  `;

  // Start timer countdown
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏰ Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswer();
    }
  }, 1000);

  // Attach event to Next button
  document.getElementById("next-btn").addEventListener("click", () => {
    submitAnswer();
  });
}

function selectAnswer(li) {
  if (!li) return;
  // Remove previous selection
  const options = document.querySelectorAll(".options-list li");
  options.forEach(opt => opt.classList.remove("selected"));

  li.classList.add("selected");
  selectedAnswer = li.textContent;
  document.getElementById("next-btn").disabled = false;
}

function submitAnswer() {
  clearInterval(timer);

  if (selectedAnswer === questions[currentQuestionIndex].answer) {
    score++;
  }

  // Store for review
  answers.push({
    question: questions[currentQuestionIndex].question,
    selected: selectedAnswer || "No Answer",
    correct: questions[currentQuestionIndex].answer,
    isCorrect: selectedAnswer === questions[currentQuestionIndex].answer
  });

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizContainer.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Score: <strong>${score} / ${questions.length}</strong></p>
    <h3>Review Answers</h3>
    <ul>
      ${answers.map((a, i) => `
        <li style="margin-bottom:10px; text-align:left;">
          <strong>Q${i+1}:</strong> ${a.question} <br>
          <span style="color:${a.isCorrect ? 'lightgreen' : '#f44336'}">
            Your answer: ${a.selected} ${a.isCorrect ? '✔️' : '❌'}
          </span><br>
          ${a.isCorrect ? '' : `<span style="color:lightgreen;">Correct answer: ${a.correct}</span>`}
        </li>
      `).join('')}
    </ul>

    <h3>Save your score to the leaderboard</h3>
    <input type="text" id="username" placeholder="Enter your name" />
    <button id="save-score-btn" disabled>Save Score</button>
  `;

  const usernameInput = document.getElementById("username");
  const saveBtn = document.getElementById("save-score-btn");

  usernameInput.addEventListener("input", () => {
    saveBtn.disabled = usernameInput.value.trim() === "";
  });

  saveBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username === "") return alert("Please enter your name!");

    saveScore(username, score);
    showLeaderboard();
  });
}

function saveScore(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({
    name,
    score,
    date: new Date().toLocaleDateString()
  });
  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
  quizContainer.style.display = "none";
  leaderboardContainer.style.display = "block";

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No scores yet.</li>";
  } else {
    leaderboardList.innerHTML = leaderboard.map((entry, i) => `
      <li><strong>${i+1}. ${entry.name}</strong> - Score: ${entry.score} - <small>${entry.date}</small></li>
    `).join("");
  }
}

playAgainBtn.addEventListener("click", () => {
  // Reset quiz
  currentQuestionIndex = 0;
  score = 0;
  answers = [];
  leaderboardContainer.style.display = "none";
  quizContainer.style.display = "block";
  loadQuestion();
});

// Start quiz for the first time
loadQuestion();