import * as THREE from 'three'
import WorldTooler from '../tool/WorldTooler';
import Factory from '../tool/Factory';
import ColorTooler from '../tool/ColorTooler';
import SelectView from './SelectView';
import FocusLight from '../light/FocusLight';
import CustomGroup from '../dev/CustomGroup';
import GLTFTooler from '../tool/GLTFTooler';

export default class Root extends THREE.Object3D{

    public static SINGLE_ROOT = "SingleRoot";

    container: THREE.Object3D;
    lights: THREE.Object3D;
    scene:THREE.Scene;
    camera:THREE.PerspectiveCamera;
    grid:THREE.GridHelper;
    rayCaster: THREE.Raycaster;
    selectView: SelectView;
    focusLight: FocusLight;

    constructor(scene:THREE.Scene, camera:THREE.PerspectiveCamera, canvas: HTMLElement){
        super();

        this.name = Root.SINGLE_ROOT;
        this.scene = scene;
        this.camera = camera;

        this.container = new THREE.Object3D();
        this.container.name = "Container";
        this.add(this.container);
        this.lights = new THREE.Object3D();
        this.lights.name = "Lights";
        this.add(this.lights);

        this.selectView = new SelectView(scene, camera, canvas);
        this.selectView.name = "SelectView";
        this.add(this.selectView);

        this.focusLight = new FocusLight(0xffffff, 0.84);
        this.lights.add(this.focusLight);

        this.rayCaster = new THREE.Raycaster();

        this.grid = new THREE.GridHelper(80, 80, 0xcee8f9, 0xf0f0f0);
        (this.grid.material as any).transparent = true;
        (this.grid.material as any).opacity = 0.4;
        this.scene.add(this.grid);

        WorldTooler.addAxes("x", "#ff0000", new THREE.Vector3(42, 0.5, 0), this.grid);
        WorldTooler.addAxes("-x", "#ff0000", new THREE.Vector3(-42, 0.5, 0), this.grid);
        WorldTooler.addAxes("z", "#0000ff", new THREE.Vector3(0, 0.5, 42), this.grid);
        WorldTooler.addAxes("-z", "#0000ff", new THREE.Vector3(0, 0.5, -42), this.grid);

        // this.test();
    }

    test(){
        var geometry = new THREE.BoxGeometry();
        var materials = [];
        for(let i = 0; i < 4; i++){
            let material = new THREE.MeshBasicMaterial();
            material.color = ColorTooler.getRandomColor();
            materials.push(material);
        }
        for(let i = 0; i < geometry.faces.length; i++){
            geometry.faces[i].materialIndex = i % materials.length;
        }
        let mesh = new THREE.Mesh(geometry, materials);
        this.container.add(mesh);
    }

    select(e: MouseEvent, camera:THREE.PerspectiveCamera):any {
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        let obj:any;
        this.rayCaster.setFromCamera(mouse, camera);
        let list = [...this.container.children, ...this.lights.children];
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            if(obj.name == "custom drag"){
                obj = obj.parent;
            }
            console.log(obj);
        }
        this.selectView.select(obj);
        return obj;
    }

    deleteItem():void{
        this.selectView.deleteSelected();
    }

    addLight(light:any){
        this.lights.add(light);
    }

    addObject(obj: THREE.Object3D){
        this.container.add(obj);
    }

    addItem(type: string):any {
        let geo;
        if(type.indexOf("Buffer") != -1){
            geo = Factory.getBufferGeometry(type, null);
        }
        else{
            geo = Factory.getGeometry(type, null);
        }
        if (!geo) {
            return null;
        }

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
        this.container.add(mesh);
        return mesh;
    }

    copyItem(): void {
        // let oldMesh = this.curMesh;
        // let newMesh = oldMesh.clone();
        // this.scene.add(newMesh);

        // this.transformControls.attach(newMesh);
        // this.scene.add(this.transformControls);
        // this.dragList.push(newMesh);
        // if (oldMesh.name.match(/Custom.*Light/)) {
        //     this.sendLightInfo(newMesh);
        // }
        // else {
        //     this.sendMeshInfo(newMesh);
        // }
    }

    update(){
        this.selectView.selectLine.update();
        this.lights.children.forEach((item:any) => {
            item.update(this.camera);
        })
    }

    bspSubtract():void{
        let m = this.selectView.bspSubtract();
        if(m){
            this.container.add(m);
        }
    }

    bspIntersect():void{
        let m = this.selectView.bspIntersect();
        if(m){
            this.container.add(m);
        }
    }

    bspUnion():void{
        let m = this.selectView.bspUnion();
        if(m){
            this.container.add(m);
        }
    }

    makeGroup():any{
        let list = this.selectView.selectLine.getSelectItems();
        if(list.length > 1){
            let customGroup = new CustomGroup();
            list.forEach((item:any) => {
                customGroup.push(item);
            })
            this.selectView.selectLine.clear();
            this.addObject(customGroup);
            return customGroup;
        }
        return null;
    }

    splitGroup():any{
        let list = this.selectView.selectLine.getSelectItems();
        if(list.length == 1){
            let obj:any = list[0];
            if(obj.name == "CustomGroup"){
                obj.clear(this.container);                
                this.container.remove(obj);
                this.selectView.cancelSelected();
            }
        }
    }

    set multiple(n:any){
        this.selectView.selectLine.multiple = n;
    }

    set selectedColor(n:any){
        this.selectView.selectLine.selectedColor = n;
    }

    get selectedColor():any{
        return this.selectView.selectLine.selectedColor;
    }

}