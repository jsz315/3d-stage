export abstract class Command {
    constructor() {}

    abstract execute(): void;

    abstract redo(): void;

    abstract undo(): void;
}
