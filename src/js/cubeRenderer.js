var THREE = require('threejs/build/three');

var CubeRenderer = function(width, scene) {
    this.cubes = [];
    this.width = width;
    this.scene = scene;

    this.offset = (this.width/2)-0.5;

    return this;
};

module.exports = CubeRenderer;

CubeRenderer.prototype.render = function() {
    var med = this.offset;
    var egh, cube, geometry, material;
    
    geometry = new THREE.BoxGeometry( 1, 1, 1 );

    // range(2).map(x => console.log(x));

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

CubeRenderer.prototype.get = function(x, y, z) {
    return this.cubes[x][y][z];
};