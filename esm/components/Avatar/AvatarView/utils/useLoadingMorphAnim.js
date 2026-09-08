import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
let headMesh;
let eyesClosedMorphIndex = 0;
let viseme_UMorphIndex = 0;
export default function useLoadingMorphAnim(loading, nodes) {
    useEffect(() => {
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
    useFrame(() => {
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
//# sourceMappingURL=useLoadingMorphAnim.js.map