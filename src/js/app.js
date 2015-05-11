require('../css/styles');
var THREE = require('threejs/build/three');
require('./three.dougalControls');
var CubeRenderer = require('./cubeRenderer');
var Snake = require('./snake');

var main = function() {
    
    'use strict';

    var scene, camera, controls, renderer, target, snake,
        keys = {
            DOWN: 83, /* S */
            UP: 87, /* W */
            LEFT: 65, /* A */
            RIGHT: 68, /* D */
        };

    var init = function() {
        var w, h;
        h = w = 800;

        target = new THREE.Vector3();

        var canvas = document.getElementById('game-canvas');
        canvas.height = h;
        canvas.width = w;

        scene = new THREE.Scene();

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
        controls.animationDuration = 0.8;
        controls.addEventListener( 'change', render );

        camera.position.z = 18;
        camera.lookAt(scene.position);
        target.copy(scene.rotation);

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: canvas
        });
        renderer.setClearColor( 0xffffff, 1);

        var cubes = new CubeRenderer(12, scene)
            .render();

        snake = new Snake(cubes, scene)
            .spawn({length: 3});

        cubes.render();

        // window.addEventListener( 'keydown', keydown, false );
    };

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        snake.move();
    }

    function render() {
        renderer.render( scene, camera );
    }

    window.onload = function() {
        init();
        animate();
    };

};

main();
