(function(){

    this.size = 4;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {
        color: 0x00ff00,
        vertexColors: THREE.VertexColors,
        depthWrite: false
    } );

    var planes = ['x', 'y', 'z'],
        plane;
    for (var p=0; p<planes.length; p++) {
        plane = planes[p];
        for (var i=0; i < this.size; i++) {
            var x = [];
            for (var j=0; j < this.size; j++) {
                var y = [];
                for (var k=0; k <= this.size; k++) {
                    var cube = new THREE.Mesh( geometry, material );
                    cube.position.x = i;
                    cube.position.y = j;
                    cube.position.z = k;
                    scene.add( cube );
                }
                x.push(y);
            }
        }
    }

    camera.position.z = 20;

    function render() {
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }
    render();

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