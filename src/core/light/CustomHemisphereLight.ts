import * as THREE from 'three';

export default class CustomHemisphereLight extends THREE.HemisphereLight{

    dragItem: THREE.Mesh;
    helpVisible: boolean = true;

    constructor(skyColor?: THREE.Color | string | number, groundColor?: THREE.Color | string | number, intensity?: number){
        super(skyColor, groundColor, intensity);
               
        this.dragItem = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshNormalMaterial()
        )

        this.dragItem.name = "custom drag";
        this.name = "CustomHemisphereLight";

        // this.castShadow = true;

        this.add(this.dragItem);
    }

    get parameters():any{
        return {
            skyColor: this.skyColor,
            groundColor: this.groundColor,
            intensity: this.intensity,
            helpVisible: this.helpVisible
        }
    }

    update(){
        this.dragItem.lookAt(new THREE.Vector3());
    }
}