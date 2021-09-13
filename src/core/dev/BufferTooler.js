/**
 * Process mesh
 * @param  {THREE.Mesh} mesh Mesh to process
 * @return {Integer}      Index of the processed mesh in the "meshes" array
 */
function processMesh(mesh) {
    var geometry = mesh.geometry;
    var mode = WEBGL_CONSTANTS.TRIANGLES;
    if (!geometry.isBufferGeometry) {
        console.warn("GLTFExporter: Exporting THREE.Geometry will increase file size. Use BufferGeometry instead.");
        var geometryTemp = new BufferGeometry();
        geometryTemp.fromGeometry(geometry);
        geometry = geometryTemp;
    }

    var gltfMesh = {};

    var attributes = {};
    var primitives = [];
    var targets = [];

    // Conversion between attributes names in threejs and gltf spec
    var nameConversion = {
        uv: "TEXCOORD_0",
        uv2: "TEXCOORD_1",
        color: "COLOR_0",
        skinWeight: "WEIGHTS_0",
        skinIndex: "JOINTS_0",
    };

    var originalNormal = geometry.getAttribute("normal");

    if (originalNormal !== undefined && !isNormalizedNormalAttribute(originalNormal)) {
        alert("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.");
    }

    // @QUESTION Detect if .vertexColors = THREE.VertexColors?
    // For every attribute create an accessor
    var modifiedAttribute = null;
    for (var attributeName in geometry.attributes) {
        var attribute = geometry.attributes[attributeName];
        attributeName = nameConversion[attributeName] || attributeName.toUpperCase();

        // Prefix all geometry attributes except the ones specifically
        // listed in the spec; non-spec attributes are considered custom.
        var validVertexAttributes = /^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/;
        if (!validVertexAttributes.test(attributeName)) {
            attributeName = "_" + attributeName;
        }

        var accessor = processAccessor(modifiedAttribute || attribute, geometry);
        if (accessor !== null) {
            attributes[attributeName] = accessor;
            cachedData.attributes.set(getUID(attribute), accessor);
        }
    }

    if (originalNormal !== undefined) geometry.addAttribute("normal", originalNormal);

    // Skip if no exportable attributes found
    if (Object.keys(attributes).length === 0) {
        return null;
    }

    var forceIndices = options.forceIndices;
    var isMultiMaterial = Array.isArray(mesh.material);

    if (isMultiMaterial && geometry.groups.length === 0) return null;

    if (!forceIndices && geometry.index === null && isMultiMaterial) {
        // temporal workaround.
        console.warn("THREE.GLTFExporter: Creating index for non-indexed multi-material mesh.");
        forceIndices = true;
    }

    var didForceIndices = false;

    if (geometry.index === null && forceIndices) {
        var indices = [];

        for (var i = 0, il = geometry.attributes.position.count; i < il; i++) {
            indices[i] = i;
        }

        geometry.setIndex(indices);

        didForceIndices = true;
    }

    var materials = isMultiMaterial ? mesh.material : [mesh.material];
    var groups = isMultiMaterial
        ? geometry.groups
        : [
              {
                  materialIndex: 0,
                  start: undefined,
                  count: undefined,
              },
          ];

    for (var i = 0, il = groups.length; i < il; i++) {
        var primitive = {
            mode: mode,
            attributes: attributes,
        };

        serializeUserData(geometry, primitive);

        if (targets.length > 0) primitive.targets = targets;

        if (geometry.index !== null) {
            var cacheKey = getUID(geometry.index);

            if (groups[i].start !== undefined || groups[i].count !== undefined) {
                cacheKey += ":" + groups[i].start + ":" + groups[i].count;
            }

            if (cachedData.attributes.has(cacheKey)) {
                primitive.indices = cachedData.attributes.get(cacheKey);
            } else {
                primitive.indices = processAccessor(geometry.index, geometry, groups[i].start, groups[i].count);
                cachedData.attributes.set(cacheKey, primitive.indices);
            }

            if (primitive.indices === null) delete primitive.indices;
        }

        var material = processMaterial(materials[groups[i].materialIndex]);

        if (material !== null) {
            primitive.material = material;
        }

        primitives.push(primitive);
    }

    if (didForceIndices) {
        geometry.setIndex(null);
    }

    gltfMesh.primitives = primitives;

    if (!outputJSON.meshes) {
        outputJSON.meshes = [];
    }

    outputJSON.meshes.push(gltfMesh);

    var index = outputJSON.meshes.length - 1;
    cachedData.meshes.set(cacheKey, index);

    return index;
}
