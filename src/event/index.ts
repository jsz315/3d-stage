export default class GameEvent{
    private static _ins: GameEvent;

    public static SELECT_ITEM: string = "select item";
    public static ITEM_INFO: string = "item info";
    public static DELETE_ITEM: string = "delete item";
    public static COPY_ITEM: string = "copy item";

    public static CUSTOM_GEOMETRY: string = "custom geometry";

    public static DELETE_TEXTURE:string = "delete texture";

    public static ADD_LIGHT:string = "add light";
    public static SELECT_LIGHT:string = "select light";
    
    public static CHANGE_PARAM: string = "change param";
    public static CHANGE_TRANSFORM: string = "change transform";
    public static CHANGE_MATERIAL:string = "change material";
    public static CHANGE_ITEM_PARAM: string = "change item param"; 

    public version:string;
    private _sender:any;
    

    constructor(){
        this.version = "v" + Math.random();
        console.log(this.version);
    }

    public init(sender:any):void{
        this._sender = sender;
    }

    public on(type:string, callback:Function):void{
        this._sender.addEventListener(type, callback);
    }

    public send(type:string, param:any):void{
        this._sender.dispatchEvent(new CustomEvent(type, {detail: param}));
    }

    public static get ins():GameEvent{
        if(!this._ins){
            this._ins = new GameEvent();
        }
        return this._ins;
    }
}