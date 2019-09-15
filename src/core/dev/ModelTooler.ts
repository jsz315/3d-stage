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

    public static getPaddedBufferSize(bufferSize: any): any {
        return Math.ceil(bufferSize / 4) * 4;
    }

    public static getPaddedArrayBuffer(arrayBuffer: any, paddingByte?: any): any {
        paddingByte = paddingByte || 0;
        var paddedLength = this.getPaddedBufferSize(arrayBuffer.byteLength);
        if (paddedLength !== arrayBuffer.byteLength) {
            var array = new Uint8Array(paddedLength);
            array.set(new Uint8Array(arrayBuffer));
            if (paddingByte !== 0) {
                for (var i = arrayBuffer.byteLength; i < paddedLength; i++) {
                    array[i] = paddingByte;
                }
            }
            return array.buffer;
        }
        return arrayBuffer;
    }

    public static stringToArrayBuffer(text: string): any {
        if (window.TextEncoder !== undefined) {
            return new TextEncoder().encode(text).buffer;
        }

        var array = new Uint8Array(new ArrayBuffer(text.length));
        for (var i = 0, il = text.length; i < il; i++) {
            var value = text.charCodeAt(i);
            // Replacing multi-byte character with space(0x20).
            array[i] = value > 0xFF ? 0x20 : value;
        }
        return array.buffer;
    }

    public static listAdd(list: any, n: any): void {
        if (list.indexOf(n) == -1) {
            list.push(n);
        }
    }

    public static createIndices(geometry: any): any {
        if (geometry.index === null) {
            var indices = [];
            for (var i = 0, il = geometry.attributes.position.count; i < il; i++) {
                indices[i] = i;
            }
            geometry.setIndex(indices);
        }
    }
}