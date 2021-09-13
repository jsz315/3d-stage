import * as THREE from 'three'
import GLTFTooler from './GLTFTooler';
import ExportModel from '../dev/ExportModel';

export default class ExportTooler{

    constructor(){
        
    }

    public static standardExport(useBase64:boolean, obj:any):void{
        GLTFTooler.toGLTFData(useBase64, obj, "standerd");
    }

    public static customExport(useBase64:boolean, obj:any):void{
        let e = new ExportModel();
        e.parse(useBase64, obj, "custom");
    }
}