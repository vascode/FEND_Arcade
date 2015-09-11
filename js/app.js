//store global state for whole game
var Game = function(){
    this.minEnemySpeed = 100    //enemy's max speed
    this.maxEnemySpeed = 300    //enemy's minh speed

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    var enemy1 = new Enemy();
    var enemy2 = new Enemy();
    var enemy3 = new Enemy();
    this.allEnemies = [enemy1, enemy2, enemy3];
    this.player = new Player();
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

    this.y = this.enemyY[Math.round(Math.random()*2)];

    this.speed = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x > 505) {
        this.x = -101;
        this.y = this.enemyY[Math.round(Math.random()*2)];  // bug can start in any y position
    };
};

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
    this.x = 100;   //this value
    this.y = 320;   //this value
}

Player.prototype.update = function(dt) {
    //multiply any movement by the dt parameter
};

// Draw player on the screen, required method for game
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function() {

};





// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
