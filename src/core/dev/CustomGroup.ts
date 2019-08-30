import * as THREE from 'three'

export default class CustomGroup extends THREE.Group{

    list: Array<THREE.Object3D>;
    scene:THREE.Scene;

    constructor(scene: THREE.Scene){
        super();
        this.list = [];
        this.scene = scene;
    }

    push(obj: THREE.Object3D):void{
        this.list.push(obj);
        this.add(obj);
    }

    clear():void{
        this.list.forEach((item:THREE.Object3D) => {
            item.position.copy(item.getWorldPosition(new THREE.Vector3()));
            this.scene.add(item);
        })
    }

}