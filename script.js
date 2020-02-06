const canvas = document.getElementById('tennis');
let userScore = document.getElementById('user');
let computerScore = document.getElementById('computer');
const ctx = canvas.getContext('2d');

const user = {
    x: 0,
    y: canvas.height/2 - 50,
    width: 10,
    height: 100,
    color: 'brown',
    score: 0
}

const computer = {
    x: canvas.width - 10,
    y: canvas.height/2 - 50,
    width: 10,
    height: 100,
    color: 'brown',
    score: 0
}

const net = {
    x: canvas.width/2 - 2.5, 
    y: 0,
    width: 5,
    height: 15,
    color: 'darkslategrey',
}

const line1 = {
    x: canvas.width/4 - 1, 
    y: 0,
    width: 2,
    height: 15,
    color: 'white',
}

const line2 = {
    x: 3*(canvas.width/4) - 1, 
    y: 0,
    width: 2,
    height: 15,
    color: 'white',
}

const horizontal = {
    x: (canvas.width/4) - 1,
    y: canvas.height/2, 
    width: 500,
    height: 2,
    color: 'white',
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 10,
    velocityX: 10,
    velocityY: 10,
    color: 'yellow'
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
    ctx.stroke();
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

const drawLine1 = () => {
    for (let i = 0; i <= canvas.height; i+=15) {
        drawRect(line1.x, line1.y + i, line1.width, line1.height, line1.color);
    }
}

const drawLine2 = () => {
    for (let i = 0; i <= canvas.height; i+=15) {
        drawRect(line2.x, line2.y + i, line2.width, line2.height, line2.color);
    }
}

const drawHorizontal = () => {
    drawRect(horizontal.x, horizontal.y, horizontal.width, horizontal.height, horizontal.color);
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

const resetBall = () => {
    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 10;
    ball.velocityX = -ball.velocityX;
    setTimeout(() => {
        ball.velocityX = 10;
        ball.velocityY = 10;
    }, 1000);
}

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let skill = 0.2;
    computer.y = ball.y - ((computer.y + computer.height/2) * skill);
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : computer;
    if(collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angle = (Math.PI/4) * collidePoint;
        let ballDir = (ball.x < canvas.width/2) ? 1 : -1;
        ball.velocityX = ball.speed * Math.cos(angle) * ballDir;
        ball.velocityY = ball.speed * Math.sin(angle) * ballDir;
        if(Math.random() > 0.8) {
            ball.speed += 0.1;
        }
        if(Math.random() < 0.05) {
            ball.speed -= Math.random();
        }
        ball.speed += Math.random();
    }
    if(ball.x - ball.radius < 0) {
        computer.score++;
        computerScore.innerText = computer.score;
        resetBall();
    } else if(ball.x + ball.radius > canvas.width) {
        user.score++;
        userScore.innerText = user.score;
        resetBall();
    }
}

const moveBat = (e) => {
    let box = canvas.getBoundingClientRect();
    user.y = e.clientY - box.top - user.height/2;
}

canvas.addEventListener('mousemove', moveBat);

const render = () => {
    drawRect(0, 0, canvas.width, canvas.height, "#7cfc00");
    drawLine1();
    drawLine2();
    drawHorizontal();
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

const game = () => {
    update();
    render();
    requestAnimationFrame(game);
}

game();