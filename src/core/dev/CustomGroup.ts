import * as THREE from "three";

export default class CustomGroup extends THREE.Group {
    list: Array<THREE.Object3D>;

    constructor() {
        super();
        this.list = [];
        this.name = "CustomGroup";
    }

    push(obj: THREE.Object3D): void {
        if (!this.hasItem(obj)) {
            this.list.push(obj);
            this.add(obj);
        }
    }

    hasItem(item: any): boolean {
        let m = this.list.find((obj: any) => {
            return obj == item;
        });
        return !!m;
    }

    clear(parent: THREE.Object3D): void {
        this.list.forEach((item: THREE.Object3D) => {
            item.position.copy(item.getWorldPosition(new THREE.Vector3()));
            item.rotation.setFromQuaternion(item.getWorldQuaternion(new THREE.Quaternion()));
            item.scale.copy(item.getWorldScale(new THREE.Vector3()));
            parent.add(item);
        });
    }
}
