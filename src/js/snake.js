var THREE = require('threejs/build/three');
var Lazy = require('lazy.js/lazy');
const SNAKE_COLOR = 0x00ffff;

/**
 * @class Snake - A snake game's snake, a collection of squares
 *
 * @param  {Array} space A collection of cubes from CubeRenderer
 * @param  {THREE.scene} scene description
 * @return {type}       description
 */
var Snake = function (space, scene) {
    this.stopped = true;
    this.space = space;
    this.spaceSize = space.width;
    this.length = 0;
    this.scene = scene;
    this.segments = [];
    this.clock = new THREE.Clock();
    this.moveSpeed = 0.12; // units per second
    this.tempCubes = {};
    this.futureDirection = {};
    this.currentDirection = {
        axis: 'y',
        direction: -1
    }
    this.positions = {};

    return this;
};

module.exports = Snake;

Snake.prototype = Object.create( THREE.EventDispatcher.prototype );
Snake.prototype.constructor = Snake;

/**
 * Snake.prototype.spawn - Spawns the snake in the center of the board
 *
 * @param  {Object} options
 * @return {Snake}
 */
Snake.prototype.spawn = function(options) {
    // Spawn a snake at a random location
    this.length = options.length;

    var pos = this.space.odd;
    this.populate(pos, pos, pos);

    this.segments[0].target.position.x += 1;

    this.setDirection('x', 1);

    return this;
};

Snake.prototype.start = function() {
    this.stopped = false;
    return this;
}

Snake.prototype.stop = function() {
    this.stopped = true;
    return this;
}

/**
 * Snake.prototype.setDirection - Sets a new direction for the snake
 *
 * @param  {String} axis     x, y, z
 * @param  {Integer} distance 1 or -1
 * @return {Snake}
 */
Snake.prototype.setDirection = function(axis, distance) {
    // TODO: Ensure there is no attempt to move the snake back onto itself
    var tmp = {
        axis: axis,
        distance: distance
    };
    if (!this.isInverseDirection(this.currentDirection, tmp)) {
        this.futureDirection = tmp;
    }

    return this;
};

Snake.prototype.isInverseDirection = function(a, b) {
    return a.axis === b.axis && a.distance === -1 * b.distance
}

Snake.prototype.clear = function() {
    var segs = Lazy(this.segments).map((seg) => seg.current).concat(
        Lazy(this.tempCubes).toArray().map(([key, val]) => val )
    );
    this.scene.remove.apply(this.scene, segs.value());
    this.tempCubes = {};
    this.segments = [];
    return this;
}

Snake.prototype.eat = function() {
    this.length += 1;
    return this;
}

/**
 * Snake.prototype.move - incrementally moves the snake's blocks to their next
 * positions
 *
 * @return {Snake}
 */
Snake.prototype.move = function() {
    if (!this.stopped) {
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
    }
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
    this.removeTempCubes();
    this.blockAdded = false;
    var isTurn = this.futureDirection != this.currentDirection;
    var dir = this.currentDirection = this.futureDirection;
    this.positions = {};
    this.segments.forEach((segment, index) => {
        this.positions[segment.current.position.toArray()] = true;
        if (index > 0) {
            // If the snake is turning here, add a temporary block to smooth animations
            let fp = this.segments[index-1].current.position;
            // Follow the block in front
            segment.target.position.copy(fp);
        }
        else {
            // Follow the keyed direction
            segment.target.position[dir.axis] += dir.distance;
            if (isTurn) {
                this.addTempCube.apply(this, segment.current.position.toArray());
            }
        }
        segment.remainingTime = this.moveSpeed;
    }.bind(this));

    this.dispatchEvent({
        type: "move",
        position: this.segments[0].target.position
    });
};

Snake.prototype.isAt = function(p) {
    return !!this.positions[p];
};

/**
 * Remove any temporary cubes at the tail of the snake
 */
Snake.prototype.removeTempCubes = function() {
    var w = this.segments[this.segments.length-1];
    if (!w || !w.current) {
        return;
    }
    var x = w.current.position.toArray();
    var y = this.tempCubes[x];
    if (!y) {
        return;
    }

    this.scene.remove(y);
    delete this.tempCubes[x];
}

/**
 * Insert a temporary cube at position position
 * @param {THREE.Vector3} position
 */
Snake.prototype.addTempCube = function(x, y, z) {
    if (this.tempCubes[[x,y,z]] === undefined) {
        var cube = this.getCubeAtPosition(x, y, z);
        this.tempCubes[[x,y,z]] = cube;
        this.scene.add(cube);
    }
}

Snake.prototype.getCubeAtPosition = function(x, y, z) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    var material = new THREE.MeshLambertMaterial({
        color: SNAKE_COLOR
    });
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);
    return cube;
}

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
    var cube = this.getCubeAtPosition(x, y, z)

    this.segments.push({
        current: cube,
        target: { position: cube.position.clone() },
        remainingTime: this.moveSpeed
    });
    this.scene.add(cube);

    return this;
};
