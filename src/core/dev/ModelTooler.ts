export default class ModelTooler {
    constructor() {}

    public static getMinMax(attribute: any, start: any, count: any) {
        var output = {
            min: new Array(attribute.itemSize).fill(Number.POSITIVE_INFINITY),
            max: new Array(attribute.itemSize).fill(Number.NEGATIVE_INFINITY),
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
