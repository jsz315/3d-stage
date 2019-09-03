import * as THREE from 'three'
declare class ThreeBSP{
    constructor( geometry:THREE.Geometry );
    subtract(m:ThreeBSP):ThreeBSP;
    intersect(m:ThreeBSP):ThreeBSP;
    union(m:ThreeBSP):ThreeBSP;
    toMesh(m:any):THREE.Mesh;
}