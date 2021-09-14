import * as THREE from "three";
import { Command } from "../Command";

/**
 * 通过场景控制器移动位置后的命令，纪录鼠标拖动前和拖动后的位置
 */
export class RotationCmd extends Command {
    constructor(
        obj: THREE.Object3D,
        oldPosition: THREE.Vector3,
        newPosition: THREE.Vector3
    ) {
        super();
        this.obj = obj;
        obj.rotation;
        this.newPosition = newPosition;
        this.oldPosition = oldPosition;
        // var {x, y, z} = obj.position;
        // this.oldPosition = new THREE.Vector3(x - newPosition.x, y - newPosition.y, z - newPosition.z);
    }

    execute(): void {
        this.redo();
    }

    redo(): void {
        this.obj.position.copy(this.newPosition);
    }

    undo(): void {
        this.obj.position.copy(this.oldPosition);
    }

    private obj: THREE.Object3D;
    private oldPosition: THREE.Vector3;
    private newPosition: THREE.Vector3;
}
