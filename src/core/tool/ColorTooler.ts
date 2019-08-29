import * as THREE from 'three';


export default class ColorTooler{
    
    public static RGBtoHex(R:any, G:any, B:any):string {
        return this.toHex(R) + this.toHex(G) + this.toHex(B);
    }
    
    public static toHex(N:any):string {
        if (N == null)
            return "00";
        N = parseInt(N);
        if (N == 0 || isNaN(N))
            return "00";
        N = Math.max(0, N);
        N = Math.min(N, 255);
        N = Math.round(N);
        return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
    }
    
    public static getRandomColor():THREE.Color{
        return new THREE.Color().setHSL( Math.random(), 1, 0.75 );
    }
}