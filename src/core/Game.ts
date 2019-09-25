import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import GameEvent from '@/core/event';
import ParamTooler from './tool/ParamTooler';
import Loading from './tool/Loading';
import Factory from './tool/Factory';
import LoadTooler from './tool/LoadTooler';
import SelectTooler from './tool/SelectTooler';
import ListSceneTooler from './tool/ListSceneTooler';
import Root from './view/Root';
import ExportModel from './dev/ExportModel';
import ExportTooler from './tool/ExportTooler';
import GLTFTooler from './tool/GLTFTooler';

export default class Game {
    canvas: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    stats: any;
    loading: Loading;
    isRoot: boolean = true;
    outsideObj: any;
    insideObj: any;
    isInside: boolean = false;
    root: Root;

    constructor(canvas: any) {

        GameEvent.ins.init(canvas);

        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x9f9f9f));
        this.renderer.shadowMap.enabled = true;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(3, 4, 5);
        this.camera.lookAt(new THREE.Vector3());

        this.loading = new Loading();

        this.root = new Root(this.scene, this.camera, canvas);
        this.scene.add(this.root);

        this.addEventListener();
        this.animate();
    }

    addEventListener(): void {
        window.addEventListener("resize", e => this.onResize(e), false);
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            console.log('mousedown');
            this.mouseDown(e);
        });
        window.addEventListener("keydown", (event) => {
            console.log(event.keyCode);
            switch (event.keyCode) {
                case 81: // Q
                    this.root.selectView.toggerSpace();
                    break;
                case 87: // W
                    this.root.selectView.setMode("translate");
                    break;
                case 69: // E
                    this.root.selectView.setMode("rotate");
                    break;
                case 82: // R
                    this.root.selectView.setMode("scale");
                    break;
                case 17: // ctrl
                    this.root.multiple = true;
                    break;
            }

        });

        window.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 17: // ctrl
                    this.root.multiple = false;
                    break;
            }

        });
    }

    standardExport(useBase64:boolean):void{
        ExportTooler.standardExport(useBase64, this.root.container);
    }

    customExport(embed:boolean):void{
        ExportTooler.customExport(embed, this.root.container);
    }

    changeIsRoot(m: boolean):void{
        this.isRoot = m;
    }

    get curMesh():any{
        return this.insideObj;
    }

    setStats(stats: any): void {
        this.stats = stats;
    }

    onResize(e: Event): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    deleteItem(): void {
        this.root.deleteItem();
    }

    copyItem(): void {
        let oldMesh = this.curMesh;
        let newMesh = oldMesh.clone();
        this.root.addObject(newMesh);
        this.sendItemInfo(newMesh);
    }

    changeItemTransform(p: any): void {
        let obj = this.curMesh;
        obj.position.set(p.position.x, p.position.y, p.position.z);
        obj.rotation.set(ParamTooler.angleToRadian(p.rotation.x), ParamTooler.angleToRadian(p.rotation.y), ParamTooler.angleToRadian(p.rotation.z));
        // obj.scale.set(p.scale.x, p.scale.y, p.scale.z);
        let n = p.scale.scalar;
        obj.scale.set(n, n, n);
        this.sendItemInfo(obj);
    }

    changeGeometryParam(p: any): void {
        let mesh = this.curMesh;
        let geo;
        if(mesh.name.indexOf("Buffer") != -1){
            geo = Factory.getBufferGeometry(mesh.name, p);
        }
        else{
            geo = Factory.getGeometry(mesh.name, p);
        }

        if (geo) {
            this.updateGroupGeometry(mesh, geo);
            this.sendItemInfo(mesh);
        }
    }

    toggerMaterial(type: string): void {
        let mesh: any = this.curMesh;
        if(mesh){
            ParamTooler.disposeMaterial(mesh);
            let material = Factory.getMaterial(type);
            if (material) {
                mesh.material = material;
            }
            this.sendItemInfo(mesh);
        }
    }

    changeCommonMaterial(key: string, data: any): void {
        let mesh: any = this.curMesh;
        let material = ParamTooler.getCurMaterial(mesh);
        let type = ParamTooler.getType(key);

        if (key == "normalScale") {
            material[key] && material[key].set(1, -1).multiplyScalar(Number(data));
        }
        else {
            if (type == ParamTooler.TYPE_COLOR) {
                material[key] = new THREE.Color(data);
            }
            else if (type == ParamTooler.TYPE_NUMBER) {
                material[key] = Number(data);
            }
            else if (type == ParamTooler.TYPE_SWITCH) {
                material[key] = Boolean(data);
            }
        }
        this.sendItemInfo(mesh);
    }

    changeRepeatMaterial(key: string, type: string, data: any): void {
        let mesh: any = this.curMesh;
        let material = ParamTooler.getCurMaterial(mesh);
        if (material[key]) {
            if (type == "repeatX") {
                material[key].repeat.x = Number(data);
            }
            else if (type == "repeatY") {
                material[key].repeat.y = Number(data);
            }
            material[key].needsUpdate = true;
            material.needsUpdate = true;
            this.sendItemInfo(mesh);
        }
    }

    changeTextureMaterial(key: string, data: any): void {
        let mesh: any = this.curMesh;
        let material = ParamTooler.getCurMaterial(mesh);
        let texture = new THREE.TextureLoader().load(data, () => {
            material[key].needsUpdate = true;
            material.needsUpdate = true;
            this.sendItemInfo(mesh);
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        material[key] = texture;
    }

    changeScene(data: any): void {
        if (data.fogVisible) {
            let fog: any = this.scene.fog;
            if (fog) {
                fog.color = new THREE.Color(data.color);
                fog.near = Number(data.near);
                fog.far = Number(data.far);
            }
            else {
                this.scene.fog = new THREE.Fog(new THREE.Color(data.fogColor).getHex(), Number(data.near), Number(data.far));
            }
        }
        else {
            this.scene.fog = null;
        }
        this.renderer.setClearColor(new THREE.Color(data.fogColor));
        this.root.grid.visible = data.gridVisible;
        this.root.selectedColor = data.selectedColor;
    }

    deleteTexture(key: string): void {
        let mesh: any = this.curMesh;
        let material = ParamTooler.getCurMaterial(mesh);
        material[key] = null;
        material.needsUpdate = true;
        this.sendItemInfo(mesh);
    }

    changeLightParam(key: string, data: any): void {
        let light:any = this.curMesh;
        let type = ParamTooler.getType(key);
        if (type == ParamTooler.TYPE_COLOR) {
            light[key] = new THREE.Color(data);
        }
        else if (type == ParamTooler.TYPE_NUMBER) {
            light[key] = Number(data);
        }
        else if (type == ParamTooler.TYPE_SWITCH) {
            light[key] = Boolean(data);
        }
        this.sendItemInfo(light);
    }
    
    selectObject(obj: THREE.Object3D):void{
        this.root.selectView.select(obj);
        this.sendItemInfo(obj);
    }

    mouseDown(e: MouseEvent): void {
        e.preventDefault();
        let aim: any = this.root.select(e, this.camera);
        this.selectObject(aim);
    }

    updateGroupGeometry(mesh: any, geometry: any): void {
        mesh.geometry.dispose();
        mesh.geometry = geometry;

        this.sendItemInfo(mesh);
    }

    addLight(type: string): void {
        let light: any = Factory.getLight(type);
        if (light) {
            this.root.addLight(light);
            this.sendItemInfo(light);
        }
    }

    addObject(type: string, event: MouseEvent) {
        let mesh = this.root.addItem(type);
        if(mesh){
            this.sendItemInfo(mesh);
        }
    }

    sendItemInfo(m: any): void {
        this.insideObj = SelectTooler.getInsideObject(m);
        let data = ParamTooler.getObjectData(this.insideObj, this.scene, this.root.grid.visible, this.root.selectedColor);
        let list = [data];
        GameEvent.ins.send(GameEvent.ITEM_INFO, list);
    }

    fitModel(group:THREE.Object3D):void{
        group.traverse((child: any) => {
            if (child.isMesh) {
                child.name = "load_mesh";
                if(Array.isArray(child.material)){
                    console.log("array material");
                    for(var i:number = 0; i < child.material.length; i++){
                        child.material[i].roughness = 0.3;
                        child.material[i].metalness = 0.1;
                    }
                }
                
            }
        })

        let parent:THREE.Object3D = group;
        while(parent.children.length == 1){
            parent = parent.children[0];
        }

        var offset:THREE.Vector3 = GLTFTooler.getOffsetVector3(parent);
        let scale:number = GLTFTooler.getFitScale(parent, 10);
        // let aim = new THREE.Object3D();
        let p = parent.position;
        // parent.position.set(p.x - offset.x, p.y - offset.y, p.z - offset.z);
        parent.position.set(0, 0, 0);
        parent.scale.multiplyScalar(scale);

        // while(parent.children.length){
        //     let obj = parent.children[0];
        //     let p = obj.position;
        //     obj.position.set(p.x - offset.x, p.y - offset.y, p.z - offset.z);
        //     aim.add(obj);
        // }
        // aim.scale.multiplyScalar(scale);
        // aim.rotateX(-Math.PI / 2);
        this.root.addObject(parent);
        parent.name = "load_scene";
    }

    importGltf(data: any): void {
        let loader = new GLTFLoader();
        loader.parse(data, "", (gltf: GLTF) => {
            console.log("gltf loaded");
            console.log(gltf);
            this.fitModel(gltf.scene);
        })
    }

    addCustomGeometry(data: any) {
        if (!data) {
            return;
        }
        let position = JSON.parse(data.position);
        let normal = JSON.parse(data.normal);
        let uv = JSON.parse(data.uv);
        let index = JSON.parse(data.index);
        let mesh = Factory.getDrawBufferMesh(position, normal, uv, index);
        this.root.addObject(mesh);
    }

    loadServeGltf(url:string):void{
        let loader = new GLTFLoader();
        loader.setCrossOrigin("anonymous");
        let list = LoadTooler.getUrlPath(url);
        loader.setPath(list[0]);
        loader.load(list[1], (gltf) => {
            this.fitModel(gltf.scene);
            this.scene.remove(this.loading);
        }, (e: ProgressEvent) => {
            let n = Math.floor(e.loaded / e.total * 100);
            console.log("load " + n + "%");
            this.loading.update(n + "%");
            this.scene.add(this.loading);
        })
    }

    loadServeFbx(url:string):void{
        let loader = new FBXLoader();
        loader.setCrossOrigin("anonymous");
        let list = LoadTooler.getUrlPath(url);
        loader.setPath(list[0]);
        loader.load(list[1], (group) => {
            this.fitModel(group);
            this.scene.remove(this.loading);
        }, (e: ProgressEvent) => {
            let n = Math.floor(e.loaded / e.total * 100);
            console.log("load " + n + "%");
            this.loading.update(n + "%");
            this.scene.add(this.loading);
        })
    }

    loadServeModel(url:string){
        if(url.toLocaleLowerCase().indexOf(".fbx") != -1){
            this.loadServeFbx(url);
        }
        else{
            this.loadServeGltf(url);
        }
    }

    makeGroup():void{
        let group = this.root.makeGroup();
        this.selectObject(group);
    }

    splitGroup():void{
        this.root.splitGroup();
    }

    animate(): void {
        requestAnimationFrame(() => { this.animate() });
        this.renderer.render(this.scene, this.camera);
        this.stats && this.stats.update();
        this.root.update();
    }

    getSceneTree():any{
        let s = ListSceneTooler.parse(this.scene);
        return s;
    }

    selectedItemByUUID(uuid:string):any{
        let obj:any = this.scene.getObjectByProperty('uuid', uuid);
        this.selectObject(obj);
    }

    changeItemName(name:string):any{
        this.curMesh.name = name;
    }

    bspSubtract():void{
        this.root.bspSubtract();
    }

    bspIntersect():void{
        this.root.bspIntersect();
    }

    bspUnion():void{
        this.root.bspUnion();
    }
}