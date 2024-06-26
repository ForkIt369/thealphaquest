let clicks = 0;
let level = 0;
let phase = 0;
let totalBits = 0;
let energy = 100;
let isPlaying = false;
let isCoolingDown = false;
let lastClickTime = Date.now();
let hearts = 3; // Initialize with 3 hearts
let selectedPowerUp = null;

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
const heartsContainer = document.getElementById('hearts-container');
const questsContainer = document.getElementById('quests');
const synergyBoardModal = document.getElementById('synergyboard-modal');
const inviteModal = document.getElementById('invite-modal');
const dailyLeaderboard = document.getElementById('daily-leaderboard');
const allTimeLeaderboard = document.getElementById('all-time-leaderboard');
const alphaquestersLeaderboard = document.getElementById('alphaquesters-leaderboard');
const hamstersLeaderboard = document.getElementById('hamsters-leaderboard');
const nothingLeaderboard = document.getElementById('nothing-leaderboard');
const stonfiLeaderboard = document.getElementById('stonfi-leaderboard');
const evaaLeaderboard = document.getElementById('evaa-leaderboard');
const stormLeaderboard = document.getElementById('storm-leaderboard');
const xircusLeaderboard = document.getElementById('xircus-leaderboard');
const dedustLeaderboard = document.getElementById('dedust-leaderboard');
const resistancedogsLeaderboard = document.getElementById('resistancedogs-leaderboard');
const bemoLeaderboard = document.getElementById('bemo-leaderboard');
const tonpunksLeaderboard = document.getElementById('tonpunks-leaderboard');

const wallSequences = [
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg'],
    ['SVG/human-run.svg', 'SVG/human-handsdown.svg', 'SVG/human.svg', 'SVG/human-handsup.svg']
];

const progressColors = [
    ['#FFF4E1', '#FE5F03', '#763AF2', '#3EB85F'],
    ['#FFF4E1', '#FE5F03', '#763AF2', '#3EB85F']
];

const clicksNeededSequences = [
    [1, 2, 4, 8],
    [8, 16, 32, 64]
];

const motivationalMessages = [
    'There you go!!', 'Break it!', 'BIT BY BIT!', 'It’s Yours!', 'Break …the ….WALLLLLL!!!',
    'There time to think and theres a time to BREAK', 'Feels good right?', 'I’m running out of motivation quotes',
    'What are the VC’s gonna think', 'Airdrops were so 2017', 'We ❤️ U Notcoin', 
    'Together we are probably something ❤️', 'Click with Every BIT you have!', 'I…want….AAALPPPHAA', 
    'Gimme gimme gimme', 'my cousins boyfriend got rich off doge', 'Where are my keys?', 
    'It took longer to deploy this than to make it.', 'BREAK THE WALLS!', 'GO GO GO GO!', 
    'We ❤️ U 🐹', 'I’ve got lines for daaays,,,,i hope.', 'want alpha. come geddit.', 
    'There’s Alpha juuuust around the corner..of the wall', 'yep', 
    'one elon musk rt away from breaking our servers', 'break the walls not our servers damn it', 
    'BREAK BREAK BREAK', 'Hiearchy -) Heterarchy -) Synarchy', 'Who want the alpha?Who? You?', 
    'You are the chosen one.', 'C\'mon admit it. This is what you always wanted to be when you grew up.', 
    'You think i will ever run out of anything to say.', 'AI generated text would have been easier ..but not as fun. n i luv typos',
    '100% Community mined. Keeping 1 for me though', 'This is the meta.', 
    'Use this to explain crypto to you friends', 'Take a ... BREAK BREAK BREAK', 
    'Synergy peeps synergy! We need to BREAK THIS WALL', 
    'I swear. This is what i wanted to be when i grew up', 'I want the bits. Nothing against the wall', 
    '$AQ $AQ $AQ or $TQ $TQ $TQ ?', 'So this is crypto huh?', 'Types of Capital Dot Com', 'Culture bro', 
    'Hurry up or we\'ll be here till WEB 7', 'Hey Elon ;)', 'It’s not about you. It’s about the WALL!!', 
    'wall wall wall wall break break break break', 
    'literally ai couldnt come up with this stuff', 'innovation is dead huh', 'how you like this chatgpt', 
    'thanks for the help though', 'seriously', 'oh the vibes', 'Play some classical music. break.',
    'Theres the wall. Theres you. One’s gotta go', 'what is mining', 
    'This is not a quest for points…this is a quest for ALPHA!', 'Every bit counts.', 
    'Keep breaking down that wall', 'You want Alpha right? BREAK THE WALLLLLLLL', 
    'come come come-break the wall', 'Synergy to bit share. It will take more than one!', 'Break n Chill', 
    'Power or Force? Both. BREAK!', 'thaats its..let it all out.', 
    'this is eithier stress relieving or gonna cause a riot', 'Money Decays. But Walls? They BREAK!', 
    'Where is the love? Where is the SYNERGY!', 'Is this real life or is this just fantasy?',
    'Keep breaking - i need to google some fun facts to keep you going.', 'Breaky breaky breaky breakfast', 
    'Once upon a time there was a wall. and then there wasnt.', 'Every BIT helps!', 
    '1 Bit 2 Bit 4 Bit BREAK THE WALL'
];

function updateWall() {
    const svgFile = wallSequences[phase % wallSequences.length][level];
    wall.innerHTML = `<img src="${svgFile}" class="wall-svg" />`;
    const svgElement = wall.querySelector('.wall-svg');
    svgElement.style.width = '100%'; // Ensure it fills the container
    svgElement.style.height = '100%'; // Ensure it fills the container
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
        energyBar.style.backgroundColor = '#3EB85F'; // Updated energy bar color for high energy
    } else if (energy > 20) {
        energyBar.style.backgroundColor = '#FE5F03'; // Updated energy bar color for medium energy
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
    let cooldown = 16; // Changed cooldown timer to 16 seconds
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
            buttonContainer.style.display = 'flex';
            isCoolingDown = false;
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

        if (!isPlaying && !isCoolingDown) {
            buttonContainer.style.display = 'flex';
        }
    }
}

function updateHearts() {
    heartsContainer.innerHTML = '';
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('img');
        heart.src = 'SVG/heartv.svg';
        heart.classList.add('heart');
        heartsContainer.appendChild(heart);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab-container .tab[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function showLeaderboard(leaderboardId) {
    document.querySelectorAll('.leaderboard-content').forEach(content => content.style.display = 'none');
    document.getElementById(leaderboardId).style.display = 'block';
    document.querySelectorAll('.tab-container .tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab-container .tab[onclick="showLeaderboard('${leaderboardId}')"]`).classList.add('active');
}

function showSquad(squadId) {
    document.querySelectorAll('.squad-content').forEach(squad => squad.style.display = 'none');
    document.getElementById(squadId).style.display = 'block';
    document.querySelectorAll('.tab-container .tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab-container .tab[onclick="showSquad('${squadId}')"]`).classList.add('active');
}

function showInviteLink() {
    openModal('invite-modal');
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
                hearts--; // Lose one heart per sequence
                updateHearts();
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

    // Initialize hearts
    updateHearts();

    // Initialize quests
    const quests = [
        {
            name: 'Daily Check-in',
            description: 'Check-in daily to receive a heart power-up.',
            reward: 'Heart Power-Up',
            action: () => {
                alert('You received a Heart Power-Up!');
                hearts = Math.min(hearts + 1, 12);
                updateHearts();
            }
        },
        {
            name: '7-Day Streak',
            description: 'Check-in 7 days in a row to receive a heart bonus.',
            reward: 'Heart Bonus',
            locked: true
        }
    ];

    quests.forEach(quest => {
        const questElement = document.createElement('div');
        questElement.classList.add('quest');
        questElement.innerHTML = `
            <div class="quest-name">${quest.name}</div>
            <div class="quest-bits">${quest.reward}</div>
        `;
        questElement.addEventListener('click', () => {
            if (quest.action && !quest.locked) {
                quest.action();
            } else if (quest.locked) {
                alert('This quest is locked.');
            }
        });
        questsContainer.appendChild(questElement);
    });

    // Initialize leaderboard
    const users = Array.from({ length: 40 }, (_, i) => `@user${i + 1}`);
    users.forEach((user, index) => {
        const bits = Math.floor(Math.random() * 1000 + 1);
        const synergyBits = Math.ceil(bits * 0.25);
        const userElement = document.createElement('div');
        userElement.classList.add('leaderboard-user');
        userElement.innerHTML = `
            <div class="user-name">${user}</div>
            <div class="earned-bits">${bits}</div>
            <div class="synergy-bits">${synergyBits}</div>
        `;
        dailyLeaderboard.appendChild(userElement);
        allTimeLeaderboard.appendChild(userElement.cloneNode(true));
    });

    // Initialize squads
    const squads = {
        alphaquesters: [],
        hamsters: [],
        nothing: [],
        stonfi: [],
        evaa: [],
        storm: [],
        xircus: [],
        dedust: [],
        resistancedogs: [],
        bemo: [],
        tonpunks: []
    };
    Object.keys(squads).forEach(squad => {
        squads[squad] = Array.from({ length: 100 }, (_, i) => ({
            user: `@${squad}_user${i + 1}`,
            bits: Math.floor(Math.random() * 1000 + 1)
        }));
    });

    Object.entries(squads).forEach(([squad, users]) => {
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('leaderboard-user');
            userElement.innerHTML = `
                <div class="user-name">${user.user}</div>
                <div class="earned-bits">${user.bits}</div>
                <div class="synergy-bits">${Math.ceil(user.bits * 0.25)}</div>
            `;
            document.getElementById(`${squad}-leaderboard`).appendChild(userElement);
        });
    });
}

function startGame() {
    startCountdown();
    buttonContainer.style.display = 'none';
}

function selectPowerUp(powerUp) {
    if (selectedPowerUp) {
        alert('You already have a power-up active.');
        return;
    }

    const powerUpDescription = {
        'DayDone': 'Collect all bits available for the day.',
        'Power': 'Increase power by 4 bits per click.',
        'Energy': 'No cooldowns for the day.',
        'NoSleep': 'Replenish all hearts for the day.'
    };

    const confirmPowerUp = confirm(`Are you sure you want to use the ${powerUp} power-up?\n\n${powerUpDescription[powerUp]}`);
    if (confirmPowerUp) {
        alert('You just powered up!');
        selectedPowerUp = powerUp;
        document.querySelectorAll('.power-up').forEach(pu => pu.classList.add('selected'));
    }
}

updateWall();
updateProgressBar();
updateTotalBits();
initialize();
