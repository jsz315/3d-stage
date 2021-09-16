import * as THREE from "three";
import Tooler from "./Tooler";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { BlobTooler } from "./BlobTooler";

export class LoadTooler {
    constructor() {}

    start(url: string) {
        if (url.match(/fbx$/i)) {
            return this.loadFbx(url);
        } else if (url.match(/obj$/i)) {
            return this.loadObj(url);
        } else if (url.match(/3ds$/i)) {
            return this.load3ds(url);
        } else if (url.match(/stl$/i)) {
            return this.loadStl(url);
        } else if (url.match(/mtl$/i)) {
            return this.loadMtl(url);
        } else if (url.match(/dae$/i)) {
            return this.loadDae(url);
        } else {
            return this.loadGltf(url);
        }
    }

    startFile(file: any) {
        var name = file.name;
        if (name.match(/obj$/i)) {
            return this.loadObjFile(file);
        } else {
            return this.loadGltfFile(file);
        }
    }

    loadGltf(url: string) {
        return new Promise(resolve => {
            const loader = new GLTFLoader();
            loader.load(url, (object: any) => {
                var m = object.scene;
                resolve(m);
            });
        });
    }

    loadDae(url: string) {
        return new Promise(resolve => {
            const loader = new ColladaLoader();
            loader.load(url, (collada: any) => {
                var object = collada.scene;
                resolve(object);
            });
        });
    }

    loadMtl(url: string) {
        return new Promise(resolve => {
            const loader = new MTLLoader();
            loader.load(url, (materials: any) => {
                materials.preload();

                new OBJLoader()
                    .setMaterials(materials)
                    // .setPath( 'models/obj/male02/' )
                    .load(url.replace(".mtl", ".obj"), object => {
                        resolve(object);
                    });
            });
        });
    }

    loadStl(url: string) {
        return new Promise(resolve => {
            const loader = new STLLoader();
            loader.load(url, (object: any) => {
                resolve(object);
            });
        });
    }

    loadFbx(url: string) {
        // var mat = new THREE.MeshStandardMaterial({color: 0x303030});
        // mat.castShadow = true;
        return new Promise(resolve => {
            const loader = new FBXLoader();
            loader.load(url, (object: any) => {
                resolve(object);
            });
        });
    }

    load3ds(url: string) {
        return new Promise(resolve => {
            const loader = new TDSLoader();
            loader.load(url, (object: any) => {
                resolve(object);
            });
        });
    }

    loadObj(url: string) {
        return new Promise(resolve => {
            const loader = new OBJLoader();
            loader.load(url, (object: any) => {
                resolve(object);
            });
        });
    }

    async loadObjFile(file: File) {
        const loader = new OBJLoader();
        var str = await Tooler.readStringFromFile(file);
        return loader.parse(str as string);
    }

    loadGltfFile(file: File) {
        return new Promise(resolve => {
            var blobTooler = new BlobTooler();
            blobTooler.blob2ArrayBuffer(file, (res: any) => {
                const loader = new GLTFLoader();
                loader.parse(res, "", (gltf: any) => {
                    resolve(gltf.scene);
                });
            });
        });
    }
}
