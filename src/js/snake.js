var THREE = require('threejs/build/three');

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

/**
 * @class Snake - A snake game's snake, a collection of squares
 *
 * @param  {Array} space A collection of cubes from CubeRenderer
 * @param  {THREE.scene} scene description
 * @return {type}       description
 */
var Snake = function (space, scene) {
    this.space = space;
    this.spaceSize = space.width;
    this.length = 0;
    this.scene = scene;
    this.segments = [];
    this.clock = new THREE.Clock();
    this.direction = {
        axis: 'x',
        distance: 1
    };
    this.moveSpeed = 0.2; // units per second

    return this;
};

module.exports = Snake;

Snake.prototype = Object.create( THREE.EventDispatcher.prototype );
Snake.prototype.constructor = Snake;

/**
 * Snake.prototype.spawn - Spawns the snake in the center of the boar
 *
 * @param  {Object} options
 * @return {Snake}
 */
Snake.prototype.spawn = function(options) {
    // Spawn a snake at a random location
    this.length = options.length;

    var pos = (this.space.width % 2) ? 0 : 0.5;
    this.populate(pos, pos, pos);

    this.segments[0].target.position.x += 1;

    this.setDirection();

    return this;
};

Snake.prototype.setDirection = function(newDirection) {
    // this.direction = newDirection;
};

Snake.prototype.clear = function() {
    for (let segment of this.segments) {
        this.scene.remove(segment.current);
    }
    this.segments = [];
}

/**
 * Snake.prototype.move - incrementally moves the snake's blocks to their next
 * positions
 *
 * @return {Snake}
 */
Snake.prototype.move = function() {
    this.addNewBlocks();
    // Move each block
    var d = this.clock.getDelta();
    var allFinished = true;
    for (let segment of this.segments) {
        if (segment.remainingTime > 0) {
            d = Math.min(segment.remainingTime, d);
            segment.current.position.lerp(segment.target.position, d/segment.remainingTime);
            segment.remainingTime -= d;
            allFinished = false;
        }
    }
    if (allFinished) {
        this.setUpNextMove();
    }
    return this;
};

/**
 * Snake.prototype.addNewBlocks - Adds new blocks to the Snake at the end
 */
Snake.prototype.addNewBlocks = function() {
    // Check length and add new block if necessary
    if (!this.blockAdded && this.segments.length < this.length & this.segments.length > 0) {
        let finalSegment = this.segments[this.segments.length-1].current;
        this.populate.apply(this, finalSegment.position.toArray());
        this.blockAdded = true;
    }
};


/**
 * Snake.prototype.setUpNextMove - sets new targets for all Snake pieces
 */
Snake.prototype.setUpNextMove = function() {
    this.blockAdded = false;
    var dir = this.direction;
    this.segments.every((segment, index) => {
        if (index > 0) {
            segment.target.position.copy(this.segments[index-1].current.position);
        }
        else {
            segment.target.position[dir.axis] += dir.distance;
        }
        segment.remainingTime = this.moveSpeed;
        return !this.outOfBounds(segment.target.position);
    }.bind(this));
};

/**
 * Snake.prototype.get - returns a cube from a location
 *
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} z
 * @return {Snake}
 */
Snake.prototype.populate = function(x, y, z) {
    // Put a new, smaller box in the cube
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    var material = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);

    this.segments.push({
        current: cube,
        target: { position: cube.position.clone() },
        remainingTime: this.moveSpeed
    });
    this.scene.add(cube);

    return this;
};

/**
 * Snake.prototype.outOfBounds - If the snake is out of bands returns true and
 * fires an edgeCollision event
 *
 * @param  {THREE.Vector3} target A vector position
 * @return {Boolean}
 */
Snake.prototype.outOfBounds = function(target) {
    for (let axis of ['x', 'y', 'z']) {
        var val = target[axis] + Math.floor(this.spaceSize/2);
        if (val < 0 || val > this.spaceSize) {
            this.dispatchEvent( {type: "edgeCollision"} );
            return true;
        }
    }
    return false;
};
