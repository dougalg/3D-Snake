(function(){

    var gl, canvas, shaderProgram;

    press = function(direction) {
        gb.rotate(direction);
    };

    handleKeyPress = function(e) {
        var code = e.keyCode,
            val;
        switch (code) {
            case 38: // Up arrow
                e.preventDefault();
                this.press('up');
                return;
            case 37: // Left arrow
                e.preventDefault();
                this.press('left');
                return;
            case 39: // Right arrow
                e.preventDefault();
                this.press('right');
                return;
            case 40: // Down arrow
                e.preventDefault();
                this.press('down');
                return;
        }

    };

    bindEvents = function() {
        window.addEventListener("keydown", this.handleKeyPress);
    };

    init = function() {
        this.canvas = document.getElementById('game-canvas');
        bindEvents();
        initGL();
        var gl = this.gl;

        var gb = new GameBoard(gl, this.canvas);
        gb.init();

        gl.viewportWidth = this.canvas.width = gb.width;
        gl.viewportHeight = this.canvas.height = gb.height;
        gl.clearColor(0.0, 0.0, 0.0, 0.5);
        gl.enable(gl.DEPTH_TEST);

        drawScene();
    };

    initGL = function() {
        try {
            this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        } catch (e) {console.log(e);}
        // TODO: Make this a nice modal or something
        if (!this.gl) {
          alert("This page requires a WebGL capable web browser.");
        }
    };

    function drawScene() {
        var gl = this.gl;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    window.onload = init;

})();
