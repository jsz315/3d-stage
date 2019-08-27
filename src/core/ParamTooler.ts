import config from './material';

export default class ParamTooler{

    public static TYPE_NUMBER: string = "type number";
    public static TYPE_COLOR: string = "type color";
    public static TYPE_IMAGE: string = "type image";
    public static TYPE_SWITCH: string = "type switch";

    public static getType(name:string):string{
        if(!name){
            debugger
        }
        let type:string;
        name = name.split(".")[0];
        if(name == "wireframe" || name == "transparent" || name == "visible" || name == "helpVisible"){
            type = this.TYPE_SWITCH;
        }
        else if(this.checkMap(name)){
            type = this.TYPE_IMAGE;
        }
        else if(name == "color" || name == "emissive" || name == "specular" || name == "skyColor" || name == "groundColor"){
            type = this.TYPE_COLOR;
        }
        else{
            type = this.TYPE_NUMBER;
        }
        return type;
    }

    public static checkMap(name:string):boolean{
        return name.substr(-3).toLowerCase() == "map";
    }

    public static setObjectValue(obj:any, key:string, data:any):void{
        let list = key.split(".");
        if(list.length == 1){
            obj[key] = data;
        }
        else{
            let temp = obj;
            for(let i = 0; i < list.length - 1; i++){
                temp = temp[list[i]];
            }
            temp[list[list.length - 1]] = data;
        }
    }

    public static copyTransform(mesh: any):any{
        let position = mesh.position;
        let rotation = mesh.rotation;
        let scale = mesh.scale;
        return {
            position: {
                x: position.x,
                y: position.y,
                z: position.z
            },
            rotation: {
                x: rotation.x,
                y: rotation.y,
                z: rotation.z
            },
            scale: {
                x: scale.x,
                y: scale.y,
                z: scale.z
            }
        }

    }

    public static copyMaterialParam(material: any):any{
        let data:any = config.find(item => item.type == material.type);
        let obj:any = {};
        for(let i in data.param){
            if(i == "normalScale"){
                obj[i] = material[i] ? material[i].x : 0.1;
            }
            else{
                if(this.checkMap(i)){
                    if(material[i] && material[i].image){
                        obj[i] = {
                            image: material[i].image.currentSrc,
                            repeatX: material[i].repeat.x,
                            repeatY: material[i].repeat.y
                        };
                    }
                    else{
                        obj[i] = {};
                    }
                }
                else{
                    obj[i] = material[i];
                }
            }
        }
        return obj;

    }
} 