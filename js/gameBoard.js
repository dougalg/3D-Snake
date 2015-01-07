var GameBoard = function(gl, canvas, options) {
    options = options || {};
    this.gl = gl;
    this.canvas = canvas;
    this.size = options.size || 10;                 // Size in squares (board is an X by X by X cube)
    this.unitSize = options.unitSize || 50;         // Size of a square in pixels
    this.cubes = [];            // Cubes Size[Size[size[]*]*]
    this.width = this.height = this.size * this.unitSize;
};

/**
 * Initialize the array of buffers for each cube into this.cubes
 * Initialize the target dot
 */
GameBoard.prototype.initCubes = function() {
    var xCubes = [];
    var yCubes = [];
    var zCubes = [];
    var options = {
        sideLength: this.unitSize
    };
    for (var x=0, l=this.size; x < l; x++) {
        for (var y=0; y < l; y++) {
            for (var z=0; z < l; z++) {
                options.x = x;
                options.y = y;
                options.z = z;
                zCubes[z] = new Cube(this.gl, this.canvas, options);
            }
            yCubes[y] = zCubes;
        }
        xCubes[x] = yCubes;
    }
};

/**
 * Rotates the game board
 * @param  {[type]} direction One of "left", "right", "down", "up"
 */
GameBoard.prototype.rotate = function(direction) {
};

GameBoard.prototype.init = function() {
    this.initCubes();
};
