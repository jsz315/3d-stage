import * as THREE from 'three';

export default class FocusLight extends THREE.PointLight{
    constructor(color?: THREE.Color | string | number, intensity?: number, distance?: number, decay?: number){
        super(color, intensity, distance, decay);
        
        this.castShadow = true;
    }

    update(camera: THREE.Camera){
        this.position.copy(camera.position);
        this.rotation.copy(camera.rotation);
    }
}