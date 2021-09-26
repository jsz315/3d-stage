import * as THREE from "three";
import Tooler from "./Tooler";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter";

export class ExportTooler {
    constructor() {}

    static start(obj: THREE.Object3D, name: string, param: object = {}) {
        if (name.indexOf(".obj") != -1) {
            Tooler.download(new OBJExporter().parse(obj), name);
        } else if (name.indexOf(".gltf") != -1) {
            console.log("---2", param);
            new GLTFExporter().parse(
                obj,
                (res: any) => {
                    Tooler.download(JSON.stringify(res), name);
                },
                param
            );
        } else if (name.indexOf(".stl") != -1) {
            Tooler.download(new STLExporter().parse(obj, param), name);
        }
    }
}
