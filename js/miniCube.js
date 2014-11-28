var MiniCube = function(x, y, z, plane) {

    'use strict';

    this.x = x;
    this.y = y;
    this.z = z;
    this.plane = plane;

    var el = $(document.createElement('div'));
    el.addClass('miniCube');
    el.attr('data-x', x);
    el.attr('data-y', y);
    el.attr('data-z', z);

    this.$el = el;

};

MiniCube.prototype.setTransform = function(unitSize, numUnits) {
    var rotate = '',
        translate = '';

    var offset = -(unitSize*numUnits)/2,
        xOff = (unitSize*this.x) + offset,
        yOff = (unitSize*this.y) + offset,
        zOff = (unitSize*this.z) + offset;

    if (this.plane == 'x') {
        zOff -= unitSize/2;
        xOff += unitSize*(numUnits/2);
        translate = 'translate3d('+xOff+'px, '+yOff+'px, '+zOff+'px)';
    }
    if (this.plane == 'y') {
        zOff += unitSize/2;
        xOff += unitSize*(numUnits/2);
        translate = 'translate3d('+xOff+'px, '+yOff+'px, '+zOff+'px)';
        rotate = 'rotateX(90deg) ';
    }
    if (this.plane == 'z') {
        xOff += unitSize;
        zOff += unitSize*((numUnits/2)-0.5);
        rotate = 'rotateY(90deg) ';
        translate = 'translate3d('+xOff+'px, '+yOff+'px, '+zOff+'px)';
    }


    this.$el.css({
        '-webkit-transform': rotate+translate,
        '-moz-transform': rotate+translate
    });
};