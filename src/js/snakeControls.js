var THREE = require('threejs/build/three');

const keys = {
    DOWN: 83,    /* S */
    UP: 87,      /* W */
    LEFT: 65,    /* A */
    RIGHT: 68,   /* D */
    BACK: 81,    /* Q */
    FORWARD: 69  /* E */
};

var controlKeys = {
    83: true,
    87: true,
    65: true,
    68: true,
    81: true,
    69: true
};

var SnakeControls = function(snake, scene) {
    this.snake = snake;
    this.scene = scene;
    this.axes = {
        x: {
            axis: 'x',
            mult: 1
        },
        y: {
            axis: 'y',
            mult: 1
        },
        z: {
            axis: 'z',
            mult: 1
        }
    };

    window.addEventListener( 'keydown', this.keydown.bind(this), false );
};

module.exports = SnakeControls;

SnakeControls.prototype.setRotatedAxes = function(quaternion) {
    var axes = {
        x: new THREE.Vector3(1, 0, 0),
        y: new THREE.Vector3(0, 1, 0),
        z: new THREE.Vector3(0, 0, 1)
    };

    for (let axis in axes) {
        axes[axis].applyQuaternion(quaternion).normalize();
        axes[axis] = this.getRotatedAxis(axes[axis]);
    }
    this.axes = axes;
};

SnakeControls.prototype.getRotatedAxis = function (vector) {
    for (let axis in vector) {
        if (Math.abs(vector[axis]) === 1) {
            return {
                axis: axis,
                mult: vector[axis]
            };
        }
    }
    console.error('No equivalent axis found for rotation vector', vector);
}

SnakeControls.prototype.keydown = function( event ) {

    var kc = event.keyCode;

    if (kc in controlKeys) {
        event.preventDefault();

        let axis, distance;

        if (kc === keys.DOWN || kc === keys.UP) {
            axis = this.axes.y.axis;
            distance = this.axes.y.mult;
        }
        else if (kc == keys.LEFT || kc === keys.RIGHT) {
            axis = this.axes.x.axis;
            distance = this.axes.x.mult;
        } else {
            axis = this.axes.z.axis;
            distance = this.axes.z.mult;
        }

       if (kc === keys.DOWN || kc === keys.LEFT || kc === keys.BACK) {
            distance = -1 * distance;
        }

        this.snake.setDirection(axis, distance);

    }
}
