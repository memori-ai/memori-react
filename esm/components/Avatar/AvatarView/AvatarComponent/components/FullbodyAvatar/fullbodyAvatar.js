import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { SkinnedMesh } from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MorphTargetController } from '../controllers/MorphTargetController';
import { AvatarPositionController } from '../controllers/AvatarPositionController';
import { AvatarAnimator } from '../controllers/AvatarAnimator';
import { ANIMATION_URLS, AVATAR_POSITION, AVATAR_ROTATION, MALE_EXCLUDED_ANIMATIONS, SCALE_LERP_FACTOR, } from '../../constants';
import DynamicShadow from '../../Shadow/DynamicShadow';
export function FullbodyAvatar({ url, sex, eyeBlink, updateCurrentViseme, avatarHeight = 50, avatarDepth = 0, onCameraZChange, chatEmission, loading, setAnimatorRef, }) {
    const { scene, animations: baseAnimations } = useGLTF(url);
    const { animations: additionalAnimations } = useGLTF(ANIMATION_URLS[sex]);
    const needsAdditionalAnimations = useMemo(() => {
        let found = false;
        scene.traverse((object) => {
            if (object instanceof SkinnedMesh &&
                (object.name === 'GBNL__Head' ||
                    object.name === 'Wolf3D_Avatar' ||
                    object.name === 'Wolf3D_Avatar006_1')) {
                found = true;
            }
        });
        return found;
    }, [scene]);
    const mergedAnimations = useMemo(() => {
        const clips = needsAdditionalAnimations
            ? [...baseAnimations, ...additionalAnimations]
            : baseAnimations;
        if (sex !== 'MALE')
            return clips;
        return clips.filter(clip => !MALE_EXCLUDED_ANIMATIONS.has(clip.name));
    }, [baseAnimations, additionalAnimations, needsAdditionalAnimations, sex]);
    const { actions } = useAnimations(mergedAnimations, scene);
    const morphTargetControllerRef = useRef(null);
    const positionControllerRef = useRef(null);
    const animatorRef = useRef(null);
    const isInitializedRef = useRef(false);
    const lastPositionRef = useRef(AVATAR_POSITION.clone());
    const positionUpdateThrottleRef = useRef(0);
    const POSITION_UPDATE_INTERVAL = 1;
    const [isRpm, setIsRpm] = useState(false);
    const blinkStateRef = useRef({
        isBlinking: false,
        lastBlinkTime: 0,
        nextBlinkTime: 0,
        blinkStartTime: 0,
    });
    useEffect(() => {
        if (!scene)
            return;
        let headMesh = null;
        scene.traverse((object) => {
            if (object instanceof SkinnedMesh) {
                if (object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1') {
                    setIsRpm(true);
                    headMesh = object;
                    return;
                }
                if (object.name === 'GBNL__Head') {
                    headMesh = object;
                }
                else {
                    const hasMorphTargets = object.morphTargetDictionary &&
                        Object.keys(object.morphTargetDictionary).length > 0;
                    if (hasMorphTargets) {
                        const morphTargetNames = Object.keys(object.morphTargetDictionary || {});
                        const hasVisemes = morphTargetNames.some(name => name.toLowerCase().includes('viseme'));
                        const hasFaceBlendShapes = morphTargetNames.some(name => {
                            const lower = name.toLowerCase();
                            return lower.includes('mouth') ||
                                lower.includes('eye') ||
                                lower.includes('jaw') ||
                                lower.includes('smile');
                        });
                        if (hasVisemes || hasFaceBlendShapes) {
                            headMesh = object;
                        }
                    }
                }
            }
        });
        if (headMesh) {
            if (!morphTargetControllerRef.current) {
                morphTargetControllerRef.current = new MorphTargetController(headMesh);
            }
        }
        else {
            console.warn('⚠️ No suitable avatar mesh found');
        }
    }, [scene]);
    useEffect(() => {
        if (!positionControllerRef.current) {
            positionControllerRef.current = new AvatarPositionController(AVATAR_POSITION);
        }
        return () => {
        };
    }, []);
    useEffect(() => {
        if (positionControllerRef.current) {
            positionControllerRef.current.updateHeight(avatarHeight, false);
        }
    }, [avatarHeight]);
    useEffect(() => {
        if (positionControllerRef.current && onCameraZChange) {
            const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, false);
            onCameraZChange(newCameraZ);
        }
    }, [avatarDepth, onCameraZChange]);
    useEffect(() => {
        if (!scene || !actions || isInitializedRef.current) {
            return;
        }
        if (!animatorRef.current) {
            animatorRef.current = new AvatarAnimator();
        }
        const animator = animatorRef.current;
        const initWithPreloadedAnimations = async () => {
            try {
                if (animator.isInitialized()) {
                    return;
                }
                await animator.initialize(scene, actions, mergedAnimations, isRpm ? 'RPM' : 'CUSTOM_GLB');
                if (setAnimatorRef) {
                    setAnimatorRef(animator);
                }
                isInitializedRef.current = true;
                animator.setTimeScale(0.8);
            }
            catch (error) {
                console.error('Error initializing AvatarAnimator:', error);
            }
        };
        initWithPreloadedAnimations();
        return () => {
            if (animatorRef.current && isInitializedRef.current) {
                if ('mixer' in animatorRef.current && animatorRef.current['mixer']) {
                    animatorRef.current['mixer'].stopAllAction();
                }
                if (setAnimatorRef) {
                    setAnimatorRef(null);
                }
                isInitializedRef.current = false;
            }
        };
    }, [scene, actions, mergedAnimations, sex, setAnimatorRef]);
    const frameCallback = useCallback((state, delta) => {
        const currentTime = state.clock.elapsedTime * 1000;
        if (animatorRef.current && isInitializedRef.current) {
            animatorRef.current.update(delta);
        }
        if (morphTargetControllerRef.current) {
            const currentViseme = updateCurrentViseme(currentTime / 1000);
            morphTargetControllerRef.current.updateMorphTargets(currentTime, chatEmission, loading, currentViseme, eyeBlink, blinkStateRef.current);
        }
        if (scene && positionControllerRef.current) {
            const newScale = positionControllerRef.current.updateScale(SCALE_LERP_FACTOR);
            scene.scale.copy(newScale);
            if (currentTime - positionUpdateThrottleRef.current >=
                POSITION_UPDATE_INTERVAL) {
                const currentPosition = positionControllerRef.current.getPosition();
                currentPosition.setX(Number(currentPosition.x.toFixed(6)));
                currentPosition.setY(Number(currentPosition.y.toFixed(6)));
                currentPosition.setZ(Number(currentPosition.z.toFixed(6)));
                lastPositionRef.current.copy(currentPosition);
                positionUpdateThrottleRef.current = currentTime;
            }
        }
    }, [scene, updateCurrentViseme, chatEmission, loading, eyeBlink]);
    useFrame(frameCallback);
    const position = useMemo(() => {
        var _a;
        return (((_a = positionControllerRef.current) === null || _a === void 0 ? void 0 : _a.getPosition()) || AVATAR_POSITION.clone());
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(DynamicShadow, { animator: animatorRef.current, avatarPosition: position }), _jsx("group", { position: position, rotation: AVATAR_ROTATION, children: _jsx("primitive", { object: scene }) })] }));
}
//# sourceMappingURL=fullbodyAvatar.js.map