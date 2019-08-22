import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

function GLTFTooler(scene:any){
    console.log("GLTFTooler");
    console.log(scene);
    toGLTFData(scene);

    function toGLTFData(scene:any){
        var embed = false;
        var exporter = new GLTFExporter();
        exporter.parse(scene, (result) => {
            console.log(result);
            if ( result instanceof ArrayBuffer ) {
                saveArrayBuffer( result, 'scene.glb' );
            } else {
                var output = JSON.stringify( result, null, 2 );
                saveString( output, 'scene.gltf' );
            }
        }, {
            binary: false,
            embedImages: embed,
            forcePowerOfTwoTextures: embed,
            truncateDrawRange: false
        });
    }
    
    function save( blob:Blob, filename:string ) {
        var link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link ); // Firefox workaround, see #6594
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.click();
    }
    
    function saveString( text:string, filename:string ) {
        save( new Blob( [ text ], { type: 'text/plain' } ), filename );
    }
    
    
    function saveArrayBuffer( buffer:any, filename:string ) {
        save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
    }
}

export default GLTFTooler;