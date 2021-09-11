import * as THREE from "three";

export default class CustomAmbientLight extends THREE.AmbientLight {
    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(color?: THREE.Color | string | number, intensity?: number) {
        super(color, intensity);

        this.dragItem = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5), new THREE.MeshNormalMaterial());

        this.dragItem.name = "custom drag";
        this.name = "CustomAmbientLight";

        // this.castShadow = true;

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
