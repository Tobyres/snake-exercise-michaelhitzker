const ansi = require("ansi");
const keypress = require("keypress");

const HEIGHT = 11;
const WIDTH = 20;
const GAME_OVER_TEXT = " Game  Over ";

var cursor = ansi(process.stdout);

keypress(process.stdin);

process.stdin.setRawMode(true);
process.stdin.resume();

var snakePosX, snakePosY;
var foodPosX, foodPosY = 0;
var movingDirection = 1 //0=up, 1=right, 2=down, 3=left

var points = 0;
var speed = 1;

addKeyListener();
drawEmptyBoard();
initBoard();
autoMove();

function addKeyListener() {
  process.stdin.on("keypress", function (ch, key) {
    //console.log(key);
    if (key && key.ctrl && key.name == "c") {
      process.stdin.pause();
      process.exit();
    }
    if (key && key.name == "up") {
      movingDirection = 0;
    }

    if (key && key.name == "down") {
      movingDirection = 2;
    }

    if (key && key.name == "left") {
      movingDirection = 3;
    }

    if (key && key.name == "right") {
      movingDirection = 1;
    }
  })
}

function generateApple(){
  do {
    foodPosX = randomInt(0, HEIGHT);
    foodPosY = randomInt(0, HEIGHT);

  } while (foodPosX === snakePosX || foodPosY === snakePosY);
  cursor.goto(foodPosX+2, foodPosY+2).bg.red().write(" ").reset();
}

function moveSnake(newX, newY) {
  //console.log(newX + ", " + newY);
  //console.log(snakePosX, snakePosY);
  cursor.goto(snakePosX+2, snakePosY+2).bg.white().write(" ").reset();;
  cursor.goto(newX+2, newY+2).bg.green().write(" ").reset();;
  cursor.reset();
  snakePosX = newX;
  snakePosY = newY;
  checkGotPoint();
  drawPoints();
  sleep();
  // drawBoard();
}

function checkGotPoint(){
  if(snakePosX === foodPosX && snakePosY === foodPosY){
    points++;
    speed++;
    generateApple();
  }
}

function moveUp() {
  movingDirection = 0;
  var newY = snakePosY - 1;
  if (newY < 0) {
    gameOver();
  }
  moveSnake(snakePosX, newY);
}

function moveDown() {
  movingDirection = 2;
  var newY = snakePosY + 1;
  if (newY >= HEIGHT) {
    gameOver();
  }
  moveSnake(snakePosX, newY);
}

function moveLeft() {
  movingDirection = 3;
  var newX = snakePosX - 1;
  if (newX < 0) {
    gameOver();
  }
  moveSnake(newX, snakePosY);
}

function moveRight() {
  movingDirection = 1;
  var newX = snakePosX + 1;
  if (newX >= WIDTH) {
    gameOver();
  }
  moveSnake(newX, snakePosY);
}

function initBoard() {
  snakePosX = WIDTH/2;
  snakePosY = HEIGHT/2;

  snakePosX = Math.round(snakePosX );
  snakePosY = Math.round(snakePosY);

  generateApple();
}

function gameOver() {
  isGameOver = true;
  clearScreen();

  var whitePaddingLeft = 0
  var whitePaddingRight = 0;

  var textLength = GAME_OVER_TEXT.length;
  if (textLength % 2 === 0) {
    whitePaddingLeft = WIDTH / 2 - (textLength) / 2;
    whitePaddingRight = whitePaddingLeft;
  } else {
    whitePaddingLeft = WIDTH / 2 - (textLength) / 2 - 0.5;
    whitePaddingRight = whitePaddingLeft + 1;
  }

  cursor.reset();
  drawGreyLine();

  for (var i = 0; i < HEIGHT; i++) {
    drawGreyBG();
    if ((HEIGHT % 2 == 0 && i == HEIGHT / 2) || (HEIGHT % 2 == 1 && i == (HEIGHT - 1) / 2)) { //The middle

      drawWhitePadding(i, whitePaddingLeft);

      cursor.red()
        .bg.grey()
        .write(GAME_OVER_TEXT)
        .bg.reset();

      drawWhitePadding(i, whitePaddingRight);
    } else {
      drawBoardLine();
    }
    drawGreyBG();
    breakLine();
  }

  drawGreyLine();

  breakLine();
  cursor.reset();
  breakLine();

  drawPoints();

  process.exit();
}

function drawBoardLine() {
  for (var j = 0; j < WIDTH; j++) {
    cursor.bg.white().write(" ").reset();
  }
}

function drawWhitePadding(i, padding) {
  for (var j = 0; j < padding; j++) {
    cursor.bg.white().write(" ").reset();
  }
}

function breakLine() {
  cursor.write("\n");
}

function drawGreyBG() {
  cursor.bg.grey().write(" ");
}

function drawGreyLine() {
  for (var j = 0; j < WIDTH + 2; j++) {
    drawGreyBG();
  }
  breakLine();
}

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function randomInt(min, max) {
  max--;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawPoints(){
  cursor.goto(0, HEIGHT+3);
  cursor.reset();
  cursor.white().write("Points: "+points);
  breakLine();
  cursor.white().write("Speed: "+speed);
}

function drawEmptyBoard() {
  clearScreen();
  drawGreyLine();
  for (var i = 0; i < HEIGHT; i++) {
    drawGreyBG();
    drawBoardLine();
    drawGreyBG();
    breakLine();
  }
  drawGreyLine();
  cursor.reset();
  breakLine();
  drawPoints();
}

function autoMove(){
  switch (movingDirection) {
    case 0: moveUp(); break;
    case 1: moveRight(); break;
    case 2: moveDown(); break;
    case 3: moveLeft(); break;
  }
}

function sleep(){
  setTimeout(autoMove, 1000/speed);
}