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
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;

const BALL_COLOR = 'WHITE';
const BALL_RADIUS = 10;
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

function setPlayers() {
    localPlayer = playerA;
    computer = playerB;
}


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
function initPaddleMovement() {
    cvs.addEventListener('mousemove', updateLocalPlayerPos);
}

function updateLocalPlayerPos(event) {
    const rect = cvs.getBoundingClientRect();

    localPlayer.y = event.clientY - localPlayer.height / 2 - rect.top;
}

function pause(milliseconds) {
    stopGameLoop();
    setTimeout(() => {
        initGameLoop();
    }, milliseconds);
}

function newBall() {
    console.log('Tanto!');

    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;

    const direction = ball.velocityX > 0 ? -1 : 1;
    ball.velocityX = direction * BALL_VELOCITY;
    ball.velocityY = BALL_VELOCITY;
    ball.speed = BALL_VELOCITY;

    pause(500);
}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.top < p.bottom && b.left < p.right;
}

function updateComputer() {
    computer.y += (ball.y - (computer.y + computer.height / 2)) * COMPUTER_LEVEL;
}

function isGameOver() {
    return localPlayer.score >= NUM_BALL || computer.score >= NUM_BALL;
}

function update() {
    //Actualizamos la posición de la pelota
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    //Actualizamos la posición de nuestra IA
    updateComputer();

    //Si la pelota ha golpeado en los laterales, rebotará...
    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    //Comprobamos si la pelota choca contra una pala
    let whatPlayer = ball.x < cvs.width / 2 ? playerA : playerB;
    if(collision(ball, whatPlayer)) {
        //Calculamos el punto de colisión en la Y
        let collidePoint = ball.y - (whatPlayer.y + whatPlayer.height / 2);
        //Normalizamos el punto de colisión
        collidePoint = collidePoint / (whatPlayer.height / 2);
        //Calculamos el ángulo en radianes
        const angleRad = collidePoint * Math.PI / 4;
        //Calculamos la dirección x de la pelota
        const direction = (ball.x < cvs.width / 2) ? 1 : -1;
        //Modificamos la velocidad de la pelota
        ball.velocityX = ball.speed * Math.cos(angleRad) * direction;
        ball.velocityY = ball.speed * Math.sin(angleRad);
        //Cada vez que colisionan incrementamos la velocidad
        ball.speed += BALL_DELTA_VELOCITY;
    }
    //Actualizamos el marcador
    if(ball.x - ball.radius < 0) {
        computer.score++;
        newBall();
    } else if(ball.x + ball.radius > cvs.width) {
        localPlayer.score++;
        newBall();
    }
}

function render() {
    clearCanvas();
    drawNet();
    drawScore();
    drawPaddle(localPlayer);
    drawPaddle(computer);

    //Si hemos terminado la partida...
    if(isGameOver()) {
        endGame();
    } else {
        drawBall();
    }
}

function endGame() {
    console.log('Game Over');

    //Mostramos el final del juego
    drawText('GAME OVER', cvs.width / 3, cvs.height / 2, 'WHITE'); //esto habría que parametrizarlo arriba

    //Detenemos el bucle de juego
    stopGameLoop();
}

function gameLoop() {
    update();
    render();
}

let gameLoopId;

function stopGameLoop() {
    clearInterval(gameLoopId);
}

function initGameLoop() {
    gameLoopId = setInterval(gameLoop, 1000/FRAME_PER_SECOND);
}

function play() {
    setPlayers();
    initPaddleMovement();
    initGameLoop();
}

play();