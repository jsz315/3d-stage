import * as THREE from 'three'
import CustomAmbientLight from '../light/CustomAmbientLight';
import CustomDirectionalLight from '../light/CustomDirectionalLight';
import CustomHemisphereLight from '../light/CustomHemisphereLight';
import CustomPointLight from '../light/CustomPointLight';
import CustomSpotLight from '../light/CustomSpotLight';
import CustomRectAreaLight from '../light/CustomRectAreaLight';

export default class Factory {

    public static getBufferGeometry(type: string, p: any): THREE.BufferGeometry {
        let geo: any;

        switch (type) {
            case "BoxBufferGeometry":
                if (p) {
                    geo = new THREE.BoxBufferGeometry(p.width, p.height, p.depth, p.widthSegments, p.heightSegments, p.depthSegments);
                }
                else {
                    geo = new THREE.BoxBufferGeometry(1, 1, 1);
                }

                break;
            case "SphereBufferGeometry":
                if (p) {
                    geo = new THREE.SphereBufferGeometry(p.radius, p.widthSegments, p.heightSegments, p.phiStart, p.phiLength, p.thetaStart, p.thetaLength);
                }
                else {
                    geo = new THREE.SphereBufferGeometry(0.5, 12, 12);
                }

                break;
            case "IcosahedronBufferGeometry":
                if (p) {
                    geo = new THREE.IcosahedronBufferGeometry(p.radius, p.detail);
                }
                else {
                    geo = new THREE.IcosahedronBufferGeometry(1, 0);
                }

                break;
            case "CylinderBufferGeometry":
                if (p) {
                    geo = new THREE.CylinderBufferGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength);
                }
                else {
                    geo = new THREE.CylinderBufferGeometry(0.5, 1, 2, 8, 1);
                }

                break;
            case "OctahedronBufferGeometry":
                if (p) {
                    geo = new THREE.OctahedronBufferGeometry(p.radius, p.detail);
                }
                else {
                    geo = new THREE.OctahedronBufferGeometry(0.5, 0);
                }

                break;
            case "TorusBufferGeometry":
                if (p) {
                    geo = new THREE.TorusBufferGeometry(p.radius, p.tube, p.radialSegments, p.tubularSegments, p.arc);
                }
                else {
                    geo = new THREE.TorusBufferGeometry(2, 0.5, 8, 20, Math.PI * 2);
                }

                break;
            case "ConeBufferGeometry":
                if (p) {
                    geo = new THREE.ConeBufferGeometry(p.radius, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength);
                }
                else {
                    geo = new THREE.ConeBufferGeometry(1, 3, 8, 1);
                }
                break;
            case "PlaneBufferGeometry":
                if (p) {
                    geo = new THREE.PlaneBufferGeometry(p.width, p.height, p.widthSegments, p.heightSegments);
                }
                else {
                    geo = new THREE.PlaneBufferGeometry(20, 20);
                }

                break;
            default:
                break;
        }
        return geo;
    }

    public static getGeometry(type: string, p: any): THREE.Geometry {
        let geo: any;

        switch (type) {
            case "BoxGeometry":
                if (p) {
                    geo = new THREE.BoxGeometry(p.width, p.height, p.depth, p.widthSegments, p.heightSegments, p.depthSegments);
                }
                else {
                    geo = new THREE.BoxGeometry(1, 1, 1);
                }

                break;
            case "SphereGeometry":
                if (p) {
                    geo = new THREE.SphereGeometry(p.radius, p.widthSegments, p.heightSegments, p.phiStart, p.phiLength, p.thetaStart, p.thetaLength);
                }
                else {
                    geo = new THREE.SphereGeometry(0.5, 12, 12);
                }

                break;
            case "IcosahedronGeometry":
                if (p) {
                    geo = new THREE.IcosahedronGeometry(p.radius, p.detail);
                }
                else {
                    geo = new THREE.IcosahedronGeometry(1, 0);
                }

                break;
            case "CylinderGeometry":
                if (p) {
                    geo = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength);
                }
                else {
                    geo = new THREE.CylinderGeometry(0.5, 1, 2, 8, 1);
                }

                break;
            case "OctahedronGeometry":
                if (p) {
                    geo = new THREE.OctahedronGeometry(p.radius, p.detail);
                }
                else {
                    geo = new THREE.OctahedronGeometry(0.5, 0);
                }

                break;
            case "TorusGeometry":
                if (p) {
                    geo = new THREE.TorusGeometry(p.radius, p.tube, p.radialSegments, p.tubularSegments, p.arc);
                }
                else {
                    geo = new THREE.TorusGeometry(2, 0.5, 8, 20, Math.PI * 2);
                }

                break;
            case "ConeGeometry":
                if (p) {
                    geo = new THREE.ConeGeometry(p.radius, p.height, p.radialSegments, p.heightSegments, p.openEnded, p.thetaStart, p.thetaLength);
                }
                else {
                    geo = new THREE.ConeGeometry(1, 3, 8, 1);
                }
                break;
            case "PlaneGeometry":
                if (p) {
                    geo = new THREE.PlaneGeometry(p.width, p.height, p.widthSegments, p.heightSegments);
                }
                else {
                    geo = new THREE.PlaneGeometry(20, 20);
                }

                break;
            default:
                break;
        }
        return geo;
    }

    public static getLight(type:string): THREE.Light{
        let light: any;
        let color: number = 0xffffff;
        switch(type){
            case "AmbientLight":
                light = new CustomAmbientLight(color);
                break;
            case "DirectionalLight":
                light = new CustomDirectionalLight(color);
                break;
            case "HemisphereLight":
                light = new CustomHemisphereLight(color);
                break;
            case "PointLight":
                light = new CustomPointLight(color);
                break;
            case "SpotLight":
                light = new CustomSpotLight(color);
                break;
            case "RectAreaLight":
                light = new CustomRectAreaLight(color);
                break;
        }
        return light;
    }

    public static getMaterial(type:string): THREE.Material{
        let material: any;
        switch(type){
            case "MeshBasicMaterial":
                material = new THREE.MeshBasicMaterial();
                break;
            case "MeshNormalMaterial":
                material = new THREE.MeshNormalMaterial();
                break;
            case "MeshLambertMaterial":
                material = new THREE.MeshLambertMaterial();
                break;
            case "MeshPhongMaterial":
                material = new THREE.MeshPhongMaterial();
                break;
            case "MeshToonMaterial":
                material = new THREE.MeshToonMaterial();
                break;
            case "MeshStandardMaterial":
                material = new THREE.MeshStandardMaterial();
                break;
        }
        return material;
    }

    public static getDrawBufferMesh(position: Array<number>, normal: Array<number>, uv: Array<number>, index:number[]):THREE.Mesh{
        let ap = new Float32Array(position);
        let an = new Float32Array(normal);
        let au = new Float32Array(uv);

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.BufferAttribute(ap, 3));
        geometry.addAttribute("normal", new THREE.BufferAttribute(an, 3));
        geometry.addAttribute("uv", new THREE.BufferAttribute(au, 2));
        geometry.setIndex(index);
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff9900}));
        return mesh;
    }
}