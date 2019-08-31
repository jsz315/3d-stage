import * as THREE from 'three'

export default class WorldTooler{
    
    public static getCanvas(word: any, color: any) {
        let w = 512;
        let h = 512;
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        let ctx: any = canvas.getContext("2d");
        // ctx.fillStyle = "#ffffff";
        // ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        // ctx.fill();
        ctx.font = 400 + "px bold";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(word, w / 2, h / 2);
        return canvas;
    }

    public static addAxes(word: any, color: any, position: THREE.Vector3, parent: THREE.Object3D) {
        var spriteMap = new THREE.CanvasTexture(this.getCanvas(word, color));
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, transparent: true, sizeAttenuation: true });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        parent.add(sprite);
    }
}