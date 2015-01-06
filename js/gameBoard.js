var GameBoard = function() {
    this.size = 10;             // Size in squares (board is an X by X by X cube)
    this.unitSize = 50;         // Size of a square in pixels
    this.canvas = 'game-canvas';
    this.$canvas = undefined;
    this.cubes = [];            // Cubes Size[Size[size[]*]*]
};

/**
 * [initGL description]
 */
GameBoard.prototype.initGL = function() {
};

/**
 * Initialize the array of buffers for each cube into this.cubes
 * Initialize the target dot
 */
GameBoard.prototype.initBuffers = function() {
};

/**
 * Rotates the game board
 * @param  {[type]} direction One of "left", "right", "down", "up"
 */
GameBoard.prototype.rotate = function(direction) {
};

GameBoard.prototype.init = function() {
    this.$canvas = document.getElementById(this.canvas);
    this.initGL();
    this.initBuffers();
};
