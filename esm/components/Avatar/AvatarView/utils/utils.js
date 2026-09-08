import { LinearFilter } from 'three';
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};
export const lerp = (start, end, time = 0.05) => {
    return start * (1 - time) + end * time;
};
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
    value = clamp(value, inMin, inMax);
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
export const hideHands = (nodes) => {
    if (nodes.Wolf3D_Hands) {
        nodes.Wolf3D_Hands.visible = false;
    }
    if (nodes.RightHand && nodes.LeftHand) {
        nodes.RightHand.position.set(0, -2, 0);
        nodes.LeftHand.position.set(0, -2, 0);
    }
};
export const correctMaterials = (materials) => {
    Object.values(materials).forEach((material) => {
        if (material.map)
            material.map.minFilter = LinearFilter;
        if (material)
            material.depthWrite = true;
    });
};
const SkinnedMeshType = 'SkinnedMesh';
export const isSkinnedMesh = (node) => {
    return node.type === SkinnedMeshType;
};
//# sourceMappingURL=utils.js.map