import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export default class GLTFTooler{

    public static toGLTFData(useBase64:boolean, scene:any, fname:string){
        var embed = false;
        var exporter = new GLTFExporter();
        exporter.parse(scene, (result) => {
            console.log(result);
            if ( result instanceof ArrayBuffer ) {
                this.saveArrayBuffer( result, 'scene.glb' );
            } else {
                var output = JSON.stringify( result, null, 2 );
                this.saveString( output, fname + '.gltf' );
            }
        }, {
            binary: !useBase64,
            embedImages: embed,
            forcePowerOfTwoTextures: embed,
            truncateDrawRange: false
        });
    }
    
    public static save( blob:Blob, filename:string ) {
        var link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link );
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.click();
    }
    
    public static saveString( text:string, filename:string ) {
        this.save( new Blob( [ text ], { type: 'text/plain' } ), filename );
    }

    public static saveArrayBuffer( buffer:any, filename:string ) {
        this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
    }

    public static getOffsetVector3(obj: THREE.Object3D):THREE.Vector3{
        let box = new THREE.Box3().setFromObject(obj);
        let x = (box.min.x + box.max.x) / 2;
        let y = (box.min.y + box.max.y) / 2;
        let z = (box.min.z + box.max.z) / 2;
        let offset: THREE.Vector3 = new THREE.Vector3(x, y, z);
        console.log("box size :");
        console.log(box);
        return offset;
    }

    public static getFitScale(obj: THREE.Object3D, num: number):number{
        let box = new THREE.Box3().setFromObject(obj);
        let size = box.getSize(new THREE.Vector3());
        let max = Math.max(size.x, size.y, size.z);
        
        let scale = num / max;
        console.log(max + " --> " + scale);
        return scale;
    }
}