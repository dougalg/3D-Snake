var GameBoard = function() {
    this.size = 8;             // Size in squares (board is an X by X by X cube)
    this.unitSize = 50;        // Size of a square in pixels
    this.container = '#container';
    this.$container = undefined;
    this.viewport = '#viewport';
    this.$viewport = undefined;
    this.el = '#gameBoard';
    this.$el = undefined;
    this.cubes = [];           // Mini-cubes Size[Size[size[]*]*]
};

GameBoard.prototype.initMiniCubes = function() {
    // Set up the mini-cubes

    var planes = ['x', 'y', 'z'],
        plane;

    for (var p=0; p<planes.length; p++) {
        plane = planes[p];
        for (var i=0; i < this.size; i++) {
            var x = [];
            for (var j=0; j < this.size; j++) {
                var y = [];
                for (var k=0; k <= this.size; k++) {
                    miniCube = new MiniCube(i, j, k, plane);
                    this.$el.append(miniCube.$el);
                    y.push(miniCube);
                    miniCube.setTransform(this.unitSize, this.size);
                }
                x.push(y);
            }
            this.cubes.push(x);
        }
    }

    $('.miniCube')
        .css({
            'width': this.unitSize+'px',
            'height': this.unitSize+'px'
        });
};

GameBoard.prototype.initDollars = function() {
    var hw = this.unitSize*this.size;

    this.$el = $(this.el);
    this.$viewport = $(this.viewport);
    this.$container = $(this.container);

    this.$container.css({
        left: hw/2,
        top: hw
    });

    this.$container.css({width: hw, height: hw});

    this.$viewport.css({
        '-webkit-perspective': hw*1+'px',
        '-webkit-perspective-origin': 'center',
        '-moz-perspective': hw*1+'px',
        '-moz-perspective-origin': 'center',
    });
};

GameBoard.prototype.rotate = function(direction) {
    console.log(direction);
    TweenLite.to(this.$el, 10, {css: {rotationX: 90}});
};

GameBoard.prototype.init = function() {

    this.initDollars();

    this.initMiniCubes();
};