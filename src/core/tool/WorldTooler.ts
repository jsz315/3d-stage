import * as THREE from "three";
// import * as ThreeMeshUI from "../view/three-mesh-ui.js";

// const ThreeMeshUI = (window as any).ThreeMeshUI;
// console.log("ThreeMeshUI", ThreeMeshUI);

export default class WorldTooler {
    public static readonly size: number = 128;
    public static getCanvas(word: any, color: any) {
        let w = WorldTooler.size;
        let h = WorldTooler.size;
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        let ctx: any = canvas.getContext("2d");
        // ctx.fillStyle = "#ffffff";
        // ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        // ctx.fill();
        ctx.font = WorldTooler.size / 2 + "px bold";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(word, w / 2, h / 2);
        return canvas;
    }

    public static addAxes(
        word: any,
        color: any,
        position: THREE.Vector3,
        parent: THREE.Object3D
    ) {
        var spriteMap = new THREE.CanvasTexture(this.getCanvas(word, color));
        var spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            transparent: true,
            sizeAttenuation: true
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        parent.add(sprite);
        sprite.scale.set(WorldTooler.size / 32, WorldTooler.size / 32, 1);

        // var txt: any = this.getText(word);
        // txt.position.copy(position);
        // console.log("text ui", txt);
        // parent.add(txt);
    }

    // public static getText(word: string) {
    //     var container = new ThreeMeshUI.Block({
    //         width: 1.2,
    //         height: 0.7,
    //         padding: 0.2,
    //         fontFamily: "./assets/font/custom-msdf.json",
    //         fontTexture: "./assets/font/custom.png"
    //     });

    //     const text = new ThreeMeshUI.Text({
    //         content: word
    //     });
    //     container.add(text as any);
    //     return container;
    //     // return text;
    // }
}
