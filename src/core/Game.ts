import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import GameEvent from '@/event';

export default class Game {

    canvas: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    transformControls: TransformControls;
    orbitControls: OrbitControls;
    rayCaster: THREE.Raycaster;
    // dragControls: DragControls;
    dragList: Array<THREE.Object3D> = [];

    constructor(canvas: any) {
        GameEvent.ins.init(canvas);
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        })
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.camera.position.set(3, 4, 5);
        this.camera.lookAt(new THREE.Vector3());
        this.orbitControls = new OrbitControls(this.camera, canvas);
        this.transformControls = new TransformControls( this.camera, this.renderer.domElement );
        this.transformControls.addEventListener( 'dragging-changed', ( event )=> {
            this.orbitControls.enabled = ! event.value;
        } );

        this.transformControls.addEventListener('objectChange', (event) => {
            this.sendTransform(this.transformControls.object);
        })

        this.rayCaster = new THREE.Raycaster();
        canvas.addEventListener("mousedown", (e: MouseEvent) => {this.selectObject(e)});


        GameEvent.ins.on(GameEvent.CHANGE_PARAM, (e:any) => {this.changeItemParam(e)});
        GameEvent.ins.on(GameEvent.CHANGE_TRANSFORM, (e:any) => {this.changeItemTransform(e)});
        GameEvent.ins.on(GameEvent.DELETE_ITEM, (e:any) => {this.deleteItem(e)});
        GameEvent.ins.on(GameEvent.COPY_ITEM, (e:any) => {this.copyItem(e)});

        window.addEventListener("resize", e => this.onResize(e), false);

        // this.dragControls = new DragControls(this.dragList, this.camera, this.renderer.domElement);
        // this.dragControls.addEventListener("hoveron", (event) => {
        //     this.transformControls.attach(event.object);
        //     this.transformControls.setSize(0.4);
        // });

        window.addEventListener( 'keydown',  ( event ) => {
            switch ( event.keyCode ) {

                case 81: // Q
                    this.transformControls.setSpace( this.transformControls.space === "local" ? "world" : "local" );
                    break;

                case 87: // W
                    this.transformControls.setMode( "translate" );
                    break;

                case 69: // E
                    this.transformControls.setMode( "rotate" );
                    break;

                case 82: // R
                    this.transformControls.setMode( "scale" );
                    break;

            }

        } );

        this.init();

    }

    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    deleteItem(e:CustomEvent):void{
        let mesh:any = this.transformControls.object;
        let frame:any = mesh.children[ 0 ];
        if(frame){
            frame.geometry.dispose();
            frame.material.dispose();
            mesh.remove(frame);
        }

        mesh.geometry.dispose();
        mesh.material.dispose();
        this.scene.remove(mesh);
        this.scene.remove(this.transformControls);

        this.dragList = this.dragList.filter(item=>{
            return item != mesh;
        });
    }

    copyItem(e:CustomEvent):void{
        let oldMesh = this.transformControls.object;
        let newMesh = oldMesh.clone();
        this.scene.add(newMesh);

        this.transformControls.attach( newMesh );
        // this.orbitControls.enabled = false;
        this.scene.add( this.transformControls );
        this.dragList.push(newMesh);
        this.sendInfo(newMesh);

    }

    changeItemTransform(e:CustomEvent):void{
        let mesh = this.transformControls.object;
        let p = e.detail;
        mesh.position.set(p.position.x, p.position.y, p.position.z);
        mesh.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
        mesh.scale.set(p.scale.x, p.scale.y, p.scale.z);
    }

    changeItemParam(e:CustomEvent):void{
        let mesh = this.transformControls.object;
        let geo;
        console.log(e);
        let p = e.detail;
        if(mesh.name == "BoxBufferGeometry"){
            geo = new THREE.BoxBufferGeometry(p.width, p.height, p.depth, p.widthSegments, p.heightSegments, p.depthSegments);
        }
        else if(mesh.name == "SphereBufferGeometry"){
            geo = new THREE.SphereBufferGeometry(p.radius, p.widthSegments, p.heightSegments, p.phiStart, p.phiLength,p.thetaStart, p.thetaLength);
        }
        else if(mesh.name == "IcosahedronBufferGeometry"){
            geo = new THREE.IcosahedronBufferGeometry(p.radius, p.detail);
        }
        else if(mesh.name == "CylinderBufferGeometry"){
            geo = new THREE.CylinderBufferGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength);
        }
        else if(mesh.name == "OctahedronBufferGeometry"){
            geo = new THREE.OctahedronBufferGeometry(p.radius, p.detail);
        }
        else if(mesh.name == "TorusBufferGeometry"){
            geo = new THREE.TorusBufferGeometry(p.radius, p.tube, p.radialSegments, p.tubularSegments, p.arc);
        }
        this.updateGroupGeometry(mesh, geo);
    }

    sendInfo(mesh: any):void{
        let parameters = mesh.geometry.parameters;        
        GameEvent.ins.send(GameEvent.SELECT_ITEM, {
            name: mesh.name,
            parameters: parameters
        });
        this.sendTransform(mesh);
    }

    sendTransform(mesh: THREE.Object3D):void{
        if(!mesh){
            return;
        }
        let position = mesh.position;
        let rotation = mesh.rotation;
        let scale = mesh.scale;
        GameEvent.ins.send(GameEvent.CHANGE_TRANSFORM, {
            position: {
                x: position.x,
                y: position.y,
                z: position.z
            },
            rotation: {
                x: rotation.x,
                y: rotation.y,
                z: rotation.z
            },
            scale: {
                x: scale.x,
                y: scale.y,
                z: scale.z
            }
        });
    }

    selectObject(e: MouseEvent):void{
        e.preventDefault();
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1; 
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.rayCaster.setFromCamera(mouse, this.camera);
        let intersectObjects = this.rayCaster.intersectObjects(this.dragList, true);
        if(intersectObjects[0]){
            this.transformControls.attach(intersectObjects[0].object);
            this.sendInfo(intersectObjects[0].object as THREE.Mesh);
        }
        else{
            this.orbitControls.enabled = true;
        }
        console.log(intersectObjects);
    }

    updateGroupGeometry( mesh:any, geometry:any ):void {
        if ( geometry.isGeometry ) {
            geometry = new THREE.BufferGeometry().fromGeometry( geometry );
        }
        let frame = mesh.children[ 0 ];
        if(frame){
            frame.geometry.dispose();
            frame.material.dispose();
            mesh.remove(frame);
        }

        mesh.geometry.dispose();
        mesh.geometry = geometry;
        mesh.add(this.getFrame(geometry));
    }

    getCanvas(word: any, color:any){
        let w = 512;
        let h = 512;
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        let ctx:any = canvas.getContext("2d");
        // ctx.fillStyle = "#ffffff";
        // ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        // ctx.fill();
        ctx.font = 420 + "px bold";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(word, w / 2, h / 2); 
        return canvas;
    }

    addWorldTip(word:any, color:any, position:THREE.Vector3){
        var spriteMap = new THREE.CanvasTexture(this.getCanvas(word, color));
        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, transparent: true } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.position.copy(position);
        this.scene.add( sprite );
    }

    init(): void {
        let light = new THREE.HemisphereLight(0xaaaaaa, 0x444444);
        this.scene.add(light);
        
        // let helper = new THREE.HemisphereLightHelper(light, 4)
        // this.scene.add(helper);
        let grid = new THREE.GridHelper(80, 80, 0xcee8f9, 0xf0f0f0);
        this.scene.add(grid);

        this.addWorldTip("x", "#ff0000", new THREE.Vector3(42, 0.5, 0));
        this.addWorldTip("-x", "#ff0000", new THREE.Vector3(-42, 0.5, 0));
        this.addWorldTip("z", "#0000ff", new THREE.Vector3(0, 0.5, 42));
        this.addWorldTip("-z", "#0000ff", new THREE.Vector3(0, 0.5, -42));
       

        // let box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        // this.scene.add(box);
        // this.transformControls.attach( helper );
        this.renderer.domElement.click();
        this.animate();        
    }

    animate(): void {
        requestAnimationFrame(() => { this.animate() });
        this.renderer.render(this.scene, this.camera);
    }

    getFrame(geometry: THREE.BufferGeometry):THREE.Mesh {
        let wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            opacity: 0.8, 
            wireframe: true, 
            transparent: true,
            depthTest: true,
            depthWrite: true
        });
        console.log("getFrame");
        let wireframe = new THREE.Mesh( geometry, wireframeMaterial );
        wireframe.name = "frame_" + geometry.type;
        return wireframe;
    }

    addObject(type: string, event: MouseEvent){
        let geo;
        console.log("add " + type);
        switch(type){
            case "BoxBufferGeometry":
                geo = new THREE.BoxBufferGeometry(1, 1, 1);
                break;
            case "SphereBufferGeometry":
                geo = new THREE.SphereBufferGeometry(0.5, 12, 12);
                break;
            case "IcosahedronBufferGeometry":
                geo = new THREE.IcosahedronBufferGeometry(1, 0);
                break;
            case "CylinderBufferGeometry":
                geo = new THREE.CylinderBufferGeometry(0.5, 1, 2, 8, 8);
                break;
            case "OctahedronBufferGeometry":
                geo = new THREE.OctahedronBufferGeometry(0.5, 0);
                break;
            case "TorusBufferGeometry":
                geo = new THREE.TorusBufferGeometry(2, 0.5, 8, 20, Math.PI * 2);
                break;
            default: 
                break;
        }
        if(!geo){
            console.log("no geo");
            return;
        }

        //屏幕坐标转三维坐标对象
        var vector = new THREE.Vector3();
        vector.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 
        );
        vector.unproject( this.camera );
        var dir = vector.sub( this.camera.position ).normalize();
        var distance = - this.camera.position.z / dir.z;
        var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
        
        // var material = new THREE.MeshStandardMaterial( {
        //     color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
        //     roughness: 0.5,
        //     metalness: 0,
        //     flatShading: true
        // } );

        var material = new THREE.MeshPhongMaterial( { 
            color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
            emissive: 0x072534, 
            side: THREE.FrontSide,
            transparent: true,
            opacity: 1, 
            flatShading: true 
        } );

        let mesh = new THREE.Mesh(geo, material);
        mesh.name = type;
        this.scene.add(mesh);

        mesh.add(this.getFrame(geo));
        // mesh.position.copy(pos);

        this.transformControls.attach( mesh );
        this.orbitControls.enabled = false;
        // this.transformControls.setMode("translate");
        this.scene.add( this.transformControls );
        this.dragList.push(mesh);
        // this.transformControls.enabled = true;

        // this.renderer.domElement.click();
        // this.renderer.domElement.dispatchEvent(event);
    }

}