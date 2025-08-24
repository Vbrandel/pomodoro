// // Assets son
const courte = "assets/courte.mp3";
const longue = "assets/longue.mp3";

let timerDisplay = document.getElementById("timer");
let progressDisplay = document.getElementById("progress");

let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let configBtn = document.getElementById("configBtn");

let workInput = document.getElementById("workMinutes");
let shortBreakInput = document.getElementById("shortBreakMinutes");
let repetitionsInput = document.getElementById("repetitions");

let workValue = document.getElementById("workMinutesvalue");
let shortBreakValue = document.getElementById("shortBreakMinutesValue");
let repetitionsValue = document.getElementById("repetitionsValue");

let configSection = document.getElementById("configSection");

let timer;
let isRunning = false;
let isPaused = false;
let isWorkTime = true;
let timeLeft;
let cycle = 0;

// Valeur initiale
let workMinutes = parseInt(workInput.value);
let shortBreakMinutes = parseInt(shortBreakInput.value);
let repetitions = parseInt(repetitionsInput.value);

// Mise a jour des valeurs affichées grâce aux ranges
workInput.addEventListener("input", () => {
  workMinutes = parseInt(workInput.value);
  workValue.textContent = workMinutes;
  resetTimer();
});

shortBreakInput.addEventListener("input", () => {
  shortBreakMinutes = parseInt(shortBreakInput.value);
  shortBreakValue.textContent = shortBreakMinutes;
  resetTimer();
});

repetitionsInput.addEventListener("input", () => {
  repetitions = parseInt(repetitionsInput.value);
  repetitionsValue.textContent = repetitions;
  resetTimer();
});

// Affichage de la modal de configuration
configBtn.addEventListener("click", () => {
  configSection.classList.toggle("hidden");
});

// Bouton de démarrage
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    startTimer();
  } else {
    pauseTimer();
  }
  updateButtonState();
});

function updateButtonState() {
  // Supprimer toutes les classes d'état
  startBtn.classList.remove("btn-start", "btn-pause", "btn-resume");
  
  if (!isRunning && !isPaused) {
    // État initial ou après reset
    startBtn.classList.add("btn-start");
    startBtn.textContent = "Démarrer";
  } else if (isRunning && !isPaused) {
    // Timer en cours
    startBtn.classList.add("btn-pause");
    startBtn.textContent = "Pause";
  } else if (isPaused) {
    // Timer en pause
    startBtn.classList.add("btn-resume");
    startBtn.textContent = "Reprendre";
  }
}

// Bouton de réinitialisation
resetBtn.addEventListener("click", resetTimer);

function startTimer() {
  isRunning = true;
  isPaused = false;

  if (timeLeft === undefined) {
    timeLeft = isWorkTime ? workMinutes * 60 : shortBreakMinutes * 60;
  }

  timer = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timer);

      if (isWorkTime) {
        cycle++;
        if (cycle >= repetitions) {
          progressDisplay.textContent = `Félicitations ! Le pomodoro est terminé !`;
          isRunning = false;
          document.body.classList.remove('short-break'); // Retirer le fond de nuit
          (new Audio(longue)).play(); // Son long pour la fin 
          updateButtonState();
          return;
        }
        
        // Transition vers la pause courte
        isWorkTime = false;
        timeLeft = shortBreakMinutes * 60;
        progressDisplay.textContent = `Pause courte - Étape ${cycle}/${repetitions}`;
        document.body.classList.add('short-break'); // Activer le fond de nuit
        (new Audio(courte)).play(); // Son court pour la fin 
      } else {
        // Transition vers le travail
        isWorkTime = true;
        timeLeft = workMinutes * 60;
        progressDisplay.textContent = `Travail - Étape ${cycle + 1}/${repetitions}`;
        document.body.classList.remove('short-break'); // Retirer le fond de nuit
        (new Audio(longue)).play(); // Son long pour la fin
      }

      startTimer();
    }

    timeLeft--;
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  isPaused = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isPaused = false;
  isWorkTime = true;
  cycle = 0;
  timeLeft = workMinutes * 60;
  timerDisplay.textContent = `${workMinutes.toString().padStart(2, "0")}:00`;
  progressDisplay.textContent = `Travail - Étape 1/${repetitions}`;
  document.body.classList.remove('short-break'); // Retirer le fond de nuit
  updateButtonState();
}

