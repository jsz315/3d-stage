import * as THREE from 'three'

export default class Loading extends THREE.Object3D{

    canvas: any;
    w:number = 512;
    h:number = 512;
    spriteMaterial:THREE.SpriteMaterial;
    spriteMap: THREE.Texture;

    constructor(){
        super();

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.spriteMap = new THREE.CanvasTexture(this.canvas);
        this.spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteMap, transparent: true, sizeAttenuation: true } );
       
        this.init();
    }

    init(){
        var sprite = new THREE.Sprite( this.spriteMaterial );
        this.add( sprite );
    }

    update(txt:any){
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#409EFF";
        ctx.arc(this.w / 2, this.h / 2, this.w / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = 180 + "px bold";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, this.w / 2, this.h / 2);

        this.spriteMap.needsUpdate = true;
        this.spriteMaterial.needsUpdate= true;
    }
}