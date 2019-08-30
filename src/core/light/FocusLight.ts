import * as THREE from 'three';

export default class FocusLight extends THREE.DirectionalLight{
    constructor(color?: THREE.Color | string | number, intensity?: number){
        super(color, intensity);
        
        this.castShadow = true;
    }

    update(camera: THREE.Camera){
        this.position.copy(camera.position);
        this.rotation.copy(camera.rotation);
    }
}