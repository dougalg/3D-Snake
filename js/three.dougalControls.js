THREE.DougalControls = function(  ) {
    
    var _this = this;
    
    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;

    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/, 87 /*W*/ ];

    // internals

    this.target = new THREE.Vector3();

    var EPS = 0.000001;
    var lastPosition = new THREE.Vector3();
    
    var _rotateStart = new THREE.Vector3();
    var _rotateEnd = new THREE.Vector3();

    var _eye = new THREE.Vector3();

    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start'};
    var endEvent = { type: 'end'};

    this.handleEvent = function ( event ) {
        if ( typeof this[ event.type ] == 'function' ) {
            this[ event.type ]( event );
        }
    };

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            var box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;

        }

    };

    this.rotateCamera = (function(){

        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion();

        return function () {

            var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

            angle = 1;

            if ( angle ) {

                axis.crossVectors( _rotateStart, _rotateEnd ).normalize();

                angle *= _this.rotateSpeed;

                quaternion.setFromAxisAngle( axis, -angle );

                _eye.applyQuaternion( quaternion );
                _this.object.up.applyQuaternion( quaternion );

                _rotateEnd.applyQuaternion( quaternion );

                if ( _this.staticMoving ) {

                    _rotateStart.copy( _rotateEnd );

                } else {

                    quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
                    _rotateStart.applyQuaternion( quaternion );

                }

            }
        };

    }());

    this.update = function () {

        _eye.subVectors( _this.object.position, _this.target );

        _this.rotateCamera();

        _this.object.position.addVectors( _this.target, _eye );

        _this.object.lookAt( _this.target );

        if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

            _this.dispatchEvent( changeEvent );

            lastPosition.copy( _this.object.position );

        }

    };

    this.reset = function () {

        _state = STATE.NONE;
        _prevState = STATE.NONE;

        _this.target.copy( _this.target0 );
        _this.object.position.copy( _this.position0 );
        _this.object.up.copy( _this.up0 );

        _eye.subVectors( _this.object.position, _this.target );

        _this.object.lookAt( _this.target );

        _this.dispatchEvent( changeEvent );

        lastPosition.copy( _this.object.position );

    };

    // listeners
    function keydown( event ) {
        // this.rotateCamera();
        // _rotateStart.copy( new THREE.Vector3( _rotateStart.x+5, _rotateStart.y, _rotateStart.z ) );
        // _rotateEnd.copy( _rotateStart );

        // switch (event.keyCode) {

        //     // case ""

        // }

    }

    window.addEventListener( 'keydown', keydown, false );

    this.handleResize();

    // force an update at start
    this.update();
};

THREE.DougalControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DougalControls.prototype.constructor = THREE.DougalControls;