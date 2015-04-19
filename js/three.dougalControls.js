/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin  / http://mark-lundin.com
 */

THREE.DougalControls = function ( object, domElement ) {

    var animationDuration = 1000; // # of ms over which a rotation should animate

    var clock = new THREE.Clock();
    var target = new THREE.Quaternion();

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
        if (!rotationCtrls[kc]) {
            // Set the timeToDie
            rotationCtrls[kc] = animationDuration;

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
            if (kc === KEYS.down || kc === KEYS.left) {
                // is the rotation positive or negative
                op = -1;
            }

            // Update the quaternion to rotate 90 degrees
            temp.setFromAxisAngle( new THREE.Vector3( x, y, 0 ), op * (Math.PI / 4) );

            target.multiply( temp );
        }

    }

    this.update = function() {
        // slerp to towards the target quaternion
        // using clock.getDelta()
        var delta = clock.getDelta();

        for (var key in KEYS) {
            if (KEYS.hasOwnProperty(key)) {
                var kc = KEYS[key];
                var elapsedTime = rotationCtrls[kc] - delta;
                var t = (delta / animationDuration) + elapsedTime;

                if (rotationCtrls[kc] <= 0) {
                    rotationCtrls[kc] = false;
                }

                object.quaternion.slerp(target, t);
            }
        }

        this.dispatchEvent( 'change' );
    };

    window.addEventListener( 'keydown', keydown, false );

    // force an update at start
    this.update();

};

THREE.DougalControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DougalControls.prototype.constructor = THREE.DougalControls;
