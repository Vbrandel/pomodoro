// Configuration du Pomodoro défaut
let config = {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    repetitions: 4,
    currentRepetition: 0,
    isRunning: false,
    timer: null
};

// Assets son
const courte = "assets/courte.mp3";
const longue = "assets/longue.mp3";
// Éléments du DOM
const timerDisplay = document.getElementById('timer');
const progressDisplay = document.getElementById('progress');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const configButton = document.getElementById('configBtn');
const configSection = document.getElementById('configSection');

// Éléments de configuration
const workMinutesInput = document.getElementById('workMinutes');
const shortBreakMinutesInput = document.getElementById('shortBreakMinutes');
const longBreakMinutesInput = document.getElementById('longBreakMinutes');
const repetitionsInput = document.getElementById('repetitions');
const workMinutesValue = document.getElementById('workMinutesvalue');
const shortBreakMinutesValue = document.getElementById('shortBreakMinutesValue');
const longBreakMinutesValue = document.getElementById('longBreakMinutesValue');
const repetitionsValue = document.getElementById('repetitionsValue');

// Gestion de l'affichage de la configuration
function toggleConfig() {
    configSection.classList.toggle('hidden');
    configButton.textContent = configSection.classList.contains('hidden') ? 'Configuration' : 'Fermer';
    
    // Gestion de l'affichage des boutons
    if (configSection.classList.contains('hidden')) {
        startButton.style.display = 'block';
        resetButton.style.display = 'block';
        configButton.style.border = "0px solid rgba(255, 255, 255, 0.32)";
    } else {
        startButton.style.display = 'none';
        resetButton.style.display = 'none';
        configButton.style.border = "1px solid rgba(255, 255, 255, 0.32)";
    }
}

// Mise à jour de la configuration
function updateConfig() {
    config.workMinutes = parseInt(workMinutesInput.value);
    config.shortBreakMinutes = parseInt(shortBreakMinutesInput.value);
    config.longBreakMinutes = parseInt(longBreakMinutesInput.value);
    config.repetitions = parseInt(repetitionsInput.value);
    workMinutesValue.textContent = config.workMinutes;
    shortBreakMinutesValue.textContent = config.shortBreakMinutes;
    longBreakMinutesValue.textContent = config.longBreakMinutes;
    repetitionsValue.textContent = config.repetitions;
    updateProgress();
    // Mise à jour de l'affichage du timer si le timer n'est pas en cours
    if (!config.isRunning) {
        updateDisplay(config.workMinutes, 0);
    }
}

// Mise à jour de l'affichage
function updateDisplay(minutes, seconds) {
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Mise à jour de la progression
function updateProgress() {
    progressDisplay.textContent = `Étape ${config.currentRepetition}/${config.repetitions}`;
}

// Formatage du temps
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return { minutes, seconds: remainingSeconds };
}

// Démarrage du timer
function startTimer() {
    if (!config.isRunning) {
        updateConfig();
        config.isRunning = true;
        startButton.textContent = 'Pause';
        
        let timeLeft = config.workMinutes * 60;
        
        config.timer = setInterval(() => {
            timeLeft--;
            const { minutes, seconds } = formatTime(timeLeft);
            updateDisplay(minutes, seconds);
            
            if (timeLeft <= 0) {
                clearInterval(config.timer);
                config.currentRepetition++;
                updateProgress();
                
                if (config.currentRepetition < config.repetitions) {
                    // Pause courte
                    document.body.classList.add('short-break');
                    (new Audio(courte)).play();
                    timeLeft = config.shortBreakMinutes * 60;
                    config.timer = setInterval(() => {
                        timeLeft--;
                        const { minutes, seconds } = formatTime(timeLeft);
                        updateDisplay(minutes, seconds);
                        
                        if (timeLeft <= 0) {
                            clearInterval(config.timer);
                            document.body.classList.remove('short-break');
                            startTimer(); // Recommence le cycle
                        }
                    }, 1000);
                } else if (config.currentRepetition === config.repetitions) {
                    // Pause longue
                    document.body.classList.remove('short-break');
                    (new Audio(longue)).play();
                    timeLeft = config.longBreakMinutes * 60;
                    config.timer = setInterval(() => {
                        timeLeft--;
                        const { minutes, seconds } = formatTime(timeLeft);
                        updateDisplay(minutes, seconds);
                        
                        if (timeLeft <= 0) {
                            clearInterval(config.timer);
                            resetTimer();
                        }
                    }, 1000);
                }
            }
        }, 1000);
    } else {
        // Pause
        clearInterval(config.timer);
        config.isRunning = false;
        startButton.textContent = 'Reprendre';
    }
}

// Réinitialisation du timer
function resetTimer() {
    clearInterval(config.timer);
    config.isRunning = false;
    config.currentRepetition = 0;
    startButton.textContent = 'Démarrer';
    document.body.classList.remove('short-break');
    updateConfig();
    updateDisplay(config.workMinutes, 0);
    updateProgress();
}

// Événements
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
configButton.addEventListener('click', toggleConfig);

// Événements de configuration
workMinutesInput.addEventListener('input', updateConfig);
shortBreakMinutesInput.addEventListener('input', updateConfig);
longBreakMinutesInput.addEventListener('input', updateConfig);
repetitionsInput.addEventListener('input', updateConfig);

// Initialisation
updateConfig();
updateDisplay(config.workMinutes, 0);
updateProgress();
