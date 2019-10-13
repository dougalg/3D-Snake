require('../css/styles');
var THREE = require('three');
require('./three.dougalControls');
var CubeRenderer = require('./cubeRenderer');
var Snake = require('./snake');
var SnakeControls = require('./snakeControls');
const FOOD_COLOR = 0x0000ff;

function getRand(max) {
    return Math.floor(Math.random() * max);
}

var main = function() {

    'use strict';

    var scene, camera, controls, snakeControls, renderer, snake, food, cubes, score, scoreEl;

    var init = function() {
        var w, h;
        h = w = 800;
        var boxWidth = 11;

        var canvas = document.getElementById('game-canvas');
        scoreEl = document.getElementsByClassName('score')[0];

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
            canvas: canvas,
            sortObjects: false
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
        // document.getElementById("resetButton").addEventListener("click", resetGame);
        snake.addEventListener( "move", onMove );
        controls.addEventListener( "rotated", setRotatedAxes );
        controls.addEventListener( "change", render );
    }

    function setRotatedAxes () {
        snakeControls.setRotatedAxes(scene.quaternion.clone().inverse());
    }

    function endGame () {
        snake.stop();
        var items = document.getElementsByClassName('hideable');
        for (let el of Array.prototype.slice.call( items )) {
            el.style.display = "";
        }
    }

    function startGame (e) {
        e.preventDefault();
        resetGame();
        var items = document.getElementsByClassName('hideable');
        for (let el of Array.prototype.slice.call( items )) {
            el.style.display = "none";
        }
        // Fake a right key press to start moving right
        snakeControls.keydown({
            keyCode: 68,
            preventDefault: function(){}
        });
        snake.start().spawn({ length: 3 });
        spawnFood();
    }

    function spawnFood() {
        var min = cubes.min;
        var w = cubes.width;
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );

        var material = new THREE.MeshLambertMaterial({
            color: FOOD_COLOR
        });
        food = new THREE.Mesh( geometry, material );
        food.position.set( getRand(w) + min, getRand(w) + min, getRand(w) + min );
        scene.add(food);
    }

    function onMove(options) {
        var p = options.position;
        // if (snake.isAt( p.toArray()) ) {
        //     console.log('self destruct');
        // }
        // if (!this.space.hasCubeAt( p.toArray() )) {
        //     console.log('edge');
        // }
        if (!this.space.hasCubeAt( p.toArray() ) ||
            snake.isAt( p.toArray() )) {
            return endGame();
        }
        if (food.position.equals( p )) {
            snake.eat();
            scene.remove(food);
            spawnFood();
            incrementScore();
        }
    }

    function incrementScore() {
        score += 1;
        updateScore();
    }

    function updateScore() {
        scoreEl.innerHTML = score;
    }

    function resetGame (e) {
        score = 0;
        updateScore();
        snake.clear().stop();
        scene.remove(food);
    }

    function initLights(scene) {
        var lights = [];
        lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[1] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[2] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[0].position.set( 0, 200, 0 );
        lights[1].position.set( 100, 200, 100 );
        lights[2].position.set( -100, -200, -100 );

        scene.add( lights[0], lights[1], lights[2] );
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        snake.move();
    }

    function render() {
        renderer.render( scene, camera );
    }

    function display() {
        document.getElementById('loading').style.display = "hidden";
        document.getElementById('app').style.display = "";
    }

    window.onload = function() {
        init();
        animate();
        display();
    };

};

main();
