//gltf文件格式解析


{
    /*固定写法*/
    asset: {
        version: "2.0",
        generator: "GLTFExporter"
    },
    bufferViews: [
        {buffer: 0, byteLength: 92712, byteOffset: 0, target: 34963},
        {buffer: 0, byteLength: 174672, byteOffset: 92712, target: 34962},
        {buffer: 0, byteLength: 174672, byteOffset: 267384, target: 34962}
    ],
    /*几何、动画、蒙皮的真正数据文件，读取出来的数据不需要解析，直接送进GPU进行渲染*/
    buffers: [
        {
            byteLength: 558504,
            /*数据文件地址*/
            uri: "DamagedHelmet.bin"
        }
    ],
    /** 
    * 访问器，定义了如何从二进制数据源中获取数据，在mesh、animation、skin中都会用到访问器。其指向buffer和bufferview，在这里面存着真正的几何数据
    * type属性用来表明数据元素是标量（SCALLAR）、矢量（VEC3）还是矩阵（MAT4）
    * componentType属性用来表明数据类型，如5126为FLOAT类型
    * min和max属性定义了几何对象的包围盒边界，这对碰撞检测和视锥体裁剪非常有用(此属性可不加)
    */
    accessors: [
        {bufferView: 0, componentType: 5123, count: 46356, max: [14555], min: [0], type: "SCALAR"},
        {bufferView: 1, componentType: 5126, count: 14556, max: [0.947, 0.8195, 0.9002], min: [-0.9479, -1.1804, -0.9077], type: "VEC3"},
        {bufferView: 2, componentType: 5126, count: 14556, max: [1, 1, 1], min: [-1, -1, -1], type: "VEC3"}
    ],
    images: [
        {mimeType: "image/jpeg", uri: "http://192.168.1.150:3000/texture/p1.jpg"},
        {mimeType: "image/jpeg", uri: "http://192.168.1.150:3000/texture/p2.jpg"}
    ],
    samplers: [
        {magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071},
        {magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071}
    ],
    /*包括采样器和图片，定义如何将纹理映射到模型*/
    textures: [
        {sampler: 0, source: 0},
        {sampler: 0, source: 1},
        {sampler: 0, source: 2}
    ],
    /*材质包含了定义物体模型外观的参数，特别是纹理参数*/
    materials: [
        {
            extensions: {
                KHR_materials_unlit: {}
            },
            pbrMetallicRoughness: {
                baseColorTexture: {
                    index: 0
                },
                /*金属因素*/
                metallicFactor: 0,
                /*粗糙程度*/
                roughnessFactor: 0.9
            },
            normalTexture: {index: 2},
            emissiveTexture: {index: 3},
            emissiveFactor: [1, 1, 1]
        }
    ],
    /*描述了在场景中出现的几何物体，并通过accessor（访问器）来访问其真实的几何数据，通过material（材质）来确定渲染外观*/
    meshes: [
        {
            primitives：[
                {
                    attributes: {
                        POSITION: 0, 
                        NORMAL: 1, 
                        COLOR_0: 2, 
                        TEXCOORD_0: 3
                    },
                    indices: 4,
                    material: 0,
                    /*三角形模式*/
                    mode: 4
                }
            ],
            name: "box2"
        }
    ],
    /*定义渲染场景的视点配置（暂不处理）*/
    cameras: [],
    /*骨骼动画，描述某个节点怎么随着时间运动（暂不处理）*/
    animations: [],
    /*蒙皮描述模型绑定到骨骼上的参数，用来实现骨骼动画，其真实数据也是通过访问器来获取的（暂不处理）*/
    skins: [],
    /*场景层级中的一个节点，可以包含位置变换，可以有子节点。同时，node通过指向mesh、camera、skin来描述node的形变*/
    nodes: [
        {
            name: "BoxBufferGeometry",
            matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 4, -8, 1],
            mesh: 0,
            rotation: [-0.0952, 0.00149, 6.201],
            scale: [-1, -1, -1],
            translation: [-0.0952, 0.00149, 6.201],
            /*包含nodes编号为1的mesh子节点*/
            children: [1]
        },
        {
            name: "BoxBufferGeometry",
            matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -7, 6, -8, 1],
            mesh: 1
        }
    ],
    /*扩展内容，包括灯光等*/
    extensions: {
        "KHR_lights_punctual": {
            "lights": [
              {
                "color": [
                  1,
                  1,
                  1
                ],
                "intensity": 0.84,
                "type": "directional"
              }
            ]
        }
    },
    /*使用的扩展内容索引*/
    "extensionsUsed": [
        "KHR_materials_unlit",
        "KHR_lights_punctual"
    ],
    /*整个场景的入口点，由node构成树组成*/
    scenes: [
        {
            name: "scene",
            nodes: [0]
        }
    ],
    scene: 0
}



/**
 * componentType 取值范围
 */
/*
componentType	Size in bytes
5120 (BYTE)	1
5121(UNSIGNED_BYTE)	1
5122 (SHORT)	2
5123 (UNSIGNED_SHORT)	2
5125 (UNSIGNED_INT)	4
5126 (FLOAT)	4

type	Number of components
"SCALAR"	1
"VEC2"	2
"VEC3"	3
"VEC4"	4
"MAT2"	4
"MAT3"	9
"MAT4"	16
*/

//34962 -- 顶点数据缓存
//34963 -- 顶点索引缓存
/**
 * 每个bufferview有一个target属性，此属性是在GPU渲染过程中，区分bufferview指向数据的类型。例如34962代表ARRAY_BUFFER，34963代表ELEMENT_ARRAY_BUFFER
 */

//temp1为读取blob文件后的ArrayBuffer数据
//读取位置数据
new Float32Array(temp1, byteOffset, byteLength / 4)
//读取法线数据
new Float32Array(temp1, byteOffset, byteLength / 4)
//读取贴图数据
new Float32Array(temp1, byteOffset, byteLength / 4)
//读取顶点索引数据
new Uint16Array(temp1, byteOffset, byteLength / 2)