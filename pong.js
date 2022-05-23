//Declaraciones
const FRAME_PER_SECOND = 50;
const COMPUTER_LEVEL = 0.1;

const NUM_BALL = 5;

const BG_COLOR = 'BLACK';

const FONT_COLOR = '#33FF51';
const FONT_SIZE = '45px';
const FONT_FAMILY = 'impact';

const PADDLE_RIGHT_COLOR = '#33FF51';
const PADDLE_LEFT_COLOR = '#33FF51';
const PADDLE_WIDTH = '20';
const PADDLE_HEIGHT = '100';

const BALL_COLOR = 'WHITE';
const BALL_RADIUS = '10';
const BALL_DELTA_VELOCITY = 0.5;
const BALL_VELOCITY = 5;

const NET_COLOR = '#33FF51';
const NET_WIDTH = 4;
const NET_HEIGHT = 10;
const NET_PADDING = 15;

//Recuperamos el canvas
const cvs = document.getElementById('pong_canvas');
const ctx = cvs.getContext('2d');

//Objetos del juego - vamos a hacerlo con JSONs pero habría que hacerlo con clases
const playerA = {
    x: 0,
    y: cvs.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_LEFT_COLOR,
    score: 0
}

const playerB = {
    x: cvs.width - PADDLE_WIDTH,
    y: cvs.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PADDLE_RIGHT_COLOR,
    score: 0
}

const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: BALL_RADIUS,
    speed: BALL_VELOCITY,
    velocityX: BALL_VELOCITY,
    velocityY: BALL_VELOCITY,
    color: BALL_COLOR
}

const net = {
    x: cvs.width / 2 - NET_WIDTH / 2,
    y: 0,
    width: NET_WIDTH,
    height: NET_HEIGHT,
    padding: NET_PADDING,
    color: NET_COLOR
}

//Definimos los jugadores
let localPlayer;
let computer;

localPlayer = playerA;
computer = playerB;

//Canvas Helpers ---------------------------------------------------------
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color=FONT_COLOR, fontSize=FONT_SIZE, fontFamily=FONT_FAMILY) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.fillText(text, x, y);
}

//Pong Helpers -----------------------------------------------------------
function clearCanvas() {
    drawRect(0, 0, cvs.width, cvs.height, BG_COLOR);
}

function drawNet() {
    for(let i = 0; i <= cvs.height; i += net.padding) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawScore() {
    drawText(localPlayer.score, 1 * cvs.width / 4, cvs.height / 6);
    drawText(computer.score, 3 * cvs.width / 4, cvs.height / 6);

}

function drawPaddle(paddle) {
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
}

function drawBall() {
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//Play Helpers -----------------------------------------------------------
function update() {
    console.log('Actualizando...');
}

function render() {
    clearCanvas();
    drawNet();
    drawScore();
    drawPaddle(localPlayer);
    drawPaddle(computer);
    drawBall();
}

function gameLoop() {
    update();
    render();
}

function initGameLoop() {
    setInterval(gameLoop, 1000/FRAME_PER_SECOND);
}

function play() {
    initGameLoop();
}

play();