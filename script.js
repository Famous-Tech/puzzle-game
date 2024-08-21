// script pour le site
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



    async function createPuzzle(mode, size) {

        puzzleArea.innerHTML = '';

        puzzleArea.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        puzzleArea.style.gridTemplateRows = `repeat(${size}, 1fr)`;



        const imagePath = await selectRandomImage();

        const pieces = await cutImageIntoPieces(imagePath, size);



        pieces.forEach(piece => {

            puzzleArea.appendChild(piece);

        });



        enableDragAndDrop();

    }



    async function selectRandomImage() {

        const images = [

            '/images/image-1.jpg',

            '/images/image-2.jpg',

            '/images/image-3.jpg'

        ];

        const randomIndex = Math.floor(Math.random() * images.length);

        return images[randomIndex];

    }



    async function cutImageIntoPieces(imagePath, size) {

        const img = new Image();

        img.src = imagePath;

        await img.decode();



        const pieceWidth = img.width / size;

        const pieceHeight = img.height / size;



        const pieces = [];

        for (let row = 0; row < size; row++) {

            for (let col = 0; col < size; col++) {

                const canvas = document.createElement('canvas');

                canvas.width = pieceWidth;

                canvas.height = pieceHeight;

                const ctx = canvas.getContext('2d');



                ctx.drawImage(

                    img,

                    col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,

                    0, 0, pieceWidth, pieceHeight

                );



                const piece = document.createElement('div');

                piece.classList.add('puzzle-piece');

                piece.style.width = `${pieceWidth}px`;

                piece.style.height = `${pieceHeight}px`;

                piece.style.backgroundImage = `url(${canvas.toDataURL()})`;

                piece.draggable = true;



                pieces.push(piece);

            }

        }

        return pieces.sort(() => Math.random() - 0.5); // Shuffle pieces randomly

    }



    function enableDragAndDrop() {

        const pieces = document.querySelectorAll('.puzzle-piece');

        pieces.forEach(piece => {

            piece.addEventListener('dragstart', handleDragStart);

            piece.addEventListener('dragover', handleDragOver);

            piece.addEventListener('drop', handleDrop);

        });

    }



    function handleDragStart(event) {

        event.dataTransfer.setData('text/plain', event.target.style.backgroundImage);

        event.dataTransfer.effectAllowed = 'move';

        event.target.classList.add('dragging');

    }



    function handleDragOver(event) {

        event.preventDefault();

        event.dataTransfer.dropEffect = 'move';

    }



    function handleDrop(event) {

        event.preventDefault();

        const draggedImage = event.dataTransfer.getData('text/plain');

        const targetPiece = event.target;



        if (targetPiece.classList.contains('puzzle-piece')) {

            const temp = targetPiece.style.backgroundImage;

            targetPiece.style.backgroundImage = draggedImage;



            const draggingPiece = document.querySelector('.dragging');

            draggingPiece.style.backgroundImage = temp;

            draggingPiece.classList.remove('dragging');

        }

    }



    setupGame(); // Initialize game on page load

});
