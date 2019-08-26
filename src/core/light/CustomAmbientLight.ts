import * as THREE from 'three';

export default class CustomAmbientLight extends THREE.AmbientLight{
    parameters: any = {};
    dragItem: THREE.Mesh;

    constructor(color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);

        this.dragItem = new THREE.Mesh(
            new THREE.BoxBufferGeometry(),
            new THREE.MeshNormalMaterial()
        )

        this.add(this.dragItem);

        this.parameters = {
            color,
            intensity,
            showHelp: true
        }
    }
}