var THREE = require('three');

THREE.DougalControls = function ( object, domElement ) {

    'use strict';

    this.animationDuration = 0.5; // # of s over which a rotation should animate
    this.remainingTime = 0;

    var clock = new THREE.Clock();
    this.target = new THREE.Quaternion();

    var KEYS = {
        up: 38,
        down: 40,
        left: 37,
        right: 39
    };

    var rotationCtrls = {
        38: false,
        40: false,
        37: false,
        39: false,
    };

    // Listen to keydown and update the "target" quaternion
    // for where the rotation should end up
    function keydown( event ) {
        var kc = event.keyCode;

        // If we are not already rotating on this axis, continue
        if (event.keyCode in rotationCtrls) {
            event.preventDefault();
            if (this.remainingTime === 0) {
                // Set the timeToDie
                this.remainingTime = this.animationDuration;

                // Default to forward rotation around x axis
                var x = 1; // Rotate x axis?
                var y = 0; // Rotate y axis?
                var op = 1;// Rotate forwards or backwards +/-?
                var temp = new THREE.Quaternion();

                // Check if we actually want that rotation, override if necessary
                if (kc === KEYS.right || kc === KEYS.left) {
                    x = 0;
                    y = 1;
                }
                if (kc === KEYS.up || kc === KEYS.left) {
                    // is the rotation positive or negative
                    op = -1;
                }

                // Update the quaternion to rotate 90 degrees
                temp.setFromAxisAngle( new THREE.Vector3( x, y, 0 ), op * (Math.PI / 2) );

                // Interestingly target.multiply(temp) is compounded rotations,
                // whereas this actually achieves the desired effect
                // This is because multiplication of Quaternions is NOT commutative :(
                //
                // see: http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/
                temp.multiply( this.target );
                this.target.copy( temp ).normalize();
                // target.multiply(temp); // <-- Old non-working version
            }
        }

    }

    this.update = function() {
        // slerp to towards the target quaternion
        // using clock.getDelta()
        var delta = clock.getDelta();

        for (let key in KEYS) {
            if (this.remainingTime > 0) {
                var t = Math.min(delta, this.remainingTime);
                object.quaternion.slerp(this.target, t/this.remainingTime);
                this.remainingTime -= t;
                if (this.remainingTime === 0) {
                    this.dispatchEvent( { type: 'rotated' } );
                }
            }
        }
        this.dispatchEvent( { type: 'start' } );
        this.dispatchEvent( { type: 'change' } );
    };

    window.addEventListener( 'keydown', keydown.bind(this), false );

    // force an update at start
    this.update();

};

module.exports = THREE.DougalControls;

THREE.DougalControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DougalControls.prototype.constructor = THREE.DougalControls;
