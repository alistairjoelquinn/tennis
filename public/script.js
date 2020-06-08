const canvas = document.getElementById('tennis');
let userScore = document.getElementById('user');
let computerScore = document.getElementById('computer');
const ctx = canvas.getContext('2d');
// let player = document.getElementById('player');
const { user, computer, net, line1, line2, horizontal, ball } = JSON.parse(setup);
let gameStarted = false;
let computerDir = 1;

const drawCourt = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// const drawPlayer = () => {
//     ctx.drawImage(player, 0, 250, 200, 100);
// }

const drawBall = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

const writeText = (text, x, y, color) => {
    ctx.fillStyle = color;
    ctx.font = '75px serif';
    ctx.fillText(text, x, y);
}

const drawNet = () => {
    for (let i = 0; i <= canvas.height; i+=15) {
        drawCourt(net.x, net.y + i, net.width, net.height, net.color);
    }
}

const drawLine1 = () => {
    for (let i = 0; i <= canvas.height; i+=15) {
        drawCourt(line1.x, line1.y + i, line1.width, line1.height, line1.color);
    }
}

const drawLine2 = () => {
    for (let i = 0; i <= canvas.height; i+=15) {
        drawCourt(line2.x, line2.y + i, line2.width, line2.height, line2.color);
    }
}

const drawHorizontal = () => {
    drawCourt(horizontal.x, horizontal.y, horizontal.width, horizontal.height, horizontal.color);
}

const strike = (b, p) => {
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

const gameReset = () => {
    computer.x = 790;
    ball.velocityX = 0;
    ball.velocityY = 0;
    ball.x = 700;
    ball.y = 100;
    ball.speed = 10;
    ball.velocityX = -ball.velocityX;
    setTimeout(() => {
        ball.velocityX = -10;
        ball.velocityY = 10;
    }, 1000);
}

const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let skill = 0.4;
    computer.y = ball.y - ((computer.y + computer.height/2) * skill);
    if(Math.random() < 0.15) {
        computerDir = -computerDir;
    }
    if(Math.random() > 0.7) {
        computer.x -= (1*computerDir);
    }
    if(Math.random() < 0.05) {
        computer.x -= (2*computerDir);
    }
    if(Math.random() < 0.7 && Math.random() > 0.4) {
        computer.x -= Math.random();
    }
    if(computer.x < 450) {
        computer += 5;
    }
    if(computer.x > 792) {
        computer.x -= 1;
    }
    
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : computer;
    if(strike(ball, player)) {
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
        gameReset();
    } else if(ball.x + ball.radius > canvas.width) {
        user.score++;
        userScore.innerText = user.score;
        gameReset();
    }
}

const moveBat = (e) => {
    let box = canvas.getBoundingClientRect();
    user.y = e.clientY - box.top - user.height/2;
    user.x = e.clientX - box.left;
}

canvas.addEventListener('mousemove', moveBat);

const render = () => {
    drawCourt(0, 0, canvas.width, canvas.height, "#7cfc00");
    drawLine1();
    drawLine2();
    drawHorizontal();
    drawNet();
    // drawPlayer();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

const game = () => {
    console.log('game is running');
    update();
    render();
    if(!gameStarted) {
        console.log('if block is opening');
        setTimeout(() => {
            ball.speed = 10;
            ball.velocityX = -10;
            ball.velocityY = 10;
            gameStarted = true;
            requestAnimationFrame(game);
        }, 2000);
    } else {
        requestAnimationFrame(game);
    }
}

window.addEventListener('mousemove', (e) => {
    let bat1 = document.getElementById("bat-1");
    bat1.style.top = e.clientY - bat1.offsetHeight / 2 + "px";
    bat1.style.left = e.clientX - bat1.offsetWidth / 2 + "px"; 
});

game();