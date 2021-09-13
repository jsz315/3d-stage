import { Command } from "./Command";
import { Queue } from "./Queue";

export class Presenter {
    private static _instance: Presenter;

    private _queue: Queue;

    constructor(key: Key) {
        if (!key || !(key instanceof Key)) {
            throw new Error("不支持外部实例化");
        }
        this._queue = new Queue();
    }

    push(cmd: Command) {
        this._queue.push(cmd);
    }

    execute(cmd: Command) {
        this._queue.execute(cmd);
    }

    redo() {
        this._queue.redo();
    }

    undo() {
        this._queue.undo();
    }

    static get instance(): Presenter {
        if (!Presenter._instance) {
            Presenter._instance = new Presenter(new Key());
        }
        return Presenter._instance;
    }
}

class Key {}
