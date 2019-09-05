import * as THREE from 'three'
import ModelTooler from './ModelTooler';
import { BlobTooler } from '../tool/BlobTooler';
import GLTFTooler from '../tool/GLTFTooler';
import CacheData from './CacheData';

var RepeatWrapping = 1000;
var ClampToEdgeWrapping = 1001;
var MirroredRepeatWrapping = 1002;
var NearestFilter = 1003;
var NearestMipmapNearestFilter = 1004;
var NearestMipMapNearestFilter = 1004;
var NearestMipmapLinearFilter = 1005;
var NearestMipMapLinearFilter = 1005;
var LinearFilter = 1006;
var LinearMipmapNearestFilter = 1007;
var LinearMipMapNearestFilter = 1007;
var LinearMipmapLinearFilter = 1008;
var LinearMipMapLinearFilter = 1008;

var RGBFormat = 1022;
var RGBAFormat = 1023;

var WEBGL_CONSTANTS = {

    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,

    UNSIGNED_BYTE: 5121,
    UNSIGNED_SHORT: 5123,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,

    NEAREST: 9728,
    LINEAR: 9729,

    NEAREST_MIPMAP_NEAREST: 9984,
    LINEAR_MIPMAP_NEAREST: 9985,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_LINEAR: 9987,

    REPEAT: 10497,

    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,

};

var THREE_TO_WEBGL: any = {};

THREE_TO_WEBGL[NearestFilter] = WEBGL_CONSTANTS.NEAREST;
THREE_TO_WEBGL[NearestMipmapNearestFilter] = WEBGL_CONSTANTS.NEAREST_MIPMAP_NEAREST;
THREE_TO_WEBGL[NearestMipmapLinearFilter] = WEBGL_CONSTANTS.NEAREST_MIPMAP_LINEAR;
THREE_TO_WEBGL[LinearFilter] = WEBGL_CONSTANTS.LINEAR;
THREE_TO_WEBGL[LinearMipmapNearestFilter] = WEBGL_CONSTANTS.LINEAR_MIPMAP_NEAREST;
THREE_TO_WEBGL[LinearMipmapLinearFilter] = WEBGL_CONSTANTS.LINEAR_MIPMAP_LINEAR;

THREE_TO_WEBGL[ClampToEdgeWrapping] = WEBGL_CONSTANTS.CLAMP_TO_EDGE;
THREE_TO_WEBGL[RepeatWrapping] = WEBGL_CONSTANTS.REPEAT;
THREE_TO_WEBGL[MirroredRepeatWrapping] = WEBGL_CONSTANTS.MIRRORED_REPEAT;

var byteOffset = 0;
var buffers: any = [];
var insertBase64 = true;

export default class ExportModel {

    asset: object = { version: "2.0", generator: "GLTFExporter" };
    meshes: Array<any> = [];
    materials: Array<any> = [];
    scene: number = 0;
    scenes: Array<any> = [];
    nodes: Array<any> = [];
    bufferViews: Array<any> = [];
    buffers: Array<any> = [];
    accessors: Array<any> = [];
    textures: Array<any> = [];
    samplers: Array<any> = [];
    images: Array<any> = [];
    extensionsUsed: Array<any> = [];

    cacheData: CacheData;

    constructor() {
        byteOffset = 0;
        buffers = [];
        this.cacheData = new CacheData();
    }

    parse(node: THREE.Object3D, fname: string): void {
        let ext = ".txt";
        this.processScene(node);
        var blob = new Blob(buffers, { type: 'application/octet-stream' });
        this.buffers[0] = { byteLength: blob.size };
        if (insertBase64) {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                var base64data: any = reader.result;
                this.buffers[0].uri = base64data;
                let json = this.packageJson();
                console.log(json);
                GLTFTooler.saveString(JSON.stringify(json), fname + ext);
            };
        }
        else {
            this.buffers[0].uri = fname + ".bin";
            GLTFTooler.save(blob, fname + ".bin");
            let json = this.packageJson();
            console.log(json);
            GLTFTooler.saveString(JSON.stringify(json), fname + ext);
        }
    }

    packageJson(): any {
        return {
            asset: this.asset,
            meshes: this.meshes,
            materials: this.materials,
            scene: this.scene,
            scenes: this.scenes,
            nodes: this.nodes,
            bufferViews: this.bufferViews,
            buffers: this.buffers,
            accessors: this.accessors,
            textures: this.textures,
            samplers: this.samplers,
            images: this.images,
            extensionsUsed: this.extensionsUsed
        }
    }

    processScene(obj: any): any {
        var scene: any = {
            nodes: []
        };

        let node = this.processNode(obj);
        if (node !== null) {
            scene.nodes.push(node);
        }
        this.scenes.push(scene);
    }

    processAccessors(attribute: any, geometry: any, start?: any, count?: any): any {
        var types: any = {
            1: 'SCALAR',
            2: 'VEC2',
            3: 'VEC3',
            4: 'VEC4',
            16: 'MAT4'
        };

        var componentType;
        if (attribute.array.constructor === Float32Array) {
            componentType = WEBGL_CONSTANTS.FLOAT;
        } else if (attribute.array.constructor === Uint32Array) {
            componentType = WEBGL_CONSTANTS.UNSIGNED_INT;
        } else if (attribute.array.constructor === Uint16Array) {
            componentType = WEBGL_CONSTANTS.UNSIGNED_SHORT;
        } else if (attribute.array.constructor === Uint8Array) {
            componentType = WEBGL_CONSTANTS.UNSIGNED_BYTE;
        } else {
            throw new Error('THREE.GLTFExporter: Unsupported bufferAttribute component type.');
        }

        if (start === undefined) start = 0;
        if (count === undefined) count = attribute.count;
        if (geometry !== undefined && geometry.index === null) {
            var end1 = start + count;
            var end2 = geometry.drawRange.count === Infinity ? attribute.count : geometry.drawRange.start + geometry.drawRange.count;
            start = Math.max(start, geometry.drawRange.start);
            count = Math.min(end1, end2) - start;
            if (count < 0) count = 0;
        }

        // Skip creating an accessor if the attribute doesn't have data to export
        if (count === 0) {
            return null;
        }

        var minMax = ModelTooler.getMinMax(attribute, start, count);
        var bufferViewTarget;

        // If geometry isn't provided, don't infer the target usage of the bufferView. For
        // animation samplers, target must not be set.
        if (geometry !== undefined) {
            bufferViewTarget = attribute === geometry.index ? WEBGL_CONSTANTS.ELEMENT_ARRAY_BUFFER : WEBGL_CONSTANTS.ARRAY_BUFFER;
        }

        var bufferView: any = this.processBufferView(attribute, componentType, start, count, bufferViewTarget);

        var accessor = {
            bufferView: bufferView.id,
            // byteOffset: bufferView.byteOffset,
            componentType: componentType,
            count: count,
            max: minMax.max,
            min: minMax.min,
            type: types[attribute.itemSize]
        };

        this.accessors.push(accessor);
        return this.accessors.length - 1;
    }

    processNode(object: any): any {
        var node: any = {};
        node.matrix = object.matrix.elements;
        node.name = object.name;

        if (object.isMesh || object.isLine || object.isPoints) {
            var mesh = this.processMesh(object);
            if (mesh !== null) {
                node.mesh = mesh;
            }
        }

        if (object.children.length > 0) {
            var children = [];
            for (var i = 0, l = object.children.length; i < l; i++) {
                var child = object.children[i];
                if (child.visible) {
                    var cn = this.processNode(child);
                    if (cn !== null) {
                        children.push(cn);
                    }
                }
            }

            if (children.length > 0) {
                node.children = children;
            }
        }

        this.nodes.push(node);
        var nodeIndex = this.nodes.length - 1;
        return nodeIndex;
    }

    processBufferView(attribute: any, componentType: any, start: any, count: any, target: any) {
        var componentSize;
        if (componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE) {
            componentSize = 1;
        } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT) {
            componentSize = 2;
        } else {
            componentSize = 4;
        }

        var byteLength = ModelTooler.getPaddedBufferSize(count * attribute.itemSize * componentSize);
        var dataView = new DataView(new ArrayBuffer(byteLength));
        var offset = 0;

        for (var i = start; i < start + count; i++) {
            for (var a = 0; a < attribute.itemSize; a++) {
                var value = attribute.array[i * attribute.itemSize + a];
                if (componentType === WEBGL_CONSTANTS.FLOAT) {
                    dataView.setFloat32(offset, value, true);
                } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_INT) {
                    dataView.setUint32(offset, value, true);
                } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_SHORT) {
                    dataView.setUint16(offset, value, true);
                } else if (componentType === WEBGL_CONSTANTS.UNSIGNED_BYTE) {
                    dataView.setUint8(offset, value);
                }
                offset += componentSize;
            }
        }

        var bufferView: any = {
            buffer: this.processBuffer(dataView.buffer),
            byteOffset: byteOffset,
            byteLength: byteLength
        };

        if (target !== undefined) bufferView.target = target;
        if (target === WEBGL_CONSTANTS.ARRAY_BUFFER) {
            bufferView.byteStride = attribute.itemSize * componentSize;
        }

        byteOffset += byteLength;

        this.bufferViews.push(bufferView);

        var output = {
            id: this.bufferViews.length - 1,
            byteLength: 0
        };

        return output;
    }

    processBuffer(buffer: any): any {
        buffers.push(buffer);
        return 0;
    }

    processMesh(obj: any): any {
        var cacheKey = obj.geometry.uuid + ':' + obj.material.uuid;
        if (this.cacheData.meshes.has(cacheKey)) {
            return this.cacheData.meshes.get(cacheKey);
        }

        let geometry = obj.geometry;
        if (!geometry.isBufferGeometry) {
            console.warn('GLTFExporter: Exporting THREE.Geometry will increase file size. Use BufferGeometry instead.');
            var geometryTemp = new THREE.BufferGeometry();
            geometryTemp.fromGeometry(geometry);
            geometry = geometryTemp;
        }

        var attributes: any = {};
        var nameConversion: any = {
            position: 'POSITION',
            normal: 'NORMAL',
            color: 'COLOR_0',
            uv: 'TEXCOORD_0',
            uv2: 'TEXCOORD_1',
            skinWeight: 'WEIGHTS_0',
            skinIndex: 'JOINTS_0'
        };

        ModelTooler.createIndices(geometry);

        // let indices = this.processAccessors(geometry.index, geometry);

        for (var attributeName in geometry.attributes) {
            var attribute: any = geometry.attributes[attributeName];
            attributeName = nameConversion[attributeName];
            var accessor = this.processAccessors(attribute, geometry);
            if (accessor !== null) {
                attributes[attributeName] = accessor;
            }
        }

        let isMultiMaterial = Array.isArray(obj.material);
        if (isMultiMaterial && geometry.groups.length === 0) return null;

        var materials = isMultiMaterial ? obj.material : [obj.material];
        var groups = isMultiMaterial ? geometry.groups : [{ materialIndex: 0, start: undefined, count: undefined }];
        let primitives = [];

        for (var i = 0, len = groups.length; i < len; i++) {
            var primitive: any = {
                mode: 4,
                attributes: attributes,
            };

            if (geometry.index !== null) {
                primitive.indices = this.processAccessors(geometry.index, geometry, groups[i].start, groups[i].count);
            }

            var materialId = this.processMaterial(materials[groups[i].materialIndex]);
            if (materialId !== null) {
                primitive.material = materialId;
            }
            primitives.push(primitive);
        }

        let mesh = {
            primitives: primitives
        };
        this.meshes.push(mesh);
        let meshId = this.meshes.length - 1;
        this.cacheData.meshes.set(cacheKey, meshId);
        return meshId;
    }

    processMaterial(m: any): any {
        let materialId = this.cacheData.materials.get(m);
        if (materialId) {
            return materialId;
        }

        let material: any = {
            pbrMetallicRoughness: {
                baseColorFactor: [m.color.r, m.color.g, m.color.b, m.opacity],
                metallicFactor: m.metalness,
                roughnessFactor: m.roughness
            }
        };

        if (m.isMeshBasicMaterial) {
            material.extensions = { KHR_materials_unlit: {} };
            ModelTooler.listAdd(this.extensionsUsed, "KHR_materials_unlit");
        }

        if (m.emissive) {
            material.emissiveFactor = [m.emissive.r, m.emissive.g, m.emissive.b];
        }
        if (m.map) {
            material.pbrMetallicRoughness.baseColorTexture = this.processMap(m.map);
        }
        if (m.normalMap) {
            material.normalTexture = this.processMap(m.normalMap);
        }

        if (m.transparent || m.alphaTest > 0.0) {
            material.alphaMode = m.opacity < 1.0 ? 'BLEND' : 'MASK';
            if (m.alphaTest > 0.0 && m.alphaTest !== 0.5) {
                material.alphaCutoff = m.alphaTest;
            }
        }

        if (m.side === THREE.DoubleSide) {
            material.doubleSided = true;
        }

        this.materials.push(material);
        materialId = this.materials.length - 1;

        this.cacheData.materials.set(m, materialId);
        return materialId;
    }

    processMap(map: any): any {
        let textureId = this.processTexture(map);
        ModelTooler.listAdd(this.extensionsUsed, "KHR_texture_transform");
        let repeat = map.repeat;
        return {
            index: textureId,
            scale: 1,
            extensions: {
                KHR_texture_transform: {
                    scale: [repeat.x, repeat.y]
                }
            }
        }
    }

    processTexture(obj: any): any {
        if ( ! this.cacheData.textures.has(obj) ) {
            return this.cacheData.textures.get(obj);
        }

        let sampler = {
            // magFilter: 9729,//LINEAR: 0x2601
            // minFilter: 9987,//LINEAR_MIPMAP_LINEAR: 0x2703
            // wrapS: 10497,//重复
            // wrapT: 10497//重复

            magFilter: THREE_TO_WEBGL[obj.magFilter],
            minFilter: THREE_TO_WEBGL[obj.minFilter],
            wrapS: THREE_TO_WEBGL[obj.wrapS],
            wrapT: THREE_TO_WEBGL[obj.wrapT]
        }
        this.samplers.push(sampler);
        let samplerId = this.samplers.length - 1;

        let sourceId;
        if(this.cacheData.images.has(obj.image.currentSrc)){
            sourceId = this.cacheData.images.get(obj.image.currentSrc);
        }
        else{
            let source = {
                mimeType: obj.format == RGBAFormat ? "image/png" : "image/jpeg",
                uri: obj.image.currentSrc
            }
            this.images.push(source);
            sourceId = this.images.length - 1;
            this.cacheData.images.set(obj.image.currentSrc, sourceId);
        }

        let texture = {
            sampler: samplerId,
            source: sourceId
        }

        this.textures.push(texture);
        let textureId = this.textures.length - 1;
        this.cacheData.textures.set(obj, textureId);
        return textureId;
    }
}