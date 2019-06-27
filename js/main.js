var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var ballSize = 10;
var audioBall = new Audio('break.mp3');
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 10;
var showingWinScreen = false;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
var bgReady = false;
//var bgImage = new Image();
//bgImage.onload = function () {
	//bgReady = true;
//};
//bgImage.src = "img/court.png";
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  canvasContext.font = "30px Arial";
  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
  canvas.addEventListener('mousedown', handleMouseClick);
  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
  });
}
function ballReset() {
  if (player1Score >= WINNING_SCORE ||
    player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}
function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}
function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX < 0) {
    if (ballY > paddle1Y &&
      ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      audioBall.play(); //audio
      //
      var deltaY = ballY -
        (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }



  if (ballX > canvas.width) {
    if (ballY > paddle2Y &&
      ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      audioBall.play(); //audio
      //
      var deltaY = ballY -
        (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }




  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}
function drawEverything() {
  // next line blanks out th escreen with green.
//if (bgReady) {
	//	ctx.drawImage(bgImage, 0, 0);
	//}
	
   colorRect(0, 0, canvas.width, canvas.height, 'green');
  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("You Won!", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("You didn't win. Try again.", 250, 200);
    }
    canvasContext.fillStyle = '#adff2f';
    canvasContext.fillText("click to continue", 300, 500);
    return;
  }
  drawNet();
  // this is LEFT player paddle.
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'black');
  // this is RIGHT computer paddle.
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
  // next line draws the ball.
  colorCircle(ballX, ballY, ballSize, 'white');
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
