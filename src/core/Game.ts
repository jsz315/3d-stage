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

        this.rayCaster = new THREE.Raycaster();
        canvas.addEventListener("mousedown", (e: MouseEvent) => {this.selectObject(e)});

        GameEvent.ins.on(GameEvent.CHANGE_PARAM, (e:any) => {this.changeItemParam(e)});

        // this.dragControls = new DragControls(this.dragList, this.camera, this.renderer.domElement);
        // this.dragControls.addEventListener("hoveron", (event) => {
        //     this.transformControls.attach(event.object);
        //     this.transformControls.setSize(0.4);
        // });

        this.init();
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
        mesh.children[ 0 ].geometry.dispose();
        mesh.children[ 0 ].geometry = new THREE.WireframeGeometry( geometry );
        mesh.geometry.dispose();
        mesh.geometry = geometry;
    }

    init(): void {
        let light = new THREE.HemisphereLight(0xaaaaaa, 0x444444);
        this.scene.add(light);
        // let helper = new THREE.HemisphereLightHelper(light, 4)
        // this.scene.add(helper);
        let grid = new THREE.GridHelper(80, 80, 0xe3e3e3, 0xf0f0f0);
        this.scene.add(grid);

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
            color: 0x000000, 
            opacity: 1, 
            wireframe: true, 
            transparent: true 
        });
        let wireframe = new THREE.Mesh( geometry, wireframeMaterial );
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
            side: THREE.DoubleSide, 
            flatShading: true 
        } );

        let mesh = new THREE.Mesh(geo, material);
        mesh.name = type;
        this.scene.add(mesh);

        mesh.add(this.getFrame(geo));
        mesh.position.copy(pos);

        this.transformControls.attach( mesh );
        this.orbitControls.enabled = false;
        this.transformControls.setMode("translate");
        this.scene.add( this.transformControls );
        this.dragList.push(mesh);
        // this.transformControls.enabled = true;

        // this.renderer.domElement.click();
        // this.renderer.domElement.dispatchEvent(event);
    }

}