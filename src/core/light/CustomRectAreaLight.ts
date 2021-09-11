import * as THREE from "three";

export default class CustomRectAreaLight extends THREE.RectAreaLight {
    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(color?: THREE.Color | string | number, intensity?: number, width?: number, height?: number) {
        super(color, intensity, width, height);

        this.dragItem = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2), new THREE.MeshNormalMaterial());

        this.dragItem.name = "custom drag";
        this.name = "CustomRectAreaLight";

        // this.castShadow = true;

        this.add(this.dragItem);
    }

    get parameters(): any {
        return {
            color: this.color,
            intensity: this.intensity,
            width: this.width,
            height: this.height,
            helpVisible: this.helpVisible,
        };
    }

    update() {
        this.dragItem.lookAt(new THREE.Vector3());
    }
}
