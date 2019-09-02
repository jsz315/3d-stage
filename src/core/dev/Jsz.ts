import * as THREE from 'three';
import CustomGroup from './CustomGroup';
import {BlobTooler} from '../tool/BlobTooler'

export default class Jsz{

    scene: THREE.Scene;
    lines: Array<Object>;
    multiple: boolean = false;
    customGroup: CustomGroup;
    selectedColor: string = "#ff0000";

    constructor(scene: THREE.Scene){
        this.scene = scene;
        this.lines = [];
        this.customGroup = new CustomGroup(this.scene);
                
        // let blobTooler = new BlobTooler();

        // let bs = "data:application/octet-stream;base64,AAAAPwAAAD8AAAA/AAAAPwAAAD8AAAC/AAAAPwAAAL8AAAA/AAAAPwAAAL8AAAC/AAAAvwAAAD8AAAC/AAAAvwAAAD8AAAA/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAA/AAAAvwAAAD8AAAC/AAAAPwAAAD8AAAC/AAAAvwAAAD8AAAA/AAAAPwAAAD8AAAA/AAAAvwAAAL8AAAA/AAAAPwAAAL8AAAA/AAAAvwAAAL8AAAC/AAAAPwAAAL8AAAC/AAAAvwAAAD8AAAA/AAAAPwAAAD8AAAA/AAAAvwAAAL8AAAA/AAAAPwAAAL8AAAA/AAAAPwAAAD8AAAC/AAAAvwAAAD8AAAC/AAAAPwAAAL8AAAC/AAAAvwAAAL8AAAC/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAgD8AAIA/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAgD8AAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AACAPwAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAIA/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAgD8AAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AACAPwAAgD8AAAAAAAAAAAAAgD8AAAAAAAACAAEAAgADAAEABAAGAAUABgAHAAUACAAKAAkACgALAAkADAAOAA0ADgAPAA0AEAASABEAEgATABEAFAAWABUAFgAXABUA";
        // GLTFTooler.save(blobTooler.dataURI2Blob(bs), "test.txt");

        // blobTooler.readRemoteBlob("/test.blo", (rdata: any)=>{
        //     blobTooler.blob2ArrayBuffer(rdata, (fdata:any) => {
        //         console.log(fdata);
        //         var position = new Float32Array(fdata, 0, 288 / 4);
        //         console.log(position);
        //     })
        // })
    }

    makeGroup():CustomGroup{
        // this.customGroup.clear();
        let customGroup = new CustomGroup(this.scene);
        this.lines.forEach((item:any) => {
            this.scene.remove(item.line);
            customGroup.push(item.obj);
        })
        this.lines = [];
        this.scene.add(customGroup);
        this.selectObject(customGroup);
        return customGroup;
    }

    splitGroup(group:any):void{
        if(group){
            this.lines = [];
            group.clear();
            this.scene.remove(group);
        }
    }


    test():void{
        let g = new CustomGroup(this.scene);
        g.position.x = 3;
        this.scene.add(g);

        console.log("gggggggggg", g);

        let m1 = new THREE.Mesh(new THREE.BoxGeometry());
        g.push(m1);

        let m2 = new THREE.Mesh(new THREE.BoxGeometry());
        m2.position.x = 1;
        g.push(m2);

        this.selectObject(g);
        g.scale.set(0.5, 0.5, 0.5);
        g.rotation.y = 0.4;

        setTimeout(()=>{
            // console.log("Quaternion", m2.getWorldQuaternion(new THREE.Quaternion()));
            g.clear();
            this.scene.remove(g);
        }, 2400);


        // let g = new THREE.Group();
        // this.scene.add(g);
        // g.position.x = 3;

        // let m = new THREE.Mesh(new THREE.BoxGeometry());
        // g.add(m);

        // setTimeout(()=>{
        //     console.log("ddddddd = ", m.getWorldPosition(new THREE.Vector3()), g.position);
        //     m.position.copy(m.getWorldPosition(new THREE.Vector3()));
    
        //     this.scene.add(m);
        // }, 300);
        
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

    remove(obj: THREE.Mesh):void{
        this.lines = this.lines.filter((item: any) => {
            if(item.obj == obj){
                this.scene.remove(item.line);
                return false;
            }
            return true;
        })
    }

    selectObject(obj: THREE.Object3D):void{
        let has = this.lines.find((item:any) => {
            item.line.material.color = new THREE.Color(this.selectedColor);
            return item.obj == obj;
        })

        if(has && this.multiple){
            return;
        }

        if(this.multiple){
            let line = new THREE.BoxHelper(obj, new THREE.Color(this.selectedColor));
            this.scene.add(line);
            this.lines.push({
                obj: obj,
                line: line
            })
        }
        else{
            let item:any = this.lines.length == 1 ? this.lines[0] : null;
            if(item){
                item.obj = obj;
                item.line.setFromObject(obj);
            }
            else{
                this.lines.forEach((item:any) => {
                    this.scene.remove(item.line);
                })

                let line = new THREE.BoxHelper(obj, new THREE.Color(this.selectedColor));
                this.scene.add(line);
                this.lines = [{
                    obj: obj,
                    line: line
                }];

            }
        }
        
    }

    update():void{
        this.lines.forEach((item:any) => {
            item.line.position.copy(item.obj.position);
            item.line.update();
        })
    }

    listObject(obj: THREE.Group):void{
        
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

    mergeTest():void{
        let n = false;
        let total = 3000;
        if(n){
            for(var i = 0; i < total; i++){
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
                })
                let mesh = new THREE.Mesh(geometry, material);
                let x = (0.5 - Math.random()) * 20;
                let y = (0.5 - Math.random()) * 20;
                let z = (0.5 - Math.random()) * 20;
                mesh.position.set(x, y, z);
                this.scene.add(mesh);
            }
        }
        else{
            let all = new THREE.Geometry();

            for(var i = 0; i < total; i++){
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
                })
                let mesh = new THREE.Mesh(geometry, material);
                let x = (0.5 - Math.random()) * 20;
                let y = (0.5 - Math.random()) * 20;
                let z = (0.5 - Math.random()) * 20;
                mesh.position.set(x, y, z);

                mesh.updateMatrix();
                all.merge(geometry, mesh.matrix);
            }
    
            let mesh = new THREE.Mesh(all);
            this.scene.add(mesh);

        }
        
    }
}