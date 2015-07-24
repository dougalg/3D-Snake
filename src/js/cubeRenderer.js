var THREE = require('threejs/build/three');
var Lazy = require('lazy.js/lazy');
const LIGHT_BOX_COLOR = 0xeeeeee;
const HIGHLIGHT_BOX_COLOR = 0x330000;

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
                    color: 0xffffff,
                    transparent: true,
                    alpha: 0,
                    wireframe: true
                });
                cube = new THREE.Mesh( geometry, material );
                egh = new THREE.EdgesHelper( cube, LIGHT_BOX_COLOR );

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

CubeRenderer.prototype.updateRowColor = function(position) {
    console.log(position.toArray());
    var realZ = new THREE.Vector3(0, 0, 1).applyQuaternion(this.scene.quaternion.clone().inverse().normalize()).normalize();
    var newZ = Math.abs(realZ.x) === 1 ? 'x' : Math.abs(realZ.y) === 1 ? 'y' : 'z';

    var colorizer = (cube) => { cube.material.color.setHex( HIGHLIGHT_BOX_COLOR ) };
    var decolorizer = (cube) => { cube.material.color.setHex( LIGHT_BOX_COLOR ) };

    if (this.oldRange) {
        this.oldRange.forEach(decolorizer);
    }

    this.oldRange = Lazy.range(this.width).map((i) => {
        return Lazy.range(this.width).map((j) => {
            let k = position[newZ] - this.min;
            if (newZ === 'x') {
                return this.cubes[k][i][j];
            }
            else if (newZ == 'y') {
                return this.cubes[i][k][j];
            }
            else {
                return this.cubes[i][j][k];
            }
        });
    }).flatten().value();
    this.oldRange.forEach(colorizer);
}

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
