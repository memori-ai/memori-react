import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
const SMILE_INTENSITY = 1 / 3;
export default function useSmile(smiling, nodes) {
    const smileStateRef = useRef({
        headMesh: null,
        mouthSmileMorphIndex: 0,
    });
    useEffect(() => {
        const headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar020 || nodes.Wolf3D_Avatar001);
        smileStateRef.current.headMesh = headMesh;
        if ((headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetDictionary) && (headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetInfluences)) {
            smileStateRef.current.mouthSmileMorphIndex = headMesh.morphTargetDictionary.mouthSmile;
        }
    }, [nodes]);
    useFrame(() => {
        const { headMesh, mouthSmileMorphIndex } = smileStateRef.current;
        if (!(headMesh === null || headMesh === void 0 ? void 0 : headMesh.morphTargetInfluences))
            return;
        const targetSmileIntensity = smiling ? SMILE_INTENSITY : 0;
        const currentSmileIntensity = headMesh.morphTargetInfluences[mouthSmileMorphIndex];
        headMesh.morphTargetInfluences[mouthSmileMorphIndex] += (targetSmileIntensity - currentSmileIntensity) * 0.1;
    });
}
//# sourceMappingURL=useSmile.js.map