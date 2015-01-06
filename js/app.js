(function(){
    var gb = new GameBoard();
    gb.init();

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
        $(window).keydown(this.handleKeyPress);
    };

    bindEvents();

})();
