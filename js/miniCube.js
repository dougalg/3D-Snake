var Cube = function(gl, canvas, options) {
    options = options || {};

    this.gl = gl;
    this.canvas = canvas;

    this.sideLength = options.sideLength;
    this.x = options.x * this.sideLength;
    this.y = options.y * this.sideLength;
    this.z = options.z * this.sideLength;

    this.initShaders();
    this.initBuffer();
};

Cube.prototype.initShaders = function() {

};

Cube.prototype.initBuffer = function() {
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.vertices = [
        this.x, this.y, this.z,
        this.x, this.y+this.sideLength, this.z,
        this.x+this.sideLength, this.y, this.z,
        this.x+this.sideLength, this.y+this.sideLength, this.z,
        this.x, this.y, this.z+this.sideLength,
        this.x, this.y+this.sideLength, this.z+this.sideLength,
        this.x+this.sideLength, this.y, this.z+this.sideLength,
        this.x+this.sideLength, this.y+this.sideLength, this.z+this.sideLength,
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    this.positionBuffer.itemSize = 3;
    this.positionBuffer.numItems = 8;
};