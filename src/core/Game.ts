import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Game {

    canvas: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;

    constructor(canvas: any) {
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
        new OrbitControls(this.camera, canvas);
        this.init();
    }

    init(): void {
        let light = new THREE.HemisphereLight(0xaaaaaa, 0x444444);
        this.scene.add(light);
        this.scene.add(new THREE.HemisphereLightHelper(light, 4));
        let grid = new THREE.GridHelper(80, 80, 0xe3e3e3, 0xf0f0f0);
        this.scene.add(grid);

        let box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(box);
        this.animate();
    }

    animate(): void {
        requestAnimationFrame(() => { this.animate() });
        this.renderer.render(this.scene, this.camera);
    }

    addObject(type: string){
        let geo;
        switch(type){
            case "BoxBufferGeometry":
                geo = new THREE.BoxBufferGeometry(1, 1, 1);
                break;
            case "SphereBufferGeometry":
                geo = new THREE.SphereBufferGeometry(0.5, 12, 12);
                break;
            case "DodecahedronBufferGeometry":
                geo = new THREE.DodecahedronBufferGeometry(0.5, 8);
                break;
            case "CylinderBufferGeometry":
                geo = new THREE.CylinderBufferGeometry(0.5, 1, 2, 8, 8);
                break;
                
        }
        var material = new THREE.MeshStandardMaterial( {
            color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
            roughness: 0.5,
            metalness: 0,
            flatShading: true
        } );

        let mesh = new THREE.Mesh(geo, material);
        this.scene.add(mesh);
    }

}