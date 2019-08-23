export default class ParamTooler{

    public static TYPE_NUMBER: string = "type number";
    public static TYPE_COLOR: string = "type color";
    public static TYPE_IMAGE: string = "type image";
    public static TYPE_SWITCH: string = "type switch";

    public static getType(name:string):string{
        let type:string;
        if(name == "wireframe" || name == "transparent" || name == "visible"){
            type = this.TYPE_SWITCH;
        }
        else if(name == "map"){
            type = this.TYPE_IMAGE;
        }
        else if(name == "color" || name == "emissive" || name == "specular"){
            type = this.TYPE_COLOR;
        }
        else{
            type = this.TYPE_NUMBER;
        }
        return type;
    }
} 