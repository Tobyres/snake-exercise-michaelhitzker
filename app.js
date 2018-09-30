const SIZE = 10;

var ansi = require("ansi");
var cursor = ansi(process.stdout);
var keypress = require("keypress");
keypress(process.stdin);

process.stdin.setRawMode(true);
process.stdin.resume();

var board = new Array(SIZE);
var snakePosX,snakePosY;
var foodPosX, foodPosY;

makeArray2D();

initBoard();
addKeyListener();
drawBoard();

function addKeyListener(){
  process.stdin.on("keypress", function(ch,key){
    //console.log(key);
    if(key && key.ctrl && key.name=="c"){
      process.stdin.pause();
    }
    if(key && key.name=="up"){
      moveUp();
    }

    if(key && key.name=="down"){
      moveDown();
    }

    if(key && key.name=="left"){
      moveLeft();
    }

    if(key && key.name=="right"){
      moveRight();
    }
  })
}

function moveSnake(newX,newY){
  console.log(newX+", "+newY);
  console.log(snakePosX, snakePosY);
  board[snakePosY][snakePosX]="";
  board[newY][newX]="Snake";
  snakePosX = newX;
  snakePosY = newY;
  drawBoard();
}

function moveUp() {
  var newY = snakePosY-1;
  if(newY<0){
    gameOver();
  }
  moveSnake(snakePosX,newY);
}

function moveDown() {
  var newY = snakePosY+1;
  if(newY>=SIZE){
    gameOver();
  }
  moveSnake(snakePosX,newY);
}

function moveLeft() {
  var newX = snakePosX-1;
  if(newX<0){
    gameOver();
  }
  moveSnake(newX,snakePosY);
}

function moveRight() {
  var newX = snakePosX+1;
  if(newX>=SIZE*2){
    gameOver();
  }
  moveSnake(newX,snakePosY);
}

function makeArray2D() {
  for (var i = 0; i < board.length; i++) {
    board[i] = new Array(SIZE);
  }
}

function initBoard() {
  snakePosX = randomInt(0, SIZE);
  snakePosY = randomInt(0, SIZE);

  do {
    foodPosX = randomInt(0, SIZE);
    foodPosY = randomInt(0, SIZE);
  } while (foodPosX === snakePosX || foodPosY === snakePosY);

  board[snakePosY][snakePosX] = "Snake";
  board[foodPosY][foodPosX] = "Food";

}

function gameOver(){
  var textLength = " Game over ".length;
  if(textLength%2 == 0){
    var whitePaddingLeft = SIZE-(textLength)/2;
    var whitePaddingRight = whitePaddingLeft;
  }else{
    var whitePaddingLeft = SIZE-(textLength-1)/2-1;
    var whitePaddingRight = (SIZE*2-textLength-whitePaddingLeft)-1;
  }
  for(var i= 0; i<SIZE; i++){
    if((SIZE%2==0 && i== SIZE/2) || (SIZE%2 == 1 && i == (SIZE-1)/2)){
      for(var j = 0; j<whitePaddingLeft; j++){
        drawFigures(i, j);
      }

      cursor.red()
          .bg.grey()
          .write(" Game  Over ")
          .bg.reset();

      for(var j = 0; j<whitePaddingRight; j++){
        drawFigures(i, j);
      }
    }else{
      for(var j = 0; j<SIZE*2; j++){
        drawFigures(i, j);
      }
    }
    cursor.write("\n");
  }
  cursor.reset();
  cursor.write("\n");
  process.exit();
}

function randomInt(min, max) {
  max--;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBoard() {
  process.stdout.write('\x1Bc');
  for (var i = 0; i < SIZE; i++) {
    for (var j = 0; j < SIZE*2; j++) {//to make it square
      drawFigures(i, j);
    }
    cursor.write("\n");
  }

  cursor.reset();
  cursor.write("\n");
}

function drawFigures(i, j){
  if (board[i][j] === "Snake") {
    cursor.bg.green().write(" ");
  } else if (board[i][j] === "Food") {
    cursor.bg.red().write(" "); 
  } else {
    cursor.bg.white().write(" "); 
  }
}