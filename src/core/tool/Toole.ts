import * as THREE from "three";

export default class Toole {
    public static getOffsetVector3(obj: THREE.Object3D): THREE.Vector3 {
        let box = new THREE.Box3().setFromObject(obj);
        let x = (box.min.x + box.max.x) / 2;
        let y = (box.min.y + box.max.y) / 2;
        let z = (box.min.z + box.max.z) / 2;
        let offset: THREE.Vector3 = new THREE.Vector3(x, y, z);
        return offset;
    }

    public static getRootModel(obj: THREE.Object3D): THREE.Object3D {
        var aim: any = obj;
        var level = 0;
        while ((aim = aim.parent)) {
            if (aim.type == "Scene") {
                break;
            }
            if (++level > 10) {
                break;
            }
        }
        return aim;
    }

    public static getBoxSize(obj: THREE.Object3D): THREE.Vector3 {
        let box = new THREE.Box3().setFromObject(obj);
        let size = box.getSize(new THREE.Vector3());
        return size;
    }

    public static getFitScale(obj: THREE.Object3D, num: number): number {
        let size = this.getBoxSize(obj);
        let max = Math.max(size.x, size.y, size.z);
        let scale = num / max;
        return scale;
    }

    public static resize(model: THREE.Object3D, max: number) {
        let scale: number = Toole.getFitScale(model, max);
        model.scale.multiplyScalar(scale);
        // console.log(scale, 'scale');
        // console.log(model);

        let offset: THREE.Vector3 = Toole.getOffsetVector3(model);
        // console.log("model center position", offset);
        model.position.set(
            model.position.x - offset.x,
            model.position.y - offset.y,
            model.position.z - offset.z
        );
    }

    public static getUrlPath(url: string): any[] {
        url = this.getLink(url);
        let list = url.split("/");
        let aim = list.pop();
        let path = list.join("/") + "/";
        console.log(path, "path");
        console.log(aim, "aim");
        return [path, aim];
    }

    public static getLink(url: string): string {
        if (url.match(/http(s?):/)) {
            return url;
        }
        return (window as any).CFG.baseURL + url;
    }

    public static getQueryString(name: string): any {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    public static checkMobile(): boolean {
        let list = ["Android", "iPhone", "iPad"];
        let res = list.find(item => {
            if (navigator.userAgent.indexOf(item) != -1) {
                return true;
            }
        });
        return !!res;
    }

    public static isTest(): boolean {
        // return this.getQueryString('test') == 1;
        return location.search.indexOf("http://") != -1;
    }

    public static getAllMaterial(obj: THREE.Object3D): any {
        let size: number = 1;
        let materials: any = [];
        obj.traverse((item: any) => {
            if (item.isMesh) {
                let list;
                if (Array.isArray(item.material)) {
                    list = item.material;
                } else {
                    list = [item.material];
                }
                list.forEach((m: any) => {
                    if (m.map) {
                        materials.push(m);
                        m.userData.isFrame = item.name.indexOf("GCR_") == -1; //是否为门窗框，不是就是转角料
                    }
                });
                let temp = Math.max(...item.geometry.attributes.uv.array);
                size = Math.max(temp, size);
            }
        });

        if (size > 2) {
            size = 2;
        }

        return [materials, size];
    }

    public static loadData(
        url: string,
        complateHandler: Function,
        progressHandler?: Function
    ): void {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onprogress = event => {
            if (event.lengthComputable) {
                let n = Math.floor((event.loaded / event.total) * 100);
                console.log(n + "%");
                // this.loading.update("加载中", n + "%");
                // this.add(this.loading);
                progressHandler && progressHandler(n);
            }
        };
        xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    complateHandler && complateHandler(xhr.responseText);
                } else {
                    console.log("加载数据失败");
                    complateHandler && complateHandler();
                }
            } else {
            }
        };
        xhr.send();
    }

    public static rotateOnAxis(
        obj: THREE.Object3D,
        pivot: THREE.Vector3,
        axis: THREE.Vector3,
        r: number
    ) {
        // var scale = obj.scale.clone();
        var pot = pivot;
        var mat1 = new THREE.Matrix4().makeTranslation(pot.x, pot.y, pot.z);
        var mat2 = new THREE.Matrix4().makeRotationAxis(
            axis,
            (r * Math.PI) / 180
        );
        var mat3 = new THREE.Matrix4().makeTranslation(-pot.x, -pot.y, -pot.z);
        obj.applyMatrix(mat1.multiply(mat2).multiply(mat3));
        // obj.scale.set(scale.x, scale.y, scale.z);
    }

    public static farAway(p: THREE.Vector3, distance: number): THREE.Vector3 {
        var n = p.normalize();
        return new THREE.Vector3(
            n.x * distance,
            n.y * distance,
            n.z * distance
        );
    }

    public static download(str: string, name: string) {
        let link = document.createElement("a");
        link.style.display = "none";
        document.body.appendChild(link);
        link.href = URL.createObjectURL(
            new Blob([str], { type: "text/plain" })
        );
        link.download = name;
        link.click();
        document.body.removeChild(link);
    }
}
