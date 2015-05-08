var THREE = require('threejs/build/three');

var Snake = function(space, scene) {
    this.space = space;
    this.spaceSize = space.width;
    this.length = 0;
    this.scene = scene;
    this.pieces = [];
    this.clock = new THREE.Clock();
    this.direction = 'left';

    return this;
};

module.exports = Snake;

Snake.prototype.spawn = function(options) {
    // Spawn a snake at a random location
    this.length = options.length;
    var w = this.spaceSize;

    this.populate(getRandom(w), getRandom(w), getRandom(w));
    this.setDirection();

    return this;
};

Snake.prototype.setDirection = function(newDirection) {
    this.direction = newDirection;
};

Snake.prototype.move = function() {
    // Check length and add new block if necessary
    // Move each block, starting with head
    // If new block craeted, last block doesn't move
};

Snake.prototype.populate = function(x, y, z) {
    // Put a new, smaller box in the cube
    var med = this.space.offset;
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    x -= med;
    y -= med;
    z -= med;

    var material = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);

    this.pieces.push(cube);
    this.scene.add(cube);

    return this;
};

function getRandom(max) {
    return Math.floor(Math.random() * max);
}