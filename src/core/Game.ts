import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import GameEvent from '@/core/event';
import GLTFTooler from './tool/GLTFTooler';
import ParamTooler from './tool/ParamTooler';
import Jsz from './dev/Jsz';
import FocusLight from './light/FocusLight';
import ColorTooler from "./tool/ColorTooler";
import Loading from './tool/Loading';
import Factory from './tool/Factory';
import LoadTooler from './tool/LoadTooler';
import WorldTooler from './tool/WorldTooler';
import SelectTooler from './tool/SelectTooler';

export default class Game {
    focusLight: FocusLight;
    canvas: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    transformControls: TransformControls;
    orbitControls: OrbitControls;
    rayCaster: THREE.Raycaster;
    dragList: Array<THREE.Object3D> = [];
    grid: THREE.GridHelper;
    stats: any;
    // curMesh: any;
    jsz: Jsz;
    loading: Loading;
    isRoot: boolean = true;
    outsideObj: any;
    insideObj: any;
    isInside: boolean = false;

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

        this.orbitControls = new OrbitControls(this.camera, canvas);

        this.jsz = new Jsz(this.scene);
        this.focusLight = new FocusLight(0xffffff, 0.84);
        this.scene.add(this.focusLight);

        this.loading = new Loading();

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.rayCaster = new THREE.Raycaster();

        this.grid = new THREE.GridHelper(80, 80, 0xcee8f9, 0xf0f0f0);
        (this.grid.material as any).transparent = true;
        (this.grid.material as any).opacity = 0.4;
        this.scene.add(this.grid);

        WorldTooler.addAxes("x", "#ff0000", new THREE.Vector3(42, 0.5, 0), this.grid);
        WorldTooler.addAxes("-x", "#ff0000", new THREE.Vector3(-42, 0.5, 0), this.grid);
        WorldTooler.addAxes("z", "#0000ff", new THREE.Vector3(0, 0.5, 42), this.grid);
        WorldTooler.addAxes("-z", "#0000ff", new THREE.Vector3(0, 0.5, -42), this.grid);

        this.addEventListener();
        this.animate();
    }

    addEventListener(): void {
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            console.log('mousedown');
            this.mouseDown(e);
        });

        this.transformControls.addEventListener("dragging-changed", (event) => {
            console.log('dragging-changed');
            this.orbitControls.enabled = !event.value;
        });

        this.transformControls.addEventListener("objectChange", (event) => {
            console.log('objectChange');
            // if (this.transformControls.object.name.indexOf("Light") != -1) {
            //     this.sendLightInfo(this.transformControls.object);
            // }
            // else {
            //     this.sendMeshInfo(this.transformControls.object);
            // }
            // this.scene.add(this.transformControls);
        })

        window.addEventListener("resize", e => this.onResize(e), false);
        window.addEventListener("keydown", (event) => {
            console.log(event.keyCode);
            switch (event.keyCode) {
                case 81: // Q
                    this.transformControls.setSpace(this.transformControls.space === "local" ? "world" : "local");
                    break;
                case 87: // W
                    this.transformControls.setMode("translate");
                    break;
                case 69: // E
                    this.transformControls.setMode("rotate");
                    break;
                case 82: // R
                    this.transformControls.setMode("scale");
                    break;
                case 17: // ctrl
                    this.jsz.multiple = true;
                    break;
            }

        });

        window.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 17: // ctrl
                    this.jsz.multiple = false;
                    break;
            }

        });
    }

    changeIsRoot(m: boolean):void{
        this.isRoot = m;
    }

    get curMesh():any{
        if(this.isRoot){
            return this.outsideObj;
        }
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
        // let mesh: any = this.transformControls.object;
        let mesh: any = this.curMesh;
        if (!mesh) {
            return;
        }

        mesh.geometry && mesh.geometry.dispose();
        mesh.material && mesh.material.dispose();

        this.scene.remove(mesh);
        this.scene.remove(this.transformControls);

        this.jsz.remove(mesh);

        this.dragList = this.dragList.filter(item => {
            return item != mesh;
        });
    }

    copyItem(): void {
        // let oldMesh = this.transformControls.object;
        let oldMesh = this.curMesh;
        let newMesh = oldMesh.clone();
        this.scene.add(newMesh);

        this.transformControls.attach(newMesh);
        // this.orbitControls.enabled = false;
        this.scene.add(this.transformControls);
        this.dragList.push(newMesh);
        if (oldMesh.name.match(/Custom.*Light/)) {
            this.sendLightInfo(newMesh);
        }
        else {
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
        let geo = Factory.getBufferGeometry(mesh.name, p);
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
        this.grid.visible = data.gridVisible;
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
        // if (light.name.match(/Custom.*Light/)) {
        //     let transform = ParamTooler.copyTransform(light);
        //     GameEvent.ins.send(GameEvent.SELECT_LIGHT, {
        //         name: light.name,
        //         parameters: light.parameters,
        //         transform: transform
        //     });
        //     light.update();
        // }
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
        this.sendItemInfo(obj);
    }

    mouseDown(e: MouseEvent): void {
        e.preventDefault();
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        let aim: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let intersectObjects = this.rayCaster.intersectObjects(this.dragList, true);
        if (intersectObjects[0]) {
            let obj: any = intersectObjects[0].object;
            aim = obj;
        }
        this.selectObject(aim);
        console.log(intersectObjects);
    }

    updateGroupGeometry(mesh: any, geometry: any): void {
        if (geometry.isGeometry) {
            geometry = new THREE.BufferGeometry().fromGeometry(geometry);
        }

        mesh.geometry.dispose();
        mesh.geometry = geometry;

        this.sendItemInfo(mesh);
    }

    addLight(type: string): void {
        let light: any = Factory.getLight(type);
        if (light) {
            this.scene.add(light);
            this.dragList.push(light);
            this.transformControls.attach(light);
            this.scene.add(this.transformControls);
            this.orbitControls.enabled = false;
            this.sendItemInfo(light);
        }

    }

    addObject(type: string, event: MouseEvent) {
        let geo = Factory.getBufferGeometry(type, null);
        if (!geo) {
            return;
        }

        //屏幕坐标转三维坐标对象
        var vector = new THREE.Vector3();
        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        vector.unproject(this.camera);
        // var dir = vector.sub(this.camera.position).normalize();
        // var distance = - this.camera.position.z / dir.z;
        // var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

        var material = new THREE.MeshStandardMaterial({
            color: ColorTooler.getRandomColor(),
            emissive: 0x072534,
            side: THREE.FrontSide,
            transparent: true,
            opacity: 1,
            flatShading: true,
            wireframe: false
        });

        let mesh = new THREE.Mesh(geo, material);
        mesh.name = type;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);

        this.transformControls.attach(mesh);
        this.orbitControls.enabled = false;
        this.scene.add(this.transformControls);
        this.dragList.push(mesh);
        this.sendItemInfo(mesh);
    }

    sendItemInfo(m: any): void {
        this.outsideObj = SelectTooler.getOutSideObject(m);
        this.insideObj = SelectTooler.getInsideObject(m);
        let obj:any = this.outsideObj;
        // let more = this.outsideObj != this.insideObj;
        this.curMesh = this.isRoot ? this.outsideObj : this.insideObj;

        let data1 = ParamTooler.getObjectData(this.outsideObj, this.scene, this.grid.visible);
        let data2 = ParamTooler.getObjectData(this.insideObj, this.scene, this.grid.visible);
        let list = [data1, data2];

        if(obj){
            this.transformControls.attach(obj);
            this.scene.add(this.transformControls);
            this.jsz.selectObject(obj);
        }
        else{
            this.scene.remove(this.transformControls);
        }

        GameEvent.ins.send(GameEvent.ITEM_INFO, list);

    }

    exportObject(): void {
        let temps: THREE.Object3D[] = [];
        this.scene.children.forEach(item => {
            if (this.dragList.indexOf(item) == -1) {
                item.visible = false;
                temps.push(item);
            }
        })
        GLTFTooler.toGLTFData(this.scene);
        temps.forEach(item => {
            item.visible = true;
        })
    }

    loadObject(data: any): void {
        let loader = new GLTFLoader();
        loader.parse(data, "", (gltf: GLTF) => {
            this.scene.add(...gltf.scene.children);
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
        let mesh = this.jsz.drawBufferData(position, normal, uv, index);
        this.dragList.push(mesh);
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
                    // child.receiveShadow = true;
                    // child.castShadow = true;
                    // child.uvsNeedUpdate = true;
                    child.name = "load_mesh";
                    child.material.roughness = 0.3;
                    child.material.metalness = 0.1;

                    this.dragList.push(child);
                    child.updateMatrix();
                }
            })

            let aim: any = gltf.scene.children[0].children[0].children[0];
            let size = new THREE.Box3().setFromObject(aim).getSize(new THREE.Vector3());
            let max = Math.max(size.x, size.y, size.z);
            let scale = 10 / max;
            aim.scale.set(scale, scale, scale);

            // let c = new THREE.Box3().setFromObject(aim);
            // let x = (c.min.x + c.max.x) / 2;
            // let y = (c.min.y + c.max.y) / 2;
            // let z = (c.min.z + c.max.z) / 2;
            // aim.position.set(0 - x, 0 - y, 0 - z);

            aim.position.set(0, 0, 0);

            // aim.rotateX(Math.PI / 2);
            // this.scene.add(aim);
            // aim.name = "load_scene";
            // this.dragList.push(aim);

            let group = new THREE.Object3D();
            group.add(aim);
            group.rotateX(Math.PI / 2);

            this.scene.add(group);
            group.name = "load_scene";
            this.dragList.push(group);

            this.scene.remove(this.loading);
        }, (e: ProgressEvent) => {
            let n = Math.floor(e.loaded / e.total * 100);
            console.log("load " + n + "%");
            this.loading.update(n + "%");
            this.scene.add(this.loading);
        })
    }

    makeGroup():void{
        let group = this.jsz.makeGroup();
        this.dragList.push(group);
        this.dragList = this.dragList.filter((item: any) => {
            if(group.hasItem(item)){
                return false;
            }
            return true;
        })
        this.selectObject(group);
    }

    splitGroup():void{
        this.jsz.splitGroup();
    }

    animate(): void {
        requestAnimationFrame(() => { this.animate() });
        this.renderer.render(this.scene, this.camera);
        this.stats && this.stats.update();
        this.focusLight.update(this.camera);
        this.jsz.update();
    }
}