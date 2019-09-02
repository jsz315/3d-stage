import * as THREE from 'three'

export default class ListSceneTooler{

    constructor(){

    }

    public static parse(obj:any):any{
        let children = [];
        for(let i = 0; i < obj.children.length; i++){
            let child = this.parse(obj.children[i]);
            children.push(child);
        }
        return {
            name: obj.name || obj.type,
            uuid: obj.uuid,
            children: children
        }
    }
}