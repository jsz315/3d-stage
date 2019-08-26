import * as THREE from 'three';

export default class CustomPointLight extends THREE.PointLight{

    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(color?: THREE.Color | string | number, intensity?: number, distance?: number, decay?: number){
        super(color, intensity, distance, decay);

        this.dragItem = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.4),
            new THREE.MeshNormalMaterial()
        )

        this.dragItem.name = "custom drag";
        this.name = "CustomPointLight";

        this.castShadow = true;

        this.add(this.dragItem);
    }

    get parameters():any{
        return {
            color: this.color,
            intensity: this.intensity,
            distance: this.distance,
            decay: this.decay,
            helpVisible: this.helpVisible
        }
    }

    update(){
        this.dragItem.lookAt(new THREE.Vector3());
    }
}