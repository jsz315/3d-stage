export default class ModelTooler {

    constructor() {

    }

    public static getMinMax(attribute: any, start: any, count: any) {
        var output = {
            min: new Array(attribute.itemSize).fill(Number.POSITIVE_INFINITY),
            max: new Array(attribute.itemSize).fill(Number.NEGATIVE_INFINITY)
        };

        for (var i = start; i < start + count; i++) {
            for (var a = 0; a < attribute.itemSize; a++) {
                var value = attribute.array[i * attribute.itemSize + a];
                output.min[a] = Math.min(output.min[a], value);
                output.max[a] = Math.max(output.max[a], value);
            }
        }
        return output;
    }

    public static getPaddedBufferSize( bufferSize:any ):any {
        return Math.ceil( bufferSize / 4 ) * 4;
    }

    public static getComponentType(constructor: any):any{
        // if ( constructor === Float32Array ) {
        //     return WEBGL_CONSTANTS.FLOAT;
        // } else if ( constructor === Uint32Array ) {
        //     return WEBGL_CONSTANTS.UNSIGNED_INT;
        // } else if ( constructor === Uint16Array ) {
        //     return WEBGL_CONSTANTS.UNSIGNED_SHORT;
        // } else if ( constructor === Uint8Array ) {
        //     return WEBGL_CONSTANTS.UNSIGNED_BYTE;
        // }
        return null;
    }
}