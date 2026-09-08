import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useRef } from 'react';
import { SkinnedMesh } from 'three';
import { useGLTF } from '@react-three/drei';
import { useGraph, useFrame, useThree } from '@react-three/fiber';
import { correctMaterials, isSkinnedMesh } from '../../../../../helpers/utils';
import { MorphTargetController } from './controllers/MorphTargetController';
import { AvatarPositionController } from './controllers/AvatarPositionController';
import { AVATAR_POSITION, SCALE_LERP_FACTOR, AVATAR_POSITION_ZOOMED, } from '../constants';
import { hideHands } from '../../utils/utils';
import useHeadMovement from '../../utils/useHeadMovement';
export default function HalfBodyAvatar({ url, updateCurrentViseme, eyeBlink = false, avatarHeight = 50, avatarDepth = 0, headMovement = false, onLoaded, onCameraZChange, chatEmission, loading = false, }) {
    var _a;
    const { scene } = useGLTF(url);
    const { nodes, materials } = useGraph(scene);
    const { camera } = useThree();
    const morphTargetControllerRef = useRef(null);
    const positionControllerRef = useRef(null);
    const targetCameraZRef = useRef(camera.position.z);
    useHeadMovement(headMovement, nodes);
    const blinkStateRef = useRef({
        isBlinking: false,
        lastBlinkTime: 0,
        nextBlinkTime: 0,
        blinkStartTime: 0,
    });
    const headMesh = useMemo(() => {
        let foundMesh;
        scene === null || scene === void 0 ? void 0 : scene.traverse((object) => {
            if (object instanceof SkinnedMesh &&
                (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1')) {
                foundMesh = object;
            }
        });
        return foundMesh;
    }, [scene]);
    useEffect(() => {
        if (!positionControllerRef.current) {
            positionControllerRef.current = new AvatarPositionController(AVATAR_POSITION, AVATAR_POSITION_ZOOMED);
        }
        if (headMesh) {
            morphTargetControllerRef.current = new MorphTargetController(headMesh);
        }
        correctMaterials(materials);
        onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
        hideHands(nodes);
        return () => {
            Object.values(materials).forEach(material => material.dispose());
            Object.values(nodes)
                .filter(isSkinnedMesh)
                .forEach(mesh => mesh.geometry.dispose());
        };
    }, [materials, nodes, url, onLoaded, scene, headMesh]);
    useEffect(() => {
        if (positionControllerRef.current) {
            positionControllerRef.current.updateHeight(avatarHeight, true);
        }
    }, [avatarHeight]);
    useEffect(() => {
        if (positionControllerRef.current && onCameraZChange) {
            const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, true);
            onCameraZChange(newCameraZ);
        }
    }, [avatarDepth, onCameraZChange]);
    useFrame((state) => {
        const currentTime = state.clock.elapsedTime * 1000;
        if (morphTargetControllerRef.current) {
            const currentViseme = updateCurrentViseme(currentTime / 1000);
            morphTargetControllerRef.current.updateMorphTargets(currentTime, chatEmission, loading, currentViseme, eyeBlink, blinkStateRef.current);
        }
        if (scene && positionControllerRef.current) {
            const newScale = positionControllerRef.current.updateScale(SCALE_LERP_FACTOR);
            scene.scale.copy(newScale);
        }
    });
    const position = ((_a = positionControllerRef.current) === null || _a === void 0 ? void 0 : _a.getPosition()) || AVATAR_POSITION;
    return (_jsx("group", { position: position, children: _jsx("primitive", { object: scene }) }));
}
//# sourceMappingURL=halfbodyAvatar.js.map