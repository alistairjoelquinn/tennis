const canvas = document.getElementById('pingpong');
const ctx = canvas.getContext('2d');

const user = {
    x: 0,
    y: canvas.height/2 - 50,
    width: 10,
    height: 100,
    color: 'WHITE',
    score: 0
}

const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 50,
    width: 10,
    height: 100,
    color: 'WHITE',
    score: 0
}

const net = {
    x: canvas.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: 'WHITE',
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE'
}

const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

const drawCircle = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

const drawText = (text, x, y, color) => {
    ctx.fillStyle = color;
    ctx.font = '75px serif';
    ctx.fillText(text, x, y);
}

const drawNet = () => {
    for (let i = 0; i <= canvas.height; i+=15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

const collision = (b, p) => {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : com;
    if(collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
    }
}

const render = () => {
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    drawText(user.score, canvas.width/4, canvas.width/5, "WHITE");
    drawText(com.score, 3*canvas.width/4, canvas.width/5, "WHITE");
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

const game = () => {
    update();
    render();
    requestAnimationFrame(game);
}

game();