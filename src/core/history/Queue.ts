import { Command } from "./Command";

export class Queue {
    private commands: Command[];
    private commandsRedo: Command[];

    constructor() {
        this.commands = [];
        this.commandsRedo = [];
    }

    push(cmd: Command) {
        this.commands.push(cmd);
    }

    execute(cmd: Command) {
        this.push(cmd);
        cmd.execute();
    }

    redo() {
        var cmd = this.commandsRedo.pop();
        if (cmd) {
            cmd.redo();
            this.commands.push(cmd);
        }
    }

    undo() {
        var cmd = this.commands.pop();
        if (cmd) {
            cmd.undo();
            this.commandsRedo.push(cmd);
        }
    }
}
