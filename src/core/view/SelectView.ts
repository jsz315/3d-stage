import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import SelectLine from "./SelectLine";
import ComputeGeometry from "../tool/ComputeGeometry";

export default class SelectView extends THREE.Object3D {
    scene: THREE.Scene;
    transformControls: TransformControls;
    orbitControls: OrbitControls;
    selectLine: SelectLine;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, canvas: HTMLElement) {
        super();
        this.scene = scene;
        this.orbitControls = new OrbitControls(camera, canvas);
        this.transformControls = new TransformControls(camera, canvas);
        this.add(this.transformControls);
        this.selectLine = new SelectLine(this.scene);
        this.add(this.selectLine);

        this.transformControls.addEventListener("dragging-changed", (event) => {
            console.log("dragging-changed");
            this.orbitControls.enabled = !event.value;
        });

        this.transformControls.addEventListener("objectChange", (event) => {
            console.log("objectChange");
        });
    }

    deleteSelected() {
        this.remove(this.transformControls);
        this.selectLine.deleteSelected();
    }

    setMode(n: any): void {
        this.transformControls.setMode(n);
    }

    toggerSpace(): void {
        let n = this.transformControls.space === "local" ? "world" : "local";
        this.transformControls.setSpace(n);
    }

    select(obj: any): void {
        if (obj) {
            this.selectLine.select(obj);
            this.transformControls.attach(obj);
            this.add(this.transformControls);
        } else {
            this.selectLine.clear();
            this.remove(this.transformControls);
        }
    }

    bspSubtract(): THREE.Object3D | null {
        let list = this.selectLine.getBSPObjects();
        if (list) {
            let m = ComputeGeometry.subtract(list[0], list[1]);
            return m;
        }
        return null;
    }

    bspIntersect(): THREE.Object3D | null {
        let list = this.selectLine.getBSPObjects();
        if (list) {
            let m = ComputeGeometry.intersect(list[0], list[1]);
            return m;
        }
        return null;
    }

    bspUnion(): THREE.Object3D | null {
        let list = this.selectLine.getBSPObjects();
        if (list) {
            let m = ComputeGeometry.union(list[0], list[1]);
            return m;
        }
        return null;
    }

    cancelSelected(): any {
        this.remove(this.transformControls);
        this.selectLine.clear();
    }
}
