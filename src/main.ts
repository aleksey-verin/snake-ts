import './style.css'

// Define HTML elements
const board = document.getElementById('game-board') as HTMLElement
const instructionText = document.getElementById('instruction-text') as HTMLElement;
const logo = document.getElementById('logo') as HTMLElement;
const score = document.getElementById('score') as HTMLElement;
const highScoreText = document.getElementById('highScore') as HTMLElement;

// Define game variables
const gridSize = 20;
let snake: Array<Position> = [{ x: 10, y: 10 }]
let food = generateFood();
let highScore = 0;
let direction: Direction = 'right';
let gameInterval: number | undefined;
let gameSpeedDelay = 200;
let gameStarted = false;


type Position = {
  x: number
  y: number
}

type Direction = 'up' | 'down' | 'left' | 'right'

// Draw game map, snake, food
function draw() {
  board.innerHTML = ''
  drawSnake()
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake')
    setPosition(snakeElement, segment)
    board.appendChild(snakeElement)
  })
}

// Create a snake or food cube/div
function createGameElement(tag: string, className: 'snake' | 'food') {
  const element = document.createElement(tag)
  element.className = className
  return element
}

// Set the position of snake or food
function setPosition(element: HTMLElement, position: Position) {
  element.style.gridColumn = String(position.x)
  element.style.gridRow = String(position.y)
}

// Testing draw function
draw();

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  if (snake.some((segment) => segment.x === x && segment.y === y)) {
    return generateFood();
  }
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head);

  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event: KeyboardEvent) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        if (direction === 'down') return;
        direction = 'up';
        break;
      case 'ArrowDown':
        if (direction === 'up') return;
        direction = 'down';
        break;
      case 'ArrowLeft':
        if (direction === 'right') return;
        direction = 'left';
        break;
      case 'ArrowRight':
        if (direction === 'left') return;
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}
