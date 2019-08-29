/**
 * base64转二进制文件
 * @param {string} dataURI 
 */
function dataURI2Blob(dataURI) {
    // mime类型
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //base64 解码
    var byteString = atob(dataURI.split(',')[1]);
    //创建缓冲数组
    var arrayBuffer = new ArrayBuffer(byteString.length);
    //创建视图
    var intArray = new Uint8Array(arrayBuffer); 

    for (var i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], {type: mimeString});
}


/**
 * 二进制文件转base64
 * @param {Blob} blob 
 * @param {function} callback 
 */
function blob2DataURI(blob, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    }
    reader.readAsDataURL(blob);
}

/**
 * 读取远程二进制文件
 * @param {string} url 
 * @param {function} callback 
 */
function readRemoteBlob(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
        if (xhr.status == 200) {
            callback ** callback(xhr.response);
        }
    };
    xhr.send();
}


/**
 * 二进制文件转arrayBuffer
 * @param {Blob} blob 
 * @param {function} callback 
 */
function blob2ArrayBuffer(blob, callback){
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = ()=>{
        callback(reader.result);
    }
}

export {dataURI2Blob, blob2DataURI, readRemoteBlob, blob2ArrayBuffer}