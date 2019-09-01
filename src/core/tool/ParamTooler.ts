import * as THREE from 'three'
import config from '../config/material';

export default class ParamTooler{

    public static TYPE_NUMBER: string = "type number";
    public static TYPE_COLOR: string = "type color";
    public static TYPE_IMAGE: string = "type image";
    public static TYPE_SWITCH: string = "type switch";

    public static getType(name:string):string{
        let type:string;
        name = name.split(".")[0];
        if(name.substr(-7).toLowerCase() == "visible"){
            type = this.TYPE_SWITCH;
        }
        else if(name.substr(-5).toLowerCase() == "color"){
            type = this.TYPE_COLOR;
        }
        else if(name == "wireframe" || name == "transparent"){
            type = this.TYPE_SWITCH;
        }
        else if(this.checkMap(name)){
            type = this.TYPE_IMAGE;
        }
        else if(name == "emissive" || name == "specular"){
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
        if(!material){
            return null;
        }
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

    public static getObjectData(obj:any, scene:THREE.Scene, gridVisible:boolean):any{
        let type: any;
        let name: any;
        let parameters: any;
        let transform: any;
        let extra: any;

        if (obj) {

            type = obj.type;
            transform = ParamTooler.copyTransform(obj);

            if(type == "Mesh"){

                name = "Mesh";

                let material = ParamTooler.copyMaterialParam(obj.material);
                let temp = obj.geometry;
                if (obj.geometry.isGeometry) {
                    temp = new THREE.BufferGeometry().fromGeometry(obj.geometry);
                }

                parameters = obj.geometry.parameters;
                
                extra = {
                    geometry: {
                        ...temp.attributes,
                        index: obj.geometry.getIndex()
                    },
                    material: material,
                    materialType: obj.material ? obj.material.type : "",
                }
            }
            else if(type.substr(-5) == "Light"){
                name = obj.name;
                parameters = obj.parameters;
            }
            else if(type == "Group"){
                name = "Group";

            }
            else if(type == "Object3D"){
                name = "Object3D";
            }
        }
        else{
            type = "Scene";
            name = "Scene";
            parameters = {
                fogVisible: !!scene.fog,
                fogColor: scene.fog ? (scene.fog as THREE.Fog).color : "#ffffff",
                gridVisible: gridVisible,
                near: scene.fog ? (scene.fog as THREE.Fog).near : 0,
                far: scene.fog ? (scene.fog as THREE.Fog).far : 100
            }
        }

        return {
            type,
            name,
            parameters,
            transform,
            extra
        }
    }

} 