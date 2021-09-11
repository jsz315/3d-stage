import * as THREE from "three";

export default class CustomDirectionalLight extends THREE.DirectionalLight {
    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(color?: THREE.Color | string | number, intensity?: number) {
        super(color, intensity);

        this.dragItem = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 0.2), new THREE.MeshNormalMaterial());

        this.dragItem.name = "custom drag";
        this.name = "CustomDirectionalLight";

        this.castShadow = true;
        this.shadow.mapSize.width = 512; // default
        this.shadow.mapSize.height = 512; // default
        this.shadow.camera.near = 0.5; // default
        this.shadow.camera.far = 500; // default

        this.add(this.dragItem);
    }

    get parameters(): any {
        return {
            color: this.color,
            intensity: this.intensity,
            helpVisible: this.helpVisible,
        };
    }

    update() {
        this.dragItem.lookAt(new THREE.Vector3());
    }
}
