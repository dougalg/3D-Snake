(function(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    // var gb = new GameBoard();
    // gb.init();

    // press = function(direction) {
    //     gb.rotate(direction);
    // };

    // handleKeyPress = function(e) {
    //     var code = e.keyCode,
    //         val;
    //     switch (code) {
    //         case 38:
    //             e.preventDefault();
    //             this.press('up');
    //             return;
    //         case 37:
    //             e.preventDefault();
    //             this.press('left');
    //             return;
    //         case 39:
    //             e.preventDefault();
    //             this.press('right');
    //             return;
    //         case 40:
    //             e.preventDefault();
    //             this.press('down');
    //             return;
    //     }

    // };

    // bindEvents = function() {
    //     $(window).keydown(this.handleKeyPress);
    // };

    // bindEvents();
})();