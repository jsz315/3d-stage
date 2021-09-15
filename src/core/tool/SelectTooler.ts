import * as THREE from "three";
import Root from "../view/Root";

export default class SelectTooler {
    constructor() {}

    public static getInsideObject(obj: THREE.Object3D): THREE.Object3D | null {
        if (!obj || obj.parent == null) {
            return null;
        }

        let aim: any;
        if (obj) {
            if (obj.name == "custom drag") {
                aim = obj.parent;
            } else {
                aim = obj;
            }
        }
        return aim;
    }

    public static getOutSideObject(obj: THREE.Object3D): THREE.Object3D | null {
        if (!obj || obj.type == "Scene") {
            return null;
        }

        let aim: any = obj;
        let i = 0;
        while (aim) {
            if (aim.parent && aim.parent.name == Root.SINGLE_ROOT) {
                return aim;
            }
            if (++i > 20) {
                break;
            }
            aim = aim.parent;
        }
        return aim;
    }

    public static getDragParent(mesh: any): any {
        let aim: any = mesh;
        let i = 0;
        while ((aim = aim.parent)) {
            if (aim.name == "load_scene") {
                return aim;
            }
            if (++i > 20) {
                return null;
            }
        }
        return null;
    }
}
