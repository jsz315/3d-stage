export declare class Block {
    constructor(obj: any);
    add(obj: any): void;
}
export declare class Text {
    constructor(obj: any);
}
export declare function update(): void;
declare const ThreeMeshUI: {
    Block: typeof Block;
    Text: typeof Text;
    update: typeof update;
};
export default ThreeMeshUI;


// export namespace ThreeMeshUI {
//     export class Block { /* ... */ }
//     export class Text { /* ... */ }
//     export function update();
// }
