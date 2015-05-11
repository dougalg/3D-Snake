var THREE = require('threejs/build/three');

var Snake = function(space, scene) {
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
    this.moveSpeed = 0.3; // units per second

    return this;
};

module.exports = Snake;

Snake.prototype.spawn = function(options) {
    // Spawn a snake at a random location
    this.length = options.length;
    var w = this.spaceSize;

    var med = this.space.offset;

    this.populate(getRandom(w)-med, getRandom(w)-med, getRandom(w)-med);
    
    this.segments[0].target.position.x += 1;

    this.setDirection();

    return this;
};

Snake.prototype.setDirection = function(newDirection) {
    // this.direction = newDirection;
};

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
};

Snake.prototype.addNewBlocks = function() {
    // Check length and add new block if necessary
    if (!this.blockAdded && this.segments.length < this.length & this.segments.length > 0) {
        let finalSegment = this.segments[this.segments.length-1].current;
        this.populate.apply(this, finalSegment.position.toArray());
        this.blockAdded = true;
    }
};

Snake.prototype.setUpNextMove = function () {
    this.blockAdded = false;
    var dir = this.direction;
    this.segments.forEach(function(segment, index){
        if (index > 0) {
            segment.target.position.copy(this.segments[index-1].current.position);
        }
        else {
            segment.target.position[dir.axis] += dir.distance;
        }
        segment.remainingTime = this.moveSpeed;
    }.bind(this));
};

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

function getRandom(max) {
    return Math.floor(Math.random() * max);
}