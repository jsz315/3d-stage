import * as THREE from 'three'

export default class LoadTooler{

    constructor(){

    }

    start(url:string, onProgress:Function, onCompelte:Function, onError:Function):void{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                let n = Math.floor(event.loaded / event.total * 100);
                onProgress(n);
            }
        };
        xhr.onreadystatechange = () => { // 状态发生变化时，函数被回调
            if (xhr.readyState === 4) { // 成功完成
                // 判断响应结果:
                if (xhr.status === 200) {
                    // 成功，通过responseText拿到响应的文本:
                    onCompelte();
                } else {
                    // 失败，根据响应码判断失败原因:
                    onError();
                }
            } else {
                // HTTP请求还在继续...
            }
        }
        xhr.send();
    }

    public static getUrlPath(url:string):any[]{
        let list = url.split("/");
        let aim = list.pop();
        let path = list.join("/") + "/";
        console.log(path);
        console.log(aim);
        return [path, aim];
    }

}