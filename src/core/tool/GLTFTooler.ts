import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export default class GLTFTooler{

    public static toGLTFData(scene:any){
        var embed = false;
        var exporter = new GLTFExporter();
        exporter.parse(scene, (result) => {
            console.log(result);
            if ( result instanceof ArrayBuffer ) {
                this.saveArrayBuffer( result, 'scene.glb' );
            } else {
                var output = JSON.stringify( result, null, 2 );
                this.saveString( output, 'scene.gltf' );
            }
        }, {
            binary: false,
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
}