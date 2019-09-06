import * as THREE from "three";
import { MeshBasicMaterial, MeshNormalMaterial } from "three";
import GameEvent from '../event';
const ThreeBSP = require('three-js-csg')(THREE);


export default class ComputeGeometry{

    constructor(){
        
    }

    public static subtract(a:any, b:any):any{
        if(!this.checkCanCompute(a, b)){
            return;
        }
        a.geometry.computeFaceNormals();
        a.geometry.computeVertexNormals();
        b.geometry.computeFaceNormals();
        b.geometry.computeVertexNormals();

        let am = new ThreeBSP(a);
        let bm = new ThreeBSP(b);
        let newMesh = am.subtract(bm);
        let material = new MeshNormalMaterial();
        let m = newMesh.toMesh(material);
        // (m.geometry as THREE.Geometry).normalize();
        (m.geometry as THREE.Geometry).mergeVertices();
        // (m.geometry as THREE.Geometry).computeFaceNormals();
        // (m.geometry as THREE.Geometry).computeVertexNormals();
        return m;
    }

    public static intersect(a:any, b:any):any{
        if(!this.checkCanCompute(a, b)){
            return;
        }

        a.geometry.computeFaceNormals();
        a.geometry.computeVertexNormals();
        b.geometry.computeFaceNormals();
        b.geometry.computeVertexNormals();

        let am = new ThreeBSP(a);
        let bm = new ThreeBSP(b);
        let newMesh = am.intersect(bm);
        let material = new MeshNormalMaterial();
        let m = newMesh.toMesh(material);
       
        return m;
    }

    public static union(a:any, b:any):any{
        if(!this.checkCanCompute(a, b)){
            return;
        }

        a.geometry.computeFaceNormals();
        a.geometry.computeVertexNormals();
        b.geometry.computeFaceNormals();
        b.geometry.computeVertexNormals();

        let am = new ThreeBSP(a);
        let bm = new ThreeBSP(b);
        let newMesh = am.union(bm);
        let material = new MeshNormalMaterial();
        let m = newMesh.toMesh(material);
        (m.geometry as THREE.Geometry).computeFaceNormals();
        (m.geometry as THREE.Geometry).computeVertexNormals();
        return m;
    }

    public static checkCanCompute(a:any, b:any):boolean{
        if(a.geometry && b.geometry){
            if(a.geometry.faces && b.geometry.faces){
                return true;
            }
        }
        GameEvent.ins.send(GameEvent.FAIL_COMPUTE, "操作的物体应为基本的Geometry对象");
        return false;
    }
}



 
// export const meshFactory = () => {
//   const box = new THREE.Mesh(new THREE.BoxGeometry(500, 100, 100));
//   const sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 50, 50));
 
//   const sBSP = new ThreeBSP(sphere);
//   const bBSP = new ThreeBSP(box);
 
//   const sub = bBSP.subtract(sBSP);
//   const newMesh = sub.toMesh();
 
//   newMesh.material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x1a1a1a, shininess: 30, shading: THREE.FlatShading  });
 
//   return Object.assign({}, { csg: newMesh  });
 
// };