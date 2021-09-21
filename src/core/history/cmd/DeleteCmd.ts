import * as THREE from "three";
import { Command } from "../Command";

/**
 * 通过场景控制器移动位置后的命令，纪录鼠标拖动前和拖动后的位置
 */
export class DeleteCmd extends Command {
    constructor(objs: THREE.Object3D[]) {
        super();
        this.objs = objs.filter(obj => obj);
        this.parents = this.objs.map(obj => obj.parent) as any;
    }

    execute(): void {
        this.redo();
    }

    redo(): void {
        this.objs.forEach((obj, index) => {
            this.parents[index].remove(obj);
        });
    }

    undo(): void {
        this.objs.forEach((obj, index) => {
            this.parents[index].add(obj);
        });
    }

    private objs: THREE.Object3D[];
    private parents: THREE.Object3D[];
}
