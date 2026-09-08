"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const fiber_1 = require("@react-three/fiber");
let headMesh;
let eyesClosedMorphIndex = 0;
let viseme_UMorphIndex = 0;
function useLoadingMorphAnim(loading, nodes) {
    (0, react_1.useEffect)(() => {
        if (!loading)
            return;
        headMesh = (nodes.Wolf3D_Head ||
            nodes.Wolf3D_Avatar ||
            nodes.Wolf3D_Avatar001);
        if ((headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetDictionary) && (headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetInfluences)) {
            eyesClosedMorphIndex = headMesh.morphTargetDictionary.mouthOpen;
            viseme_UMorphIndex = headMesh.morphTargetDictionary.viseme_U;
        }
    }, [nodes, loading]);
    (0, fiber_1.useFrame)(() => {
        if (!loading) {
            if (headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetInfluences) {
                headMesh.morphTargetInfluences[eyesClosedMorphIndex] = 0;
                headMesh.morphTargetInfluences[viseme_UMorphIndex] = 0;
            }
        }
        else if (headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetInfluences) {
            headMesh.morphTargetInfluences[eyesClosedMorphIndex] = 0.56;
            headMesh.morphTargetInfluences[viseme_UMorphIndex] = 0.67;
        }
    });
}
exports.default = useLoadingMorphAnim;
//# sourceMappingURL=useLoadingMorphAnim.js.map