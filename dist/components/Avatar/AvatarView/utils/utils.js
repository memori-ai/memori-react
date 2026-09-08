"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSkinnedMesh = exports.correctMaterials = exports.hideHands = exports.mapRange = exports.lerp = exports.clamp = void 0;
const three_1 = require("three");
const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};
exports.clamp = clamp;
const lerp = (start, end, time = 0.05) => {
    return start * (1 - time) + end * time;
};
exports.lerp = lerp;
const mapRange = (value, inMin, inMax, outMin, outMax) => {
    value = (0, exports.clamp)(value, inMin, inMax);
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
exports.mapRange = mapRange;
const hideHands = (nodes) => {
    if (nodes.Wolf3D_Hands) {
        nodes.Wolf3D_Hands.visible = false;
    }
    if (nodes.RightHand && nodes.LeftHand) {
        nodes.RightHand.position.set(0, -2, 0);
        nodes.LeftHand.position.set(0, -2, 0);
    }
};
exports.hideHands = hideHands;
const correctMaterials = (materials) => {
    Object.values(materials).forEach((material) => {
        if (material.map)
            material.map.minFilter = three_1.LinearFilter;
        if (material)
            material.depthWrite = true;
    });
};
exports.correctMaterials = correctMaterials;
const SkinnedMeshType = 'SkinnedMesh';
const isSkinnedMesh = (node) => {
    return node.type === SkinnedMeshType;
};
exports.isSkinnedMesh = isSkinnedMesh;
//# sourceMappingURL=utils.js.map