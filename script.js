const canvas = document.getElementById('tennis');
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
    x: canvas.width/2 - 1, 
    y: 0,
    width: 2,
    height: 15,
    color: 'dimgray',
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
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
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
    setTimeout(() => {
        ball.velocityX = 5;
        ball.velocityY = 5;
    }, 1000);
}

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let skill = 0.4;
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
        if(Math.floor(Math.random()) > 0.8) {
            ball.speed += 0.1;
        }
        if(Math.floor(Math.random()) < 0.05) {
            ball.speed += 0.5;
        }
        ball.speed += Math.floor(Math.random());
        ball.speed -= Math.floor(Math.random());
    }
    if(ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if(ball.x + ball.radius > canvas.width) {
        user.score++;
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
    drawText(user.score, canvas.width/4, canvas.width/5, "white");
    drawText(computer.score, 3*canvas.width/4, canvas.width/5, "white");
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