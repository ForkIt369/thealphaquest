let clicks = 0;
let level = 0;
let phase = 0;  // Track the current phase
let totalBits = 0;
const wall = document.getElementById('wall');
const gridContainer = document.getElementById('grid-container');
const progressBar = document.getElementById('progress-bar');
const totalBitsDisplay = document.getElementById('total-bits');
const messageDisplay = document.getElementById('message');

const wallSequences = [
    ['1B3.png', '2B3.png', '4B3.png', '8B3.png'],
    ['8BIT.png', '16BIT.png', '32BIT.png', '64BIT.png']
];

const bitSequences = [
    ['1BW.png', '1BO.png', '1BP.png', '1BG.png'],
    ['1BW.png', '1BO.png', '1BP.png', '1BG.png']
];

const progressColors = [
    ['#FFF4E1', '#FE5F03', '#AD00FF', '#00FF7F'],
    ['#FFF4E1', '#FE5F03', '#AD00FF', '#00FF7F']
];

const clicksNeededSequences = [
    [1, 2, 4, 8],
    [8, 16, 32, 64]
];

const motivationalMessages = [
    'Keep going!',
    'Keep running up that hill!',
    'You got this!',
    'Almost there!',
    'Break through!',
    'Smash it!',
    'Great job!',
    'Keep it up!',
    'You\'re amazing!',
    'Fantastic effort!'
];

function updateWall() {
    wall.style.backgroundImage = `url(${wallSequences[phase][level]})`;
    wall.style.backgroundSize = 'cover';
}

function updateProgressBar() {
    const totalClicksNeeded = clicksNeededSequences[phase][clicksNeededSequences[phase].length - 1];
    const progress = (clicks / totalClicksNeeded) * 100;
    progressBar.style.height = progress + '%';
    progressBar.style.backgroundColor = progressColors[phase][level];
}

function addBit() {
    const bit = document.createElement('img');
    bit.src = bitSequences[phase][level];
    bit.classList.add('bit');
    gridContainer.appendChild(bit);
}

function explodeBits() {
    const bits = gridContainer.children;
    Array.from(bits).forEach(bit => {
        const x = Math.random() * window.innerWidth - window.innerWidth / 2;
        const y = Math.random() * window.innerHeight - window.innerHeight / 2;
        bit.style.transition = 'transform 1s, opacity 1s';
        bit.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg)`;
        bit.style.opacity = 0;
    });
    setTimeout(() => {
        gridContainer.innerHTML = '';
        showMotivationalMessage();
    }, 1000);
}

function showMotivationalMessage() {
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    messageDisplay.textContent = message;
}

function updateTotalBits() {
    totalBitsDisplay.textContent = `Total Bits: ${totalBits}`;
}

wall.addEventListener('click', () => {
    clicks++;
    totalBits++;
    if (clicks > clicksNeededSequences[phase][level]) {
        clicks = 0;
        level++;
        if (level >= bitSequences[phase].length) {
            explodeBits();
            level = 0;
            phase = (phase + 1) % wallSequences.length;
        }
    }
    if (gridContainer.children.length < 100) {
        addBit();
    }
    updateWall();
    updateProgressBar();
    updateTotalBits();
});

updateWall();
updateProgressBar();
updateTotalBits();
