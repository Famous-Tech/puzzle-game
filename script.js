document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const modeSelector = document.getElementById('mode-selector');
    const sizeSelector = document.getElementById('size-selector');
    const puzzleArea = document.getElementById('puzzle-area');
    const timerDisplay = document.getElementById('timer');
    const bestTimeDisplay = document.getElementById('best-time');
    const saveGameBtn = document.getElementById('save-game');
    const loadGameBtn = document.getElementById('load-game');

    let timer;
    let timeLimit = 0;
    let bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || {};

    settingsBtn.addEventListener('click', () => {
        settingsMenu.classList.toggle('hidden');
    });

    modeSelector.addEventListener('change', setupGame);
    sizeSelector.addEventListener('change', setupGame);

    saveGameBtn.addEventListener('click', saveGame);
    loadGameBtn.addEventListener('click', loadGame);

    function setupGame() {
        const mode = modeSelector.value;
        const size = parseInt(sizeSelector.value);
        timeLimit = size * 30; // Exemple de temps limité basé sur la taille du puzzle
        createPuzzle(mode, size);
        startTimer();
        updateBestTime(mode, size);
    }

    function createPuzzle(mode, size) {
        puzzleArea.innerHTML = '';
        puzzleArea.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            if (mode === 'images') {
                piece.style.backgroundImage = `url('images/image-${i + 1}.jpg')`; // Remplacez 'images/image-${i + 1}.jpg' par le chemin de vos images
                piece.style.backgroundSize = 'cover';
            } else if (mode === 'mots') {
                const mots = ['Hacker', 'Code', 'Cyber', 'Secure', 'Data', 'Firewall', 'Virus', 'Encrypt'];
                piece.textContent = mots[i % mots.length];
            } else {
                piece.textContent = i + 1;
            }
            puzzleArea.appendChild(piece);
        }
    }

    function startTimer() {
        let seconds = 0;
        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            const minutesDisplay = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secondsDisplay = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `Temps: ${minutesDisplay}:${secondsDisplay}`;
            if (seconds >= timeLimit) {
                clearInterval(timer);
                checkBestTime(seconds);
                alert('Temps écoulé!');
            }
        }, 1000);
    }

    function checkBestTime(seconds) {
        const mode = modeSelector.value;
        const size = sizeSelector.value;
        const key = `${mode}-${size}`;
        const bestTime = bestTimes[key];
        if (!bestTime || seconds < bestTime) {
            bestTimes[key] = seconds;
            localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
            updateBestTime(mode, size);
        }
    }

    function updateBestTime(mode, size) {
        const key = `${mode}-${size}`;
        const bestTime = bestTimes[key];
        if (bestTime) {
            const minutesDisplay = Math.floor(bestTime / 60).toString().padStart(2, '0');
            const secondsDisplay = (bestTime % 60).toString().padStart(2, '0');
            bestTimeDisplay.textContent = `Meilleur Temps: ${minutesDisplay}:${secondsDisplay}`;
        } else {
            bestTimeDisplay.textContent = 'Meilleur Temps: N/A';
        }
    }

    function saveGame() {
        const gameState = {
            mode: modeSelector.value,
            size: sizeSelector.value,
            time: timerDisplay.textContent
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    function loadGame() {
        const gameState = JSON.parse(localStorage.getItem('gameState'));
        if (gameState) {
            modeSelector.value = gameState.mode;
            sizeSelector.value = gameState.size;
            timerDisplay.textContent = gameState.time;
            setupGame();
        }
    }

    setupGame();
});
