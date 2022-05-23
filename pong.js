//Recuperamos el canvas
const cvs = document.getElementById('pong_canvas');
const ctx = cvs.getContext('2d');

//Declaraciones
const FONT_COLOR = 'WHITE';
const FONT_SIZE = '45px';
const FONT_FAMILY = 'Impact';


//Canvas Helpers -------------------------------------
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

drawRect(0, 0, cvs.width, cvs.height, 'BLACK');
drawCircle(100, 90, 10, 'WHITE');
drawText('Saludos!!', 200, 200);