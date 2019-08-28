import * as THREE from 'three';

export default class Jsz{

    scene: THREE.Scene;

    constructor(scene: THREE.Scene){
        this.scene = scene;
    }

    drawBufferData(position: Array<number>, normal: Array<number>, uv: Array<number>, index:number[]):THREE.Mesh{
        let ap = new Float32Array(position);
        let an = new Float32Array(normal);
        let au = new Float32Array(uv);

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.BufferAttribute(ap, 3));
        geometry.addAttribute("normal", new THREE.BufferAttribute(an, 3));
        geometry.addAttribute("uv", new THREE.BufferAttribute(au, 2));
        geometry.setIndex(index);
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff9900}));
        this.scene.add(mesh);
      
        return mesh;
    }

    selfDraw(){
        var geometry = new THREE.BufferGeometry();
        var indices = [];
        var vertices = [];
        var normals = [];
        var colors = [];
        var size = 20;
        var segments = 10;
        var halfSize = size / 2;
        var segmentSize = size / segments;
        // 为简单网格几何体生成顶点、法线和颜色数据
        for (var i = 0; i <= segments; i++) {
            var y = (i * segmentSize) - halfSize;
            for (var j = 0; j <= segments; j++) {
                var x = (j * segmentSize) - halfSize;
                vertices.push(x, -y, 0);
                normals.push(0, 0, 1);
                var r = Math.random();
                var g = Math.random();
                colors.push(r, g, 1);
            }
        }
        // 生成索引（元素数组缓冲区的数据）
        for (var i = 0; i < segments; i++) {
            for (var j = 0; j < segments; j++) {
                var a = i * (segments + 1) + (j + 1);
                var b = i * (segments + 1) + j;
                var c = (i + 1) * (segments + 1) + j;
                var d = (i + 1) * (segments + 1) + (j + 1);
                // 每次迭代生成两个面（三角形）
                indices.push(a, b, d); // 第一个面
                indices.push(b, c, d); // 第二个面
            }
        }
        geometry.setIndex(indices); //设置索引
        // addAttribute ( name : String, attribute : BufferAttribute )
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        var material = new THREE.MeshPhongMaterial({
            specular: 0x111111,
            shininess: 250,
            side: THREE.DoubleSide,
            vertexColors: THREE.VertexColors
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0)
        this.scene.add(mesh);
    }
}