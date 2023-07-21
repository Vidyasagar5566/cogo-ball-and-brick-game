//Create variables to reference and store canvas 
let canvas = document.getElementById('mycanvas');
let ctx = canvas.getContext('2d');
let ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
//create the paddle
let paddleHeight = 12;
let paddleWidth = 52;
//specify starting point of paddle
let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed=false;
let leftPressed=false;

let brickRowCount = 6;
let brickColumnCount = 7;
let brickWidth = 72;
let brickHeight = 24;
let brickPadding = 17;
let brickOffsetTop = 32;
let brickOffsetLeft = 32;
//Create variables to take score
let score = 0;

//Creating arrays for the bricks
let bricks = [];
for (c =0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++){
        //set the x and y position of the bricks
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Anchor paddle movement to mouse movement
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e){
    if(e.keyCode === 39){
        rightPressed = true;
    }
    else if (e.keyCode === 37){
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.keyCode === 39){
        rightPressed = false;
    }
    else if (e.keyCode === 37){
        leftPressed = false;
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2); //centered at (x,y) position with radius r = ballRadius starting at 0 = startAngle, ending at Math.PI*2 = endAngle (in Radians)
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}
//Create a function to create the paddle
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight); //centered at (x,y) position with radius r = ballRadius starting at 0 = startAngle, ending at Math.PI*2 = endAngle (in Radians)
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}
//Create a function to draw the bricks
function drawBricks(){
    for(c=0; c < brickColumnCount; c++){
        for(r=0; r < brickRowCount; r++){
            if(bricks[c][r].status === 1){
                let brickX = (c* (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r* (brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x=brickX;
                bricks[c][r].y=brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#8500cc';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//Create function to keep track of score
function drawScore(){
    ctx.font = '20px monospace';
    ctx.fillStyle = 'brown';
    ctx.fillText('score: '+ score, 8, 20); //position score at 8,20 on the x,y axis of the canvas
}


function collisionDetection(){
    for(c=0; c<brickColumnCount;c++){
        for(r=0; r<brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status === 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount*brickColumnCount){
                        alert('Congratulations!! You\'ve won!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}
function draw(){
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawScore();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //top wall
    if(y + dy < ballRadius){
        dy = -dy;
    }
    else if (y + dy > canvas.height-ballRadius){
        //detect paddle hits
        if(x > paddleX && x < paddleX + paddleWidth){
            dy=-dy;
        }
        //if no paddle hit, body of canvas is hit ==> game over
        else {
            alert('GAME OVER!! Try again...');
            document.location.reload();
        }
    }
    //bottom wall
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius){
        dy = -dy;
    }
    //Make paddle move
    if(rightPressed && paddleX <canvas.width-paddleWidth){
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    
    x +=dx; 
    y +=dy; 
}

setInterval(draw, 5)
