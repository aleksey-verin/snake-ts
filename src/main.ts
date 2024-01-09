import './style.css'

// Define HTML elements
const board = document.getElementById('game-board') as HTMLElement

// Define game variables
let snake: Array<Position> = [{ x: 10, y: 10 }]

type Position = {
  x: number
  y: number
}

// Draw game map, snake, food
function draw() {
  board.innerHTML = ''
  drawSnake()
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