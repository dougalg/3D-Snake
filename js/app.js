(function(){

    var scene, camera, controls, renderer, target,
        keys = { 
            DOWN: 83, /* S */
            UP: 87, /* W */
            LEFT: 65, /* A */
            RIGHT: 68, /* D */
        };

    init = function() {
        var w, h = w = 800;

        target = new THREE.Vector3();

        var canvas = document.getElementById('game-canvas');
        canvas.height = h;
        canvas.width = w;

        scene = new THREE.Scene();
        console.log(scene);
        var lights = [];
        lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );
        
        lights[0].position.set( 0, 200, 0 );
        lights[1].position.set( 100, 200, 100 );
        lights[2].position.set( -100, -200, -100 );

        scene.add( lights[0] );
        scene.add( lights[1] );
        scene.add( lights[2] );

        camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

        controls = new THREE.DougalControls( scene );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [ 65, 83, 68 ];

        controls.addEventListener( 'change', render );

        camera.position.z = 20;
        camera.lookAt(scene.position);
        target.copy(scene.rotation);


        renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: canvas
        });
        renderer.setClearColor( 0xffffff, 1);

        var cubes = [];
        var num = 12;
        var med = (num/2)-0.5;
        var egh, cube, geometry, material;
        for (var x = 0; x < num; x++) {
            cubes[x] = [];
            for (var y = 0; y < num; y++) {
                cubes[x][y] = [];
                for (var z = 0; z < num; z++) {
                    geometry = new THREE.BoxGeometry( 1, 1, 1 );
                    material = new THREE.MeshFaceMaterial({ color: 0x0000FF, transparent: true, alpha: 0.1, wireframe: true });
                    cube = new THREE.Mesh( geometry, material );
                    egh = new THREE.EdgesHelper( cube, 0x00ffff );
                    cubes[x][y][z] = egh;
                    egh.position.x = x - med;
                    egh.position.y = y - med;
                    egh.position.z = z - med;
                    egh.updateMatrix();
                    egh.material.linewidth = 1;
                    scene.add( egh );
                }
            }
        }

        // window.addEventListener( 'keydown', keydown, false );
    };

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
    }

    function render() {
        renderer.render( scene, camera );
    }

    window.onload = function() {
        init();
        animate();
    };

})();
