import * as THREE from "three";

export default class CustomSpotLight extends THREE.SpotLight {
    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(color?: THREE.Color | string | number, intensity?: number, distance?: number, angle?: number, exponent?: number, decay?: number) {
        super(color, intensity, distance, angle, exponent, decay);

        this.dragItem = new THREE.Mesh(new THREE.BoxBufferGeometry(0.4), new THREE.MeshNormalMaterial());

        this.dragItem.name = "custom drag";
        this.name = "CustomSpotLight";

        this.castShadow = true;

        this.add(this.dragItem);
    }

    get parameters(): any {
        return {
            color: this.color,
            intensity: this.intensity,
            distance: this.distance,
            angle: this.angle,
            exponent: this.exponent,
            decay: this.decay,
            helpVisible: this.helpVisible,
        };
    }

    update() {
        this.dragItem.lookAt(new THREE.Vector3());
    }
}
