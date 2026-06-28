// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas sizing
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const aspectRatio = 400 / 800;
    
    canvas.width = maxWidth;
    canvas.height = maxWidth * aspectRatio;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: -5,
    dy: -5,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mobile button controls
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

let upPressed = false;
let downPressed = false;

upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    upPressed = true;
});

upBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    upPressed = false;
});

upBtn.addEventListener('mousedown', () => {
    upPressed = true;
});

upBtn.addEventListener('mouseup', () => {
    upPressed = false;
});

downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    downPressed = true;
});

downBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    downPressed = false;
});

downBtn.addEventListener('mousedown', () => {
    downPressed = true;
});

downBtn.addEventListener('mouseup', () => {
    downPressed = false;
});

// Mouse movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Smooth mouse control
    if (mouseY - paddleHeight / 2 < player.y) {
        player.dy = -player.speed;
    } else if (mouseY - paddleHeight / 2 > player.y) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }
});

// Touch control for direct canvas touch
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchY = touch.clientY - rect.top;
    
    // Smooth touch control
    if (touchY - paddleHeight / 2 < player.y) {
        player.dy = -player.speed;
    } else if (touchY - paddleHeight / 2 > player.y) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    player.dy = 0;
});

// Arrow key control
function handleArrowKeys() {
    if (keys['ArrowUp'] || upPressed) {
        player.dy = -player.speed;
    } else if (keys['ArrowDown'] || downPressed) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }
}

// Update player position
function updatePlayer() {
    handleArrowKeys();
    
    player.y += player.dy;
    
    // Boundary collision
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Computer AI
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    
    if (computerCenter < ball.y - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ball.y + 35) {
        computer.y -= computer.speed;
    }
    
    // Boundary collision
    if (computer.y < 0) {
        computer.y = 0;
    }
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom wall collision
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.size, Math.min(canvas.height - ball.size, ball.y));
    }
    
    // Paddle collision detection
    checkPaddleCollision(player);
    checkPaddleCollision(computer);
    
    // Score points
    if (ball.x - ball.size < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Paddle collision detection
function checkPaddleCollision(paddle) {
    if (
        ball.x - ball.size < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y - ball.size < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    ) {
        // Collision detected
        ball.dx = -ball.dx;
        
        // Add spin based on where ball hits paddle
        const collidePoint = ball.y - (paddle.y + paddle.height / 2);
        collidePoint < 0 ? ball.dy -= 2 : ball.dy += 2;
        
        // Ensure ball doesn't get stuck
        ball.x = paddle === player ? paddle.x + paddle.width + ball.size : paddle.x - ball.size;
        
        // Increase speed slightly
        ball.dx *= 1.05;
        ball.dy *= 1.05;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 4;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw game objects
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateComputer();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game
document.getElementById('resetBtn').addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    resetBall();
});

// Start game
gameLoop();
