let clicks = 0;
let level = 0;
let phase = 0;
let totalBits = 0;
let totalTQ = 0;
let energy = 100;
let isPlaying = false;
let isCoolingDown = false;
let lastClickTime = Date.now();
let hearts = 0;
let maxBitsPerDay = 800;
let bitsCollectedToday = 0;
let invitedFriendsBits = 0; // Total bits collected by invited friends
let infiniteEnergy = false;
let doublePower = false;
let quadPower = false;

const bitsPerTQ = 150;

const wall = document.getElementById('wall');
const gridContainer = document.getElementById('grid-container');
const progressBar = document.getElementById('progress-bar');
const totalBitsDisplay = document.getElementById('total-bits');
const totalTQDisplay = document.getElementById('total-tq');
const messageDisplay = document.getElementById('message');
const countdownDisplay = document.getElementById('countdown');
const energyBar = document.getElementById('energy-bar');
const blurOverlay = document.getElementById('blur-overlay');
const gridWall = document.getElementById('grid-wall');
const buttonContainer = document.getElementById('button-container');
const heartsContainer = document.getElementById('hearts-container');

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
    '1 Bit 2 Bit 4 Bit BREAK THE WALL', 'You are only responsible for your intentions. Now BREAK THE WALL!', 'Stop Reading. Start breaking!', 'Take a Break. Sorry.'
];

function updateWall() {
    const svgFile = wallSequences[phase % wallSequences.length][level];
    wall.innerHTML = `<img src="${svgFile}" class="wall-svg" />`;
    const svgElement = wall.querySelector('.wall-svg');
    svgElement.style.width = '100%';
    svgElement.style.height = '100%';
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
        energyBar.style.backgroundColor = '#3EB85F';
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
    const fontSize = Math.random() > 0.5 ? '24px' : '36px';
    messageDisplay.style.fontSize = fontSize;
    messageDisplay.innerHTML = `<img src="SVG/eye.svg" class="icon" /> ${message}`;
}

function updateTotalBits() {
    totalBitsDisplay.textContent = `Total Bits: ${totalBits}`;
}

function updateTotalTQ() {
    totalTQDisplay.textContent = `$TQ: ${totalTQ}`;
    totalTQDisplay.classList.add('enlarge');
    setTimeout(() => {
        totalTQDisplay.classList.remove('enlarge');
    }, 500);
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
    let cooldown = 16;
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
    alert('Invite a friend and both of you will receive a heart. This heart will increase your bit limit for the day!');
    // Implementation of invite logic here
}

function initialize() {
    wall.addEventListener('click', () => {
        if (!isPlaying || isCoolingDown) return;
        if (bitsCollectedToday >= maxBitsPerDay) {
            alert("You've reached the maximum bits you can collect today.");
            return;
        }

        let bitsPerClick = 1;
        if (doublePower) bitsPerClick *= 2;
        if (quadPower) bitsPerClick *= 4;

        totalBits += bitsPerClick;
        bitsCollectedToday += bitsPerClick;
        if (totalBits >= bitsPerTQ * (totalTQ + 1)) {
            totalTQ += 1;
            updateTotalTQ();
        }
        updateTotalBits();

        if (!infiniteEnergy) {
            energy -= 1;
            if (energy <= 0) {
                shakeAndBlur();
                startCooldownTimer();
            }
        }

        clicks++;
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
                if (hearts > 0) {
                    hearts--;
                    updateHearts();
                }
            }
        }
        if (gridContainer.children.length < 100) {
            addBit();
        }
        updateWall();
        updateProgressBar();
    });

    startCountdown();
    setInterval(replenishEnergy, 1000);
    resetWall();
    updateHearts();
}

function inviteFriend() {
    if (hearts < 3) {
        hearts++;
        updateHearts();
        alert('Friend invited! You have received a heart.');
    } else {
        alert('You already have the maximum number of hearts.');
    }
}

function startGame() {
    startCountdown();
    buttonContainer.style.display = 'none';
}

function selectPowerUp(powerUp) {
    switch (powerUp) {
        case 'InfiniteEnergy':
            infiniteEnergy = !infiniteEnergy;
            break;
        case 'DoublePower':
            doublePower = !doublePower;
            break;
        case 'QuadPower':
            quadPower = !quadPower;
            break;
        case 'TriplePowerUp':
            infiniteEnergy = true;
            doublePower = true;
            quadPower = true;
            break;
    }
    closeModal('quest-modal');
}

// Mock leaderboard data
const mockLeaderboard = [
    { name: "Player1", bits: 1200 },
    { name: "Player2", bits: 1100 },
    { name: "Player3", bits: 1050 },
    { name: "Player4", bits: 1000 },
    { name: "Player5", bits: 950 },
];

// Function to populate mock leaderboard
function populateLeaderboard() {
    const dailyLeaderboard = document.getElementById('daily-leaderboard');
    const allTimeLeaderboard = document.getElementById('all-time-leaderboard');
    dailyLeaderboard.innerHTML = '';
    allTimeLeaderboard.innerHTML = '';
    mockLeaderboard.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('leaderboard-user');
        playerElement.textContent = `${player.name}: ${player.bits} bits`;
        dailyLeaderboard.appendChild(playerElement);
        allTimeLeaderboard.appendChild(playerElement.cloneNode(true));
    });
}

// Mock squad data
const mockSquadData = {
    alphaquesters: { total: 12000, members: mockLeaderboard },
    hamsters: { total: 11000, members: mockLeaderboard },
    nothing: { total: 10500, members: mockLeaderboard },
    stonfi: { total: 10000, members: mockLeaderboard },
    evaa: { total: 9500, members: mockLeaderboard },
};

// Function to populate mock squads
function populateSquads() {
    Object.keys(mockSquadData).forEach(squad => {
        const squadContainer = document.getElementById(`${squad}-leaderboard`);
        squadContainer.innerHTML = '';
        mockSquadData[squad].members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.classList.add('leaderboard-user');
            memberElement.textContent = `${member.name}: ${member.bits} bits`;
            squadContainer.appendChild(memberElement);
        });
        document.getElementById(`${squad}-total`).textContent = mockSquadData[squad].total;
    });
}

populateLeaderboard();
populateSquads();
updateWall();
updateProgressBar();
updateTotalBits();
initialize();
