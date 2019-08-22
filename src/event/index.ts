export default class GameEvent{
    private static _ins: GameEvent;

    public static SELECT_ITEM: string = "select item";
    public static CHANGE_PARAM: string = "change param";
    public static CHANGE_TRANSFORM: string = "change transform";

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