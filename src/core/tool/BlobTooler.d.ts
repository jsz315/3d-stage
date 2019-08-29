// export function dataURI2Blob(dataURI:string):Blob;
// export function blob2DataURI(blob: Blob, callback: Function):void;
// export function getWebBlob(url: string, callback: Function):void;
export class BlobTooler{
    constructor();
    dataURI2Blob(dataURI:string):Blob;
    blob2DataURI(blob: Blob, callback: Function):void;
    readRemoteBlob(url: string, callback: Function):void;
    blob2ArrayBuffer(blob: Blob, callback: Function):void;
}