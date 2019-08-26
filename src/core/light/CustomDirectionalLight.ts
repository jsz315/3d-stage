import * as THREE from 'three';

export default class CustomDirectionalLight extends THREE.DirectionalLight{

    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);

        this.dragItem = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshNormalMaterial()
        )

        this.dragItem.name = "custom drag";
        this.name = "CustomDirectionalLight";

        this.add(this.dragItem);
    }

    get parameters():any{
        return {
            color: this.color,
            intensity: this.intensity,
            helpVisible: this.helpVisible
        }
    }

    update(){
        this.dragItem.lookAt(new THREE.Vector3());
        // this.helper.update();
    }
}