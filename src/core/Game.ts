import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import GameEvent from '@/core/event';
import GLTFTooler from './tool/GLTFTooler';
import ParamTooler from './tool/ParamTooler';
import Loading from './tool/Loading';
import Factory from './tool/Factory';
import LoadTooler from './tool/LoadTooler';
import SelectTooler from './tool/SelectTooler';
import ListSceneTooler from './tool/ListSceneTooler';
import Root from './view/Root';

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
        this.renderer.setClearColor(new THREE.Color(0xffffff));
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
        // this.scene.add(newMesh);

        if (oldMesh.name.match(/Custom.*Light/)) {
            this.root.addLight(newMesh);
            this.sendLightInfo(newMesh);
        }
        else {
            this.root.addObject(newMesh);
            this.sendMeshInfo(newMesh);
        }
    }

    changeItemTransform(p: any): void {
        // let obj = this.transformControls.object;
        let obj = this.curMesh;
        obj.position.set(p.position.x, p.position.y, p.position.z);
        obj.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
        obj.scale.set(p.scale.x, p.scale.y, p.scale.z);
        this.sendMeshInfo(obj);
    }

    changeGeometryParam(p: any): void {
        // let mesh = this.transformControls.object;
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
            this.sendMeshInfo(mesh);
        }
    }

    toggerMaterial(type: string): void {
        let mesh: any = this.curMesh;
        if(mesh){
            mesh.material && mesh.material.dispose();
            let material = Factory.getMaterial(type);
            if (material) {
                mesh.material = material;
            }
            this.sendMeshInfo(mesh);
        }
    }

    changeCommonMaterial(key: string, data: any): void {
        // let mesh:any = this.transformControls.object;
        let mesh: any = this.curMesh;
        let type = ParamTooler.getType(key);

        if (key == "normalScale") {
            mesh.material[key] && mesh.material[key].set(1, -1).multiplyScalar(Number(data));
        }
        else {
            if (type == ParamTooler.TYPE_COLOR) {
                mesh.material[key] = new THREE.Color(data);
            }
            else if (type == ParamTooler.TYPE_NUMBER) {
                mesh.material[key] = Number(data);
            }
            else if (type == ParamTooler.TYPE_SWITCH) {
                mesh.material[key] = Boolean(data);
            }
        }
        this.sendMeshInfo(mesh);
    }

    changeRepeatMaterial(key: string, type: string, data: any): void {
        // let mesh:any = this.transformControls.object;
        let mesh: any = this.curMesh;
        if (mesh.material[key]) {
            if (type == "repeatX") {
                mesh.material[key].repeat.x = Number(data);
            }
            else if (type == "repeatY") {
                mesh.material[key].repeat.y = Number(data);
            }
            mesh.material[key].needsUpdate = true;
            mesh.material.needsUpdate = true;
            this.sendMeshInfo(mesh);
        }
    }

    changeTextureMaterial(key: string, data: any): void {
        // let mesh:any = this.transformControls.object;
        let mesh: any = this.curMesh;
        let texture = new THREE.TextureLoader().load(data, () => {
            mesh.material[key].needsUpdate = true;
            mesh.material.needsUpdate = true;
            this.sendMeshInfo(mesh);
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        mesh.material[key] = texture;
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
        // let mesh:any = this.transformControls.object;
        let mesh: any = this.curMesh;
        mesh.material[key] = null;
        mesh.material.needsUpdate = true;
        this.sendMeshInfo(mesh);
    }

    changeLightParam(key: string, data: any): void {
        // let light: any = this.transformControls.object;
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
        this.sendLightInfo(light);
    }

    sendLightInfo(light: any): void {
        
    }

    /**
     * 点击物体发送当前对象全部数据
     * @param mesh 
     */
    sendMeshInfo(mesh: any): void {
        if (!mesh) {
            return;
        }
        console.log(mesh.type);
        // this.curMesh = mesh;
        let parameters = mesh.geometry ? mesh.geometry.parameters : null;
        let material = ParamTooler.copyMaterialParam(mesh.material);
        let transform = ParamTooler.copyTransform(mesh);

        GameEvent.ins.send(GameEvent.SELECT_ITEM, {
            name: mesh.name,
            type: mesh.type,
            parameters: parameters,
            material: material,
            materialType: mesh.material ? mesh.material.type : "",
            transform: transform
        });
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

    exportObject(): void {
        this.root.exportObject();
    }

    loadObject(data: any): void {
        let loader = new GLTFLoader();
        loader.parse(data, "", (gltf: GLTF) => {
            gltf.scene.children.forEach((item: any)=>{
                this.root.addObject(item);
            })
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

    loadTest(): void {
        let loadTooler = new LoadTooler();
        loadTooler.start('/asset/obj/win.bin', (n: number) => {
            this.loading.update(n + "%");
            this.scene.add(this.loading);
        }, () => {
            this.startLoad();
        }, () => {
            alert("加载失败，请刷新页面重新尝试");
        })
    }

    startLoad(): void {
        let loader = new GLTFLoader();
        loader.setPath('/asset/obj/');
        loader.load('win.gltf', (gltf) => {

            console.log("gltf");
            console.log(gltf);
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    child.name = "load_mesh";
                    child.material.roughness = 0.3;
                    child.material.metalness = 0.1;
                    child.updateMatrix();
                }
            })

            let aim: any = gltf.scene.children[0].children[0].children[0];
            let size = new THREE.Box3().setFromObject(aim).getSize(new THREE.Vector3());
            let max = Math.max(size.x, size.y, size.z);
            let scale = 10 / max;
            aim.scale.set(scale, scale, scale);


            aim.position.set(0, 0, 0);

            let group = new THREE.Object3D();
            group.add(aim);
            group.rotateX(Math.PI / 2);

            this.root.addObject(group);

            group.name = "load_scene";

            this.scene.remove(this.loading);
        }, (e: ProgressEvent) => {
            let n = Math.floor(e.loaded / e.total * 100);
            console.log("load " + n + "%");
            this.loading.update(n + "%");
            this.scene.add(this.loading);
        })
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