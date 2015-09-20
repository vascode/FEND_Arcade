//Global variable



var minEnemySpeed = 100,    //enemy's max speed
    maxEnemySpeed = 300,    //enemy's minh speed
    numTiles = 3,           //number of tiles where enemies can move
    xStep = 100,
    yStep = 82;

//store global state for whole game
var Game = function(){

    //instantiate enemies and player.
    this.allEnemies=[];
    this.generateEnemy();
    this.generatePlayer();
    //this.generateLife();

    // Assign "this" to new var "that" to use the object in a nested "keyup" function below.
    var that = this;

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
          13: 'enter',
          32: 'spacebar',
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down',
          65: 'left',       // A
          68: 'right',      // D
          83: 'down',       // S
          80: 'pause',      //p
          82: 'restart',    //r
          87: 'up'          // W
      }

        that.player.handleInput(allowedKeys[e.keyCode]);

        if (e.keyCode in allowedKeys){
        e.preventDefault();
      }

    });

}

Game.prototype.generateEnemy = function(){
    for (i=0; i<4; i++){
        var enemy = new Enemy();
        this.allEnemies.push(enemy);
    };
};

Game.prototype.generatePlayer = function(){
    this.player = new Player();
    this.player.renderScore();
}

//if collision between enemy and player -> player goes back to initial place
Game.prototype.checkCollisions = function(){
    //console.log("checkCollisions");
    for (var i = 0; i < this.allEnemies.length; i++){
        if(Math.abs(this.player.x -this.allEnemies[i].x) < 50 && Math.abs(this.player.y - this.allEnemies[i].y) < 50){
            this.player.reset();
            if (this.player.life > 0){
                this.player.life--;
            }
        }
    }
};

Game.prototype.gameOver = function(){
    /*
    document.getElementById("score").style.display = 'none';
    document.getElementById("timer").style.display = 'none';
    document.getElementById("game-board").style.display = 'none';
    document.getElementById("restart").style.display = 'none';
    */
    
    //window.cancelAnimationFrame(AniFrameId);

    var scoreDiv = document.getElementById("score");
    //var scoreDivParent = scoreDiv && scoreDiv.parentNode;
    var scoreDivParent = scoreDiv.parentNode;
    scoreDivParent.removeChild(scoreDiv);
    //scoreDiv.parentNode.removeChild(scoreDiv);


    var timerDiv = document.getElementById("timer");
    timerDiv.parentNode.removeChild(timerDiv);
    var gameBoardDiv = document.getElementById("game-board");
    gameBoardDiv.parentNode.removeChild(gameBoardDiv);

    var restartButton = document.getElementById("restart");
    restartButton.parentNode.removeChild(restartButton);

    document.getElementById("game-over").style.display = 'inline-block';
    var scoreMessage = "Your score is " + this.player.score;
    document.getElementById('game-over-text').innerHTML = '<p>Game Over<br><br></p>' + scoreMessage;



};

//Drawable contains common elements for Enemy and Player
var Drawable = function(){
    this.sprite;

    this.x;
    this.y;

    this.speed;

    this.randomInt = function(min, max){
        return Math.floor(Math.random()*(max-min+1) + min);
    }
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';



    this.enemyY = [60,145,230];

    this.x = -101; // test value

    //set random y position for enemy
    this.y = this.enemyY[this.randomInt(0,2)];

    this.speed = this.randomInt(minEnemySpeed, maxEnemySpeed);
};
// Set Enemy to inherit properties from Drawable
Enemy.prototype = new Drawable();

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x > 505) {
        this.x = -101;
        this.y = this.enemyY[this.randomInt(0,2)];  // bug can start in any y position
    };
};

//Generate random number between minNum and maxNum
// Enemy.prototype.randomInt = function(min, max){
//     var ranNum = Math.floor(Math.random()*(max-min+1) + min);
//     return ranNum;
// }

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.pImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

    //this.sprite = this.pImages[Math.round(Math.random()*4)];
    this.sprite = this.pImages[0];
    this.playerX = [100,200,300,400];
    this.playerY = [300,400];
    this.x = 200;   //this value
    this.y = 400;   //this value

    this.score = 0;
    this.life = 3;
    this.lifeImg = 'images/Heart-small.png';
};
// Set Enemy to inherit properties from Drawable
Player.prototype = new Drawable();

Player.prototype.update = function() {
    //multiply any movement by the dt parameter
};

// Draw player on the screen, required method for game
Player.prototype.render = function(){
    this.checkReached();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//player goes back to original point
Player.prototype.reset = function(){
    this.x = 200;
    this.y = 400;
};

Player.prototype.checkReached = function(){
    if (this.y < 0){
        this.score++;
        this.renderScore();
        this.reset();
    }
};

Player.prototype.renderLife = function(){
    if (this.life === 0){
        game.gameOver();
        this.life = -1; //this fixes problem for removing some divs
    }


    var imgX = 470;
    for (var i=0; i<this.life; i++){
        ctx.drawImage(Resources.get(this.lifeImg), imgX, 0);
        imgX -= 40;
    }
};


Player.prototype.renderScore = function(){
    document.getElementById("score").innerHTML = 'Score : ' + this.score;
}

Player.prototype.handleInput = function(key) {
    switch(key){
        case 'up':
            if(this.y > 0){
                this.y -= yStep;
                console.log("x :" + this.x + "y: " + this.y);
            }
            break;
        case 'down':
            if(this.y < 400){
                this.y += yStep;
                console.log("x :" + this.x + "y: " + this.y);
            }
            break;
        case 'left':
            if(this.x > 0){
                this.x -= xStep;
                console.log("x :" + this.x + "y: " + this.y);
            }
            break;
        case 'right':
            if(this.x < 400){
                this.x += xStep;
                console.log("x :" + this.x + "y: " + this.y);
            }
            break;
    }
};

