export default class GameEvent {
    private static _ins: GameEvent;

    public static SELECT_ITEM: string = "select item";
    public static ITEM_INFO: string = "item info";
    public static DELETE_ITEM: string = "delete item";
    public static COPY_ITEM: string = "copy item";

    public static MAKE_GROUP: string = "make group";
    public static SPLIT_GROUP: string = "split group";

    public static CHANGE_IS_ROOT: string = "change is root";

    public static CUSTOM_GEOMETRY: string = "custom geometry";

    public static DELETE_TEXTURE: string = "delete texture";

    public static ADD_LIGHT: string = "add light";
    public static SELECT_LIGHT: string = "select light";

    public static GET_SCENE_TREE: string = "get scene tree";
    public static SET_SCENE_TREE: string = "set scene tree";
    public static SELECT_TREE_ITEM: string = "select tree item";

    public static CHANGE_PARAM: string = "change param";
    public static CHANGE_TRANSFORM: string = "change transform";
    public static CHANGE_MATERIAL: string = "change material";
    public static CHANGE_ITEM_PARAM: string = "change item param";

    public static CHANGE_ITEM_NAME: string = "change item name";

    public static BSP_SUBTRACT: string = "bsp subtract";
    public static BSP_INTERSECT: string = "bsp intersect";
    public static BSP_UNION: string = "bsp union";

    public static EXPORT_SCENE: string = "export scene";
    public static LOAD_SCENE: string = "load scene";
    public static TOGGLE_STATS: string = "toggle stats";
    public static IMPORT_SCENE: string = "import scene";

    public static FAIL_COMPUTE: string = "fail compute";

    public static OPEN_TREE_ITEM: string = "open tree item";

    public static LOADING: string = "loading";

    public static MESH_ALIGN: string = "mesh align";
    public static MODEL_EXPORT: string = "model export";
    public static OBJ_ROTATE: string = "obj rotate";

    public static CHANGE_LEVEL: string = "change level";
    public static IMPORT_FILE: string = "import file";
    public static LOAD_ZIP: string = "load zip";
    public static TOGGLE_VISIBLE: string = "toggle visible";

    public version: string;
    private _sender: any;

    constructor() {
        this.version = "v" + Math.random();
        console.log(this.version);
    }

    public init(sender: any): void {
        this._sender = sender;
    }

    public on(type: string, callback: Function): void {
        this._sender.addEventListener(type, callback);
    }

    public send(type: string, param?: any): void {
        this._sender.dispatchEvent(new CustomEvent(type, { detail: param }));
    }

    public static get ins(): GameEvent {
        if (!this._ins) {
            this._ins = new GameEvent();
        }
        return this._ins;
    }
}
