require('../css/styles');
var THREE = require('threejs/build/three');
require('./three.dougalControls');
var CubeRenderer = require('./cubeRenderer');
var Snake = require('./snake');
var SnakeControls = require('./snakeControls');

var main = function() {

    'use strict';

    var scene, camera, controls, snakeControls, renderer, snake, cubes;

    var init = function() {
        var w, h;
        h = w = 800;
        var boxWidth = 15;

        var canvas = document.getElementById('game-canvas');
        canvas.height = h;
        canvas.width = w;

        scene = new THREE.Scene();

        initLights(scene);
        camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

        camera.position.z = boxWidth + boxWidth/4;
        camera.lookAt(scene.position);

        controls = new THREE.DougalControls( scene );
        controls.animationDuration = 0.8;

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: canvas
        });
        renderer.setClearColor( 0xffffff, 1);

        cubes = new CubeRenderer(boxWidth, scene).render();
        snake = new Snake(cubes, scene);
        snakeControls = new SnakeControls(snake, scene);
        setRotatedAxes();

        addListeners();
    };

    function addListeners () {
        document.getElementById("startButton").addEventListener("click", startGame);
        document.getElementById("resetButton").addEventListener("click", resetGame);
        snake.addEventListener( "edgeCollision", endGame );
        controls.addEventListener( "rotated", setRotatedAxes );
        controls.addEventListener( "change", render );
    }

    function setRotatedAxes () {
        snakeControls.setRotatedAxes(scene.quaternion.clone().inverse());
    }

    function endGame () {
        resetGame();
    }

    function startGame (e) {
        e.preventDefault();
        var items = document.getElementsByClassName('hideable');
        for (let el of Array.prototype.slice.call( items )) {
            el.style.display = "none";
        }
        snake.spawn({ length: 3 });
    }

    function resetGame (e) {
        snake.clear();
        var items = document.getElementsByClassName('hideable');
        for (let el of Array.prototype.slice.call( items )) {
            el.style.display = "";
        }
    }

    function initLights(scene) {
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
    }

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
