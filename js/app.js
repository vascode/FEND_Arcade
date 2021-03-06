//Global variable

var minEnemySpeed = 100,    //enemy's max speed
    maxEnemySpeed = 300,    //enemy's minh speed
    numTiles = 3,           //number of tiles where enemies can move
    xStep = 100,            //horizontal step that player can move at one key stroke
    yStep = 84;             //vertical step that player can move at one key stroke

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

    this.generateItems(this.obLocation);

    this.generateFish();

    this.remainingTime;
    this.stop = false;

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
          81: 'quit',       //q
          82: 'restart',    //r
          87: 'up'          // W
        }
        that.player.handleInput(allowedKeys[e.keyCode]);

        if (e.keyCode in allowedKeys){
        e.preventDefault();
        }
    });
};

Game.prototype.generateEnemy = function(){
    for (i=0; i<4; i++){
        var enemy = new Enemy();
        this.allEnemies.push(enemy);
    };
};

Game.prototype.generatePlayer = function(){
    this.player = new Player();
};

Game.prototype.generateObstacles = function(){
    for (i=0; i<4; i++){
        var obstacle = new Obstacles();
        this.allObstacles.push(obstacle);
        this.obLocation.push([obstacle.x, obstacle.y]);
    };
};

Game.prototype.generateItems = function(obLoc){
    this.item = new Items(obLoc);
};

Game.prototype.generateFish = function(obLoc){
    this.fish = new Fish();
};

//if player collide with enemy or Rocks -> player goes back to initial place
Game.prototype.checkCollisions = function(){
    var i;
    for (i = 0; i < this.allEnemies.length; i++){
        if((Math.abs(this.player.x -this.allEnemies[i].x) < 50 && Math.abs(this.player.y - this.allEnemies[i].y) < 50) ||
        (Math.abs(this.player.x -this.allObstacles[i].x) < 50 && Math.abs(this.player.y - this.allObstacles[i].y) < 50)){
            this.player.reset();
            if (this.player.life > 0){
                this.player.life--;
            }
            if(this.player.score > 0){
                this.player.score--;
            }
        }

    }
};

//if player hits items -> + point
Game.prototype.checkCollection = function(){
    var i;
    if(Math.abs(this.player.x -this.item.x) < 50 && Math.abs(this.player.y - this.item.y) < 50){
        switch(this.item.sprite){
            case 'images/Heart.png':
                this.player.life++;
                this.player.renderLife();
                break;
            case 'images/Star.png':
                var originalEnemySpeeds = new Array(this.allEnemies.length);
                var allEnemies = this.allEnemies;
                for (i=0; i<allEnemies.length; i++){
                    originalEnemySpeeds[i] = allEnemies[i].speed;
                    allEnemies[i].speed = allEnemies[i].speed/3;
                }
                setTimeout(function(){
                    for(i=0; i<originalEnemySpeeds.length; i++){
                        allEnemies[i].speed = originalEnemySpeeds[i];
                    }
                }, 1000);
                break;
            case 'images/treasureChest.png':
                this.player.score += 3;
                break;

            case 'images/gem-blue.png':
                this.remainingTime  += 10;
                break;
        }
        this.item.x = -100;
        this.item.y = -100;
    }
};

//reset position for items, rocks and fish
Game.prototype.resetObjects = function(){
        this.allObstacles = [];

        //track location of obstacles
        this.obLocation = [];
        this.generateObstacles();

        this.item.itemSelector();
        this.item.setLocOfItems(this.obLocation);

        this.fish.reset();
};

Game.prototype.checkReached = function(){
    if(Math.abs(this.player.x -this.fish.x) < 50 && Math.abs(this.player.y - this.fish.y) < 50){
            game.player.score += 5;
        game.player.reset();
        game.resetObjects();
    }
};

Game.prototype.gameOver = function(){
    var scoreDiv = document.getElementById("score");
    var scoreDivParent = scoreDiv.parentNode;
    scoreDivParent.removeChild(scoreDiv);

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

Game.prototype.generateTimer = function (seconds){
    var timerDiv = document.getElementById('timer');
    this.remainingTime = seconds;
    timerDiv.innerHTML = this.timerFormat(seconds);
    if (!game.stop)
        this.updateTimer();
};

Game.prototype.updateTimer = function(){
    if (this.remainingTime === 0 ){
        game.stop = true;
    }
    else{
        var timerDiv = document.getElementById('timer');
        if (this.remainingTime > 20)
            timerDiv.style.backgroundColor = "#00B8E6";
        else if (this.remainingTime <= 20 && this.remainingTime  > 11)
            timerDiv.style.backgroundColor = "#FFCC00";
        else if (this.remainingTime <= 10 && this.remainingTime > 5)
            timerDiv.style.backgroundColor = "#FF6600";
        else if (this.remainingTime <= 5)
            timerDiv.style.backgroundColor = "#E60000";

        timerDiv.innerHTML = this.timerFormat(this.remainingTime--);

        setTimeout(function(){
             if (!game.stop)
                game.updateTimer();
        }, 1000);
    }
};

Game.prototype.timerFormat = function(seconds) {
    var formattedMinute = Math.floor(seconds/60);
    formattedMinute = (formattedMinute < 10)? '0' + formattedMinute : formattedMinute;
    var formattedSeconds = seconds%60;
    formattedSeconds = (formattedSeconds < 10)? '0' + formattedSeconds  : formattedSeconds;

    var formattedTime = formattedMinute + ' : ' + formattedSeconds;

    return formattedTime;
};

//Drawable contains common elements for Enemy and Player
var Drawable = function(){
    this.sprite;

    //available position for drawables
    this.gridX = [0,100,200,300,400];
    this.gridY =  [60,145,230,315];

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

    this.characterSelector();

    this.x = 200;   // initial position of x
    this.y = 410;   // initial position of y

    this.score = 0;
    this.life = 3;
    this.lifeImg = 'images/heart-medium.png';
};
// Set Enemy to inherit properties from Drawable
Player.prototype = new Drawable();

//select character at random
Player.prototype.characterSelector = function(){
    this.sprite = this.pImages[this.randomInt(0, this.pImages.length-1)];
}

// Draw player on the screen, required method for game
Player.prototype.render = function(){
    game.checkReached();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//player goes back to original point
Player.prototype.reset = function(){
    this.x = 200;
    this.y = 410;
};

//render heart for a number of life on the right top corner
Player.prototype.renderLife = function(){
    if (this.life === 0){
        game.stop = true;
    };

    var imgX = 470;
    for (var i=0; i<this.life; i++){
        ctx.drawImage(Resources.get(this.lifeImg), imgX, 0);
        imgX -= 40;
    }
};

//render score
Player.prototype.renderScore = function(){
    document.getElementById("score").innerHTML = 'Score : ' + this.score;
}

//actions at key stroke
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
        case 'quit':
            // location.reload();
            game.stop = true;
            break;
    }
};

var Obstacles = function(){
    this.sprite = 'images/Rock.png';

    //set random x position for item
    this.x = this.gridX[this.randomInt(0,this.gridX.length-1)];
    //set random y position for item
    this.y = this.gridY[this.randomInt(0,this.gridY.length-1)];
};
// Set Obstacles to inherit properties from Drawable
Obstacles.prototype = new Drawable();

// Draw the enemy on the screen, required method for game
Obstacles.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//@param obLoc : pass obstacles' location (double array) so that items does not overlay obstacles.
var Items = function(obLoc){
    this.itemImages = [
        "images/Star.png",
        "images/gem-blue.png",
        "images/Heart.png",
        "images/treasureChest.png"
    ];
    //select one item at random
    this.itemSelector();
    //set location of item at which rocks are not located
    this.setLocOfItems(obLoc);
};
// Set Items to inherit properties from Drawable
Items.prototype = new Drawable();

//Item selector among star, gem-blue, heart, treasureChest
Items.prototype.itemSelector = function(){
   this.sprite = this.itemImages[this.randomInt(0, this.itemImages.length-1)];
};

//set location of Items where rocks do not exist
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

    //set current location of Item
    this.x = tempX;
    this.y = tempY;

};

// Draw the enemy on the screen, required method for game
Items.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.drawImage(Resources.get(this.rockImage), this.x, this.y);
};

var Fish = function(){
    this.sprite = 'images/Fish.png';
    this.reset();
}
// Set Fish to inherit properties from Drawable
Fish.prototype = new Drawable();

// Set location of fish on water when player reach fish
Fish.prototype.reset = function(){
    this.x = this.gridX[this.randomInt(0,this.gridX.length-1)];
    this.y = -20;
}

Fish.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}