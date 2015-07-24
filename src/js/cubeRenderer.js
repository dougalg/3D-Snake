var THREE = require('threejs/build/three');

/**
 * @class CubeRenderer - Renders cubes
 *
 * @param  {Number} width Width in number of boxes
 * @param  {THREE.scene} scene A THREE.js scene object
 * @return {CubeRenderer}
 */
var CubeRenderer = function (width, scene) {
    this.cubes = [];
    this.width = width;
    this.scene = scene;

    this.offset = (this.width/2)-0.5;
    this.odd = (this.width % 2) ? 0 : 0.5;
    this.min = (-this.offset) + this.odd;
    this.max = this.offset + this.odd;

    return this;
};

module.exports = CubeRenderer;

/**
 * CubeRenderer.prototype.render - description
 *
 * @return {CubeRenderer}
 */
CubeRenderer.prototype.render = function() {
    var med = this.offset;
    var egh, cube, geometry, material;

    geometry = new THREE.BoxGeometry( 1, 1, 1 );

    for (var x = 0; x < this.width; x++) {
        this.cubes[x] = [];
        for (var y = 0; y < this.width; y++) {
            this.cubes[x][y] = [];
            for (var z = 0; z < this.width; z++) {
                material = new THREE.MeshFaceMaterial({
                    color: 0x0000FF,
                    transparent: true,
                    alpha: 0.1,
                    wireframe: true
                });
                cube = new THREE.Mesh( geometry, material );
                egh = new THREE.EdgesHelper( cube, 0xcccccc );

                this.cubes[x][y][z] = egh;

                egh.position.set(x - med, y - med, z - med);

                egh.updateMatrix();
                egh.material.linewidth = 1;

                this.scene.add( egh );
            }
        }
    }

    return this;
};

/**
 * Given an array of [x, y, z] coordinates, determines if that is a valid member of the current space
 * @param  {Integer[]}  position [x, y, z]
 * @return {Boolean}
 */
CubeRenderer.prototype.hasCubeAt = function(position) {
    for (let axis of position) {
        if (axis > this.max || axis < this.min) {
            return false
        }
    }
    return true;
}

/**
 * CubeRenderer.prototype.get - returns a cube from a location
 *
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} z
 * @return {Object}
 */
CubeRenderer.prototype.get = function(x, y, z) {
    return this.cubes[x][y][z];
};
