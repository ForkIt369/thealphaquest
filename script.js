let clicks = 0;
let level = 0;
let phase = 0;
let totalBits = 0;
let energy = 100;
let isPlaying = false;
let isCoolingDown = false;
let lastClickTime = Date.now();
const wall = document.getElementById('wall');
const gridContainer = document.getElementById('grid-container');
const progressBar = document.getElementById('progress-bar');
const totalBitsDisplay = document.getElementById('total-bits');
const messageDisplay = document.getElementById('message');
const countdownDisplay = document.getElementById('countdown');
const energyBar = document.getElementById('energy-bar');
const blurOverlay = document.getElementById('blur-overlay');
const gridWall = document.getElementById('grid-wall');
const buttonContainer = document.getElementById('button-container');

const wallSequences = [
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg']
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
    'There you go!!',
    'Break it!',
    'BIT BY BIT!',
    'Every BIT Helps!',
    'Break …..the …WALLLLLL!!!',
    'There time to think and theres a time to BREAK',
    'Feels good right?',
    'HINT! Complete Quests to make this easier.',
    'I\'m running out of motivation quotes',
    'I think you enjoying this too much.',
    'Damn..your really going for it.',
    'HINT! Synergize with Friend and 10x your efforts.',
    'BREAK! BREAK! BREAK!',
    'Some like to Dance',
    'Some like to Sing',
    'We like to BREAK',
    'Not your first time is it?',
    'BIT BY BIT!'
];

function updateWall() {
    const svgFile = wallSequences[phase % wallSequences.length][level];
    wall.innerHTML = `<img src="${svgFile}" class="wall-svg" />`;
    const svgElement = wall.querySelector('.wall-svg');
    svgElement.style.width = '100%'; // Ensure it fills the container
    svgElement.style.height = '100%'; // Ensure it fills the container
    if (phase >= 4) {
        svgElement.style.fill = phase % 6 === 4 ? '#AD00FF' : '#00FF7F'; // Update color based on phase
    }
}

function updateProgressBar() {
    const totalClicksNeeded = clicksNeededSequences[phase % clicksNeededSequences.length][clicksNeededSequences[phase % clicksNeededSequences.length].length - 1];
    const progress = (clicks / totalClicksNeeded) * 100;
    progressBar.style.height = progress + '%';
    progressBar.style.backgroundColor = progressColors[phase % progressColors.length][level];
}

function updateEnergyBar() {
    energyBar.style.width = energy + '%';
    if (energy > 50) {
        energyBar.style.backgroundColor = '#00FF7F';
    } else if (energy > 20) {
        energyBar.style.backgroundColor = '#FE5F03';
    } else {
        energyBar.style.backgroundColor = '#FF0000';
    }
}

function addBit() {
    const bit = document.createElement('div');
    bit.classList.add('bit');
    gridContainer.appendChild(bit);
}

function removeWallBit() {
    if (gridWall.children.length > 0) {
        gridWall.removeChild(gridWall.children[0]);
    }
}

function resetWall() {
    gridWall.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const wallBit = document.createElement('div');
        wallBit.classList.add('bit', 'wall-bit');
        gridWall.appendChild(wallBit);
    }
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
        resetWall();
    }, 1000);
}

function showMotivationalMessage() {
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    const fontSize = Math.random() > 0.5 ? '24px' : '36px'; // Randomly larger font size
    messageDisplay.style.fontSize = fontSize;
    messageDisplay.innerHTML = `<img src="SVG/eye.svg" class="icon" /> ${message}`;
}

function updateTotalBits() {
    totalBitsDisplay.textContent = `Total Bits: ${totalBits}`;
}

function startCountdown() {
    const countdownMessages = ['Are', 'You', 'Ready', 'to', 'BREAK!'];
    let countdown = countdownMessages.length;
    countdownDisplay.innerHTML = `<img src="SVG/teach.svg" class="icon" /> ${countdownMessages[countdownMessages.length - countdown]}`;
    buttonContainer.style.display = 'flex';
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.innerHTML = `<img src="SVG/teach.svg" class="icon" /> ${countdownMessages[countdownMessages.length - countdown]}`;
        } else {
            countdownDisplay.textContent = '';
            clearInterval(countdownInterval);
            buttonContainer.style.display = 'none';
            isPlaying = true;
        }
    }, 1000);
}

function startCooldownTimer() {
    isPlaying = false;
    isCoolingDown = true;
    let cooldown = 30;
    blurOverlay.style.display = 'block';
    countdownDisplay.textContent = `Cooldown: ${cooldown}s`;
    buttonContainer.style.display = 'flex';
    const cooldownInterval = setInterval(() => {
        cooldown--;
        countdownDisplay.textContent = `Cooldown: ${cooldown}s`;
        if (cooldown <= 0) {
            clearInterval(cooldownInterval);
            countdownDisplay.textContent = '';
            blurOverlay.style.display = 'none';
            buttonContainer.style.display = 'none';
            isCoolingDown = false;
            startCountdown();
        }
    }, 1000);
}

function shakeAndBlur() {
    const gameElement = document.getElementById('game');
    gameElement.classList.add('shake');
    blurOverlay.style.display = 'block';
    setTimeout(() => {
        gameElement.classList.remove('shake');
        blurOverlay.style.display = 'none';
    }, 3000);
}

function replenishEnergy() {
    const now = Date.now();
    const timeSinceLastClick = (now - lastClickTime) / 1000;

    if (timeSinceLastClick > 1 && energy < 100) {
        let replenishRate = 1;
        if (timeSinceLastClick > 4) replenishRate = 4;
        if (timeSinceLastClick > 8) replenishRate = 8;

        energy = Math.min(100, energy + replenishRate);
        updateEnergyBar();
    }
}

function initialize() {
    wall.addEventListener('click', () => {
        if (!isPlaying || isCoolingDown) return;
        clicks++;
        totalBits++;
        energy--;
        lastClickTime = Date.now();
        updateEnergyBar();
        removeWallBit();
        if (clicks > clicksNeededSequences[phase % clicksNeededSequences.length][level]) {
            showMotivationalMessage();
            clicks = 0;
            level++;
            if (level >= wallSequences[phase % wallSequences.length].length) {
                explodeBits();
                level = 0;
                phase++;
            }
        }
        if (energy <= 0) {
            shakeAndBlur();
            startCooldownTimer();
        }
        if (gridContainer.children.length < 100) {
            addBit();
        }
        updateWall();
        updateProgressBar();
        updateTotalBits();
    });

    // Initially start the countdown
    startCountdown();

    // Replenish energy every second
    setInterval(replenishEnergy, 1000);

    // Initialize the wall grid
    resetWall();
}

updateWall();
updateProgressBar();
updateTotalBits();
initialize();
