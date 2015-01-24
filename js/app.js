(function(){

    var gl, canvas;

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
        bindEvents();
        this.GL = new WebGL({canvas: 'game-canvas'});
        var gl = this.GL.gl;

        var gb = new GameBoard(GL);
        gb.init();

        gl.viewportWidth = this.GL.canvas.width = gb.width;
        gl.viewportHeight = this.GL.canvas.height = gb.height;
        gl.clearColor(0.0, 0.0, 0.0, 0.5);
        gl.enable(gl.DEPTH_TEST);

        this.GL.drawScene();
    };

    window.onload = init;

})();
