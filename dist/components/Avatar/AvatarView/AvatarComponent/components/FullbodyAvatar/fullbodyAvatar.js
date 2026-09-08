"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullbodyAvatar = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const three_1 = require("three");
const drei_1 = require("@react-three/drei");
const fiber_1 = require("@react-three/fiber");
const MorphTargetController_1 = require("../controllers/MorphTargetController");
const AvatarPositionController_1 = require("../controllers/AvatarPositionController");
const AvatarAnimator_1 = require("../controllers/AvatarAnimator");
const constants_1 = require("../../constants");
const DynamicShadow_1 = tslib_1.__importDefault(require("../../Shadow/DynamicShadow"));
function FullbodyAvatar({ url, sex, eyeBlink, updateCurrentViseme, avatarHeight = 50, avatarDepth = 0, onCameraZChange, chatEmission, loading, setAnimatorRef, }) {
    const { scene, animations: baseAnimations } = (0, drei_1.useGLTF)(url);
    const { animations: additionalAnimations } = (0, drei_1.useGLTF)(constants_1.ANIMATION_URLS[sex]);
    const needsAdditionalAnimations = (0, react_1.useMemo)(() => {
        let found = false;
        scene.traverse((object) => {
            if (object instanceof three_1.SkinnedMesh &&
                (object.name === 'GBNL__Head' ||
                    object.name === 'Wolf3D_Avatar' ||
                    object.name === 'Wolf3D_Avatar006_1')) {
                found = true;
            }
        });
        return found;
    }, [scene]);
    const mergedAnimations = (0, react_1.useMemo)(() => {
        const clips = needsAdditionalAnimations
            ? [...baseAnimations, ...additionalAnimations]
            : baseAnimations;
        if (sex !== 'MALE')
            return clips;
        return clips.filter(clip => !constants_1.MALE_EXCLUDED_ANIMATIONS.has(clip.name));
    }, [baseAnimations, additionalAnimations, needsAdditionalAnimations, sex]);
    const { actions } = (0, drei_1.useAnimations)(mergedAnimations, scene);
    const morphTargetControllerRef = (0, react_1.useRef)(null);
    const positionControllerRef = (0, react_1.useRef)(null);
    const animatorRef = (0, react_1.useRef)(null);
    const isInitializedRef = (0, react_1.useRef)(false);
    const lastPositionRef = (0, react_1.useRef)(constants_1.AVATAR_POSITION.clone());
    const positionUpdateThrottleRef = (0, react_1.useRef)(0);
    const POSITION_UPDATE_INTERVAL = 1;
    const [isRpm, setIsRpm] = (0, react_1.useState)(false);
    const blinkStateRef = (0, react_1.useRef)({
        isBlinking: false,
        lastBlinkTime: 0,
        nextBlinkTime: 0,
        blinkStartTime: 0,
    });
    (0, react_1.useEffect)(() => {
        if (!scene)
            return;
        let headMesh = null;
        scene.traverse((object) => {
            if (object instanceof three_1.SkinnedMesh) {
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
                morphTargetControllerRef.current = new MorphTargetController_1.MorphTargetController(headMesh);
            }
        }
        else {
            console.warn('⚠️ No suitable avatar mesh found');
        }
    }, [scene]);
    (0, react_1.useEffect)(() => {
        if (!positionControllerRef.current) {
            positionControllerRef.current = new AvatarPositionController_1.AvatarPositionController(constants_1.AVATAR_POSITION);
        }
        return () => {
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (positionControllerRef.current) {
            positionControllerRef.current.updateHeight(avatarHeight, false);
        }
    }, [avatarHeight]);
    (0, react_1.useEffect)(() => {
        if (positionControllerRef.current && onCameraZChange) {
            const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, false);
            onCameraZChange(newCameraZ);
        }
    }, [avatarDepth, onCameraZChange]);
    (0, react_1.useEffect)(() => {
        if (!scene || !actions || isInitializedRef.current) {
            return;
        }
        if (!animatorRef.current) {
            animatorRef.current = new AvatarAnimator_1.AvatarAnimator();
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
    const frameCallback = (0, react_1.useCallback)((state, delta) => {
        const currentTime = state.clock.elapsedTime * 1000;
        if (animatorRef.current && isInitializedRef.current) {
            animatorRef.current.update(delta);
        }
        if (morphTargetControllerRef.current) {
            const currentViseme = updateCurrentViseme(currentTime / 1000);
            morphTargetControllerRef.current.updateMorphTargets(currentTime, chatEmission, loading, currentViseme, eyeBlink, blinkStateRef.current);
        }
        if (scene && positionControllerRef.current) {
            const newScale = positionControllerRef.current.updateScale(constants_1.SCALE_LERP_FACTOR);
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
    (0, fiber_1.useFrame)(frameCallback);
    const position = (0, react_1.useMemo)(() => {
        var _a;
        return (((_a = positionControllerRef.current) === null || _a === void 0 ? void 0 : _a.getPosition()) || constants_1.AVATAR_POSITION.clone());
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DynamicShadow_1.default, { animator: animatorRef.current, avatarPosition: position }), (0, jsx_runtime_1.jsx)("group", { position: position, rotation: constants_1.AVATAR_ROTATION, children: (0, jsx_runtime_1.jsx)("primitive", { object: scene }) })] }));
}
exports.FullbodyAvatar = FullbodyAvatar;
//# sourceMappingURL=fullbodyAvatar.js.map