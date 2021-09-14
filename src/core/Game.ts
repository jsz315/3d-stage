import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import GameEvent from "@/core/event";
import ParamTooler from "./tool/ParamTooler";
import Loading from "./tool/Loading";
import Factory from "./tool/Factory";
import { LoadTooler } from "./tool/LoadTooler";
import SelectTooler from "./tool/SelectTooler";
import ListSceneTooler from "./tool/ListSceneTooler";
import Root from "./view/Root";
import ExportModel from "./dev/ExportModel";
import { ExportTooler } from "./tool/ExportTooler";
import Tooler from "./tool/Toole";

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
    mixer: THREE.AnimationMixer = null as any;
    clock: THREE.Clock = new THREE.Clock();

    constructor(canvas: any) {
        GameEvent.ins.init(canvas);

        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.shadowMap.enabled = true;
        // this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
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
            console.log("mousedown");
            this.mouseDown(e);
        });
        window.addEventListener("keydown", event => {
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

        window.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 17: // ctrl
                    this.root.multiple = false;
                    break;
            }
        });
    }

    standardExport(useBase64: boolean): void {
        // ExportTooler.start(this.curMesh);
    }

    customExport(useBase64: boolean): void {
        // ExportTooler.start(this.curMesh);
    }

    changeIsRoot(m: boolean): void {
        this.isRoot = m;
    }

    get curMesh(): any {
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
        // this.scene.add(newMesh);
        this.sendItemInfo(newMesh);
    }

    changeItemTransform(p: any): void {
        // let obj = this.transformControls.object;
        let obj = this.curMesh;
        obj.position.set(p.position.x, p.position.y, p.position.z);
        obj.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
        obj.scale.set(p.scale.x, p.scale.y, p.scale.z);
        // this.sendMeshInfo(obj);
        this.sendItemInfo(obj);
    }

    changeGeometryParam(p: any): void {
        // let mesh = this.transformControls.object;
        let mesh = this.curMesh;
        let geo;
        if (mesh.name.indexOf("Buffer") != -1) {
            geo = Factory.getBufferGeometry(mesh.name, p);
        } else {
            geo = Factory.getGeometry(mesh.name, p);
        }

        if (geo) {
            this.updateGroupGeometry(mesh, geo);
            // this.sendMeshInfo(mesh);
            this.sendItemInfo(mesh);
        }
    }

    changeMeshAlign(n: number): void {
        let mesh = this.curMesh;
        console.log(mesh);
        if (mesh instanceof THREE.Mesh) {
            mesh.geometry.computeBoundingBox();
            console.log("geometry bound", mesh.geometry.boundingBox);
            var box = mesh.geometry.boundingBox;
            var oldx = (box.min.x + box.max.x) / 2;
            var oldy = (box.min.y + box.max.y) / 2;
            var oldz = (box.min.z + box.max.z) / 2;

            var lenx = box.max.x - box.min.x;
            var leny = box.max.y - box.min.y;
            var lenz = box.max.z - box.min.z;

            mesh.geometry.translate(0 - oldx, (leny / 2) * n - oldy, 0 - oldz);

            var s = Tooler.getBoxSize(mesh);
            console.log("mesh bound", s);
        }
    }

    objRotate(n: number): void {
        console.log("rotate type", n);
        var r = (10 * Math.PI) / 180;
        if (n == 1) {
            (this.curMesh as THREE.Object3D).rotateOnAxis(
                new THREE.Vector3(0, 1, 0),
                r
            );
        } else {
            // (this.curMesh as THREE.Object3D).rotateOnWorldAxis(
            //     new THREE.Vector3(0, 1, 0),
            //     r
            // );

            Tooler.rotateOnAxis(
                this.curMesh as THREE.Object3D,
                new THREE.Vector3(),
                new THREE.Vector3(0, 1, 0),
                10
            );
        }
    }

    changeMeshExport({ type, param }: any) {
        var name = "custom";
        switch (type) {
            case 0:
                ExportTooler.start(this.curMesh, name + ".obj", param);
                break;
            case 1:
                ExportTooler.start(this.curMesh, name + ".stl", param);
                break;
            case 2:
                ExportTooler.start(this.curMesh, name + ".gltf", param);
                break;
            default:
                break;
        }
    }

    toggerMaterial(type: string): void {
        let mesh: any = this.curMesh;
        if (mesh) {
            mesh.material && mesh.material.dispose();
            let material = Factory.getMaterial(type);
            if (material) {
                mesh.material = material;
            }
            this.sendItemInfo(mesh);
        }
    }

    changeCommonMaterial(key: string, data: any): void {
        let mesh: any = this.curMesh;
        let type = ParamTooler.getType(key);

        if (key == "normalScale") {
            mesh.material[key] &&
                mesh.material[key].set(1, -1).multiplyScalar(Number(data));
        } else {
            if (type == ParamTooler.TYPE_COLOR) {
                mesh.material[key] = new THREE.Color(data);
            } else if (type == ParamTooler.TYPE_NUMBER) {
                mesh.material[key] = Number(data);
            } else if (type == ParamTooler.TYPE_SWITCH) {
                mesh.material[key] = Boolean(data);
            }
        }
        // this.sendMeshInfo(mesh);
        this.sendItemInfo(mesh);
    }

    changeRepeatMaterial(key: string, type: string, data: any): void {
        let mesh: any = this.curMesh;
        if (mesh.material[key]) {
            if (type == "repeatX") {
                mesh.material[key].repeat.x = Number(data);
            } else if (type == "repeatY") {
                mesh.material[key].repeat.y = Number(data);
            }
            mesh.material[key].needsUpdate = true;
            mesh.material.needsUpdate = true;
            this.sendItemInfo(mesh);
        }
    }

    changeTextureMaterial(key: string, data: any): void {
        let mesh: any = this.curMesh;
        let texture = new THREE.TextureLoader().load(data, () => {
            mesh.material[key].needsUpdate = true;
            mesh.material.needsUpdate = true;
            this.sendItemInfo(mesh);
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
            } else {
                this.scene.fog = new THREE.Fog(
                    new THREE.Color(data.fogColor).getHex(),
                    Number(data.near),
                    Number(data.far)
                );
            }
        } else {
            this.scene.fog = null;
        }
        this.renderer.setClearColor(new THREE.Color(data.fogColor));
        this.root.grid.visible = data.gridVisible;
        this.root.selectedColor = data.selectedColor;
    }

    deleteTexture(key: string): void {
        let mesh: any = this.curMesh;
        mesh.material[key] = null;
        mesh.material.needsUpdate = true;
        this.sendItemInfo(mesh);
    }

    changeLightParam(key: string, data: any): void {
        let light: any = this.curMesh;
        let type = ParamTooler.getType(key);
        if (type == ParamTooler.TYPE_COLOR) {
            light[key] = new THREE.Color(data);
        } else if (type == ParamTooler.TYPE_NUMBER) {
            light[key] = Number(data);
        } else if (type == ParamTooler.TYPE_SWITCH) {
            light[key] = Boolean(data);
        }
        this.sendItemInfo(light);
    }

    selectObject(obj: THREE.Object3D): void {
        if (obj != this.root.selectView) {
            this.root.selectView.select(obj);
            this.sendItemInfo(obj);
        } else {
            console.log("looping");
        }
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
        if (mesh) {
            this.sendItemInfo(mesh);
        }
    }

    sendItemInfo(m: any): void {
        this.insideObj = SelectTooler.getInsideObject(m);
        let data = ParamTooler.getObjectData(
            this.insideObj,
            this.scene,
            this.root.grid.visible,
            this.root.selectedColor
        );
        let list = [data];
        GameEvent.ins.send(GameEvent.ITEM_INFO, list);
    }

    loadObject(data: any): void {
        let loader = new GLTFLoader();
        loader.parse(data, "", (gltf: GLTF) => {
            gltf.scene.children.forEach((item: any) => {
                this.root.addObject(item);
            });
        });
    }

    exportTest() {
        // let e = new ExportModel();
        // e.parse(this.root.container, "Good");
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

    loadServeModel(url: string): void {
        let loadTooler = new LoadTooler();
        loadTooler.start(url).then(obj => {
            if (obj instanceof THREE.Object3D) {
                Tooler.resize(obj, 20);
                this.root.addObject(obj);
                this.checkPlay(obj);
            }
        });
    }

    checkPlay(object: any) {
        console.log("gltf", object);
        if (object.animations) {
            this.mixer = new THREE.AnimationMixer(object);
            const action = this.mixer.clipAction(object.animations[0]);
            action.play();
        } else {
            this.mixer = null as any;
        }
    }

    /*
    loadServeModel(url:string){
        let loader = new GLTFLoader();
        // loader.setPath('./asset/obj/');
        loader.load(url, (gltf) => {
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    child.name = "load_mesh";
                    child.material.roughness = 0.3;
                    child.material.metalness = 0.1;
                    child.updateMatrix();
                }
            })

            let aim: any = gltf.scene;
            Tooler.resize(aim, 20);
            this.root.addObject(aim);
            // this.scene.remove(this.loading);
        }, (e: ProgressEvent) => {
            console.log("ProgressEvent", e);
            let n = Math.floor(e.loaded / e.total * 100);
            console.log("load " + n + "%");
            // this.loading.update(n + "%");
            GameEvent.ins.send(GameEvent.LOADING, n);
            // this.scene.add(this.loading);
        })
    }
    */

    startLoad(): void {
        let loader = new GLTFLoader();
        loader.setPath("/asset/obj/");
        loader.load(
            "win.gltf",
            gltf => {
                console.log("gltf");
                console.log(gltf);
                gltf.scene.traverse((child: any) => {
                    if (child.isMesh) {
                        child.name = "load_mesh";
                        child.material.roughness = 0.3;
                        child.material.metalness = 0.1;
                        child.updateMatrix();
                    }
                });

                let aim: any = gltf.scene.children[0].children[0].children[0];
                let size = new THREE.Box3()
                    .setFromObject(aim)
                    .getSize(new THREE.Vector3());
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
            },
            (e: ProgressEvent) => {
                let n = Math.floor((e.loaded / e.total) * 100);
                console.log("load " + n + "%");
                this.loading.update(n + "%");
                this.scene.add(this.loading);
            }
        );
    }

    makeGroup(): void {
        let group = this.root.makeGroup();
        this.selectObject(group);
    }

    splitGroup(): void {
        this.root.splitGroup();
    }

    animate(): void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
        this.stats && this.stats.update();
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
        this.root.update();
    }

    getSceneTree(): any {
        let s = ListSceneTooler.parse(this.scene);
        return s;
    }

    selectedItemByUUID(uuid: string): any {
        console.log("selecte uuid", uuid);
        let obj: any = this.scene.getObjectByProperty("uuid", uuid);
        this.selectObject(obj);
    }

    changeItemName(name: string): any {
        this.curMesh.name = name;
    }

    bspSubtract(): void {
        this.root.bspSubtract();
    }

    bspIntersect(): void {
        this.root.bspIntersect();
    }

    bspUnion(): void {
        this.root.bspUnion();
    }
}
