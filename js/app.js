//Global variable

var minEnemySpeed = 100,    //enemy's max speed
    maxEnemySpeed = 300,    //enemy's minh speed
    numTiles = 3,           //number of tiles where enemies can move
    xStep = 100,
    yStep = 82;

//store global state for whole game
var Game = function(){

    //instantiate enemies and player.
    this.allEnemies = [];
    this.generateEnemy();
    this.generatePlayer();

    //generate multiple obstacles(such as Rocks)
    this.allObstacles = [];
    //track location of obstacles
    this.obLocation = [];
    this.generateObstacles();

    this.allItems = [];
    this.generateItems(this.obLocation);


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

      this.stop = false;

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
};

Game.prototype.generateObstacles = function(){
    for (i=0; i<4; i++){
        var obstacle = new Obstacles();
        this.allObstacles.push(obstacle);
        this.obLocation.push([obstacle.x, obstacle.y]);
    };
};

Game.prototype.generateItems = function(obLoc){
    var item = new Items(obLoc);
    this.allItems.push(item);
};

//if player collide with enemy or Rocks -> player goes back to initial place
Game.prototype.checkCollisions = function(){
    var i;
    for (i = 0; i < this.allEnemies.length; i++){
        if(Math.abs(this.player.x -this.allEnemies[i].x) < 50 && Math.abs(this.player.y - this.allEnemies[i].y) < 50){
            this.player.reset();
            if (this.player.life > 0){
                this.player.life--;
            }
        }
    }
    for (i = 0; i < this.allObstacles.length; i++){
        if(Math.abs(this.player.x -this.allObstacles[i].x) < 50 && Math.abs(this.player.y - this.allObstacles[i].y) < 50){
            this.player.reset();
            if (this.player.life > 0)
                this.player.life--;
            if(this.player.score > 0){
                this.player.score--;
                this.player.renderScore();
            }

        }
    }
};

//if player hits items -> + point
Game.prototype.checkCollection = function(){


}

Game.prototype.gameOver = function(){
    /*
    document.getElementById("score").style.display = 'none';
    document.getElementById("timer").style.display = 'none';
    document.getElementById("game-board").style.display = 'none';
    document.getElementById("restart").style.display = 'none';
    */

    this.stop = true;

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
        restartButton.style.marginTop  = "40px";

    document.getElementById("game-over").style.display = 'inline-block';
    var scoreMessage = "Your score is " + this.player.score;
    document.getElementById('game-over-text').innerHTML = '<p>Game Over<br><br></p>' + scoreMessage;



};

//Drawable contains common elements for Enemy and Player
var Drawable = function(){
    this.sprite;

    //available position for drawables
    this.gridX = [0,100,200,300,400];
    this.gridY =  [60,145,230];

    this.x;
    this.y;

    this.speed;

    //generate number between min and max
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

    //this.enemyY = [60,145,230];

    this.x = -101; // test value

    //set random y position for enemy
    //this.y = this.enemyY[this.randomInt(0,2)];
    this.y = this.gridY[this.randomInt(0,this.gridY.length-1)];

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
        this.y = this.gridY[this.randomInt(0,this.gridY.length-1)];  // bug can start in any y position
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
    //this.playerX = [100,200,300,400];
    //this.playerY = [300,400];
    this.x = 200;   //this value
    this.y = 400;   //this value

    this.score = 0;
    this.life = 3;
    this.lifeImg = 'images/heart-medium.png';
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
        //this.life = -1; //this fixes problem for removing some divs
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

var Obstacles = function(){
    this.sprite = 'images/Rock.png';

    //available coordinate of x and y for items
    //this.obstacleX = [0,100,200,300,400];
    //this.obstacleY =  [60,145,230];

    //set random x position for item
    // this.x = this.obstacleX[this.randomInt(0,this.obstacleX.length-1)];
    this.x = this.gridX[this.randomInt(0,this.gridX.length-1)];
    //set random y position for item
    // this.y = this.obstacleY[this.randomInt(0,this.obstacleY.length-1)];
    this.y = this.gridY[this.randomInt(0,this.gridY.length-1)];
};
Obstacles.prototype = new Drawable();

Obstacles.prototype.update = function(){

}

// Draw the enemy on the screen, required method for game
Obstacles.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.drawImage(Resources.get(this.rockImage), this.x, this.y);
};

//pass obstacles' location (double array) so that items does not overlay obstacles.
var Items = function(obLoc){
    //this.itemImages = ['images/Heart.png', 'images/gem-blue.png', 'images/gem-green.png', 'images/Key.png', 'images/Star.png'];
    this.itemImages = [
        "images/temp/gem-blue.png",
        "images/temp/gem-green.png",
        "images/temp/Star.png",
        "images/temp/Key.png",
        "images/temp/Heart.png"
    ];
    this.sprite = this.itemImages[this.randomInt(0, this.itemImages.length-1)];

    this.setLocOfItems(obLoc);
};
Items.prototype = new Drawable();

Items.prototype.setLocOfItems = function(obLoc){
    var tempX;
    var tempY;
    var locMatched = true;

    while (locMatched){
        //set random x position for item
        tempX = this.gridX[this.randomInt(0,this.gridX.length-1)];
        //set random y position for item
        tempY = this.gridY[this.randomInt(0,this.gridY.length-1)];
        //checking if items location overlaps any of obstacles'
        for (var i=0; i<obLoc.length; i++){
            if (obLoc[i][0] === tempX && obLoc[i][1] === tempY){
                locMatched = true;
                break;
            }
            else
                locMatched = false;
        }
    }

    this.x = tempX;
    this.y = tempY;

}

Items.prototype.update = function(){

};

// Draw the enemy on the screen, required method for game
Items.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.drawImage(Resources.get(this.rockImage), this.x, this.y);
};
