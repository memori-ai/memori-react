"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const three_1 = require("three");
const drei_1 = require("@react-three/drei");
const fiber_1 = require("@react-three/fiber");
const utils_1 = require("../../../../../helpers/utils");
const MorphTargetController_1 = require("./controllers/MorphTargetController");
const AvatarPositionController_1 = require("./controllers/AvatarPositionController");
const constants_1 = require("../constants");
const utils_2 = require("../../utils/utils");
const useHeadMovement_1 = tslib_1.__importDefault(require("../../utils/useHeadMovement"));
function HalfBodyAvatar({ url, updateCurrentViseme, eyeBlink = false, avatarHeight = 50, avatarDepth = 0, headMovement = false, onLoaded, onCameraZChange, chatEmission, loading = false, }) {
    var _a;
    const { scene } = (0, drei_1.useGLTF)(url);
    const { nodes, materials } = (0, fiber_1.useGraph)(scene);
    const { camera } = (0, fiber_1.useThree)();
    const morphTargetControllerRef = (0, react_1.useRef)(null);
    const positionControllerRef = (0, react_1.useRef)(null);
    const targetCameraZRef = (0, react_1.useRef)(camera.position.z);
    (0, useHeadMovement_1.default)(headMovement, nodes);
    const blinkStateRef = (0, react_1.useRef)({
        isBlinking: false,
        lastBlinkTime: 0,
        nextBlinkTime: 0,
        blinkStartTime: 0,
    });
    const headMesh = (0, react_1.useMemo)(() => {
        let foundMesh;
        scene === null || scene === void 0 ? void 0 : scene.traverse((object) => {
            if (object instanceof three_1.SkinnedMesh &&
                (object.name === 'GBNL__Head' || object.name === 'Wolf3D_Avatar' || object.name === 'Wolf3D_Avatar006_1')) {
                foundMesh = object;
            }
        });
        return foundMesh;
    }, [scene]);
    (0, react_1.useEffect)(() => {
        if (!positionControllerRef.current) {
            positionControllerRef.current = new AvatarPositionController_1.AvatarPositionController(constants_1.AVATAR_POSITION, constants_1.AVATAR_POSITION_ZOOMED);
        }
        if (headMesh) {
            morphTargetControllerRef.current = new MorphTargetController_1.MorphTargetController(headMesh);
        }
        (0, utils_1.correctMaterials)(materials);
        onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
        (0, utils_2.hideHands)(nodes);
        return () => {
            Object.values(materials).forEach(material => material.dispose());
            Object.values(nodes)
                .filter(utils_1.isSkinnedMesh)
                .forEach(mesh => mesh.geometry.dispose());
        };
    }, [materials, nodes, url, onLoaded, scene, headMesh]);
    (0, react_1.useEffect)(() => {
        if (positionControllerRef.current) {
            positionControllerRef.current.updateHeight(avatarHeight, true);
        }
    }, [avatarHeight]);
    (0, react_1.useEffect)(() => {
        if (positionControllerRef.current && onCameraZChange) {
            const newCameraZ = positionControllerRef.current.updateDepth(avatarDepth, true);
            onCameraZChange(newCameraZ);
        }
    }, [avatarDepth, onCameraZChange]);
    (0, fiber_1.useFrame)((state) => {
        const currentTime = state.clock.elapsedTime * 1000;
        if (morphTargetControllerRef.current) {
            const currentViseme = updateCurrentViseme(currentTime / 1000);
            morphTargetControllerRef.current.updateMorphTargets(currentTime, chatEmission, loading, currentViseme, eyeBlink, blinkStateRef.current);
        }
        if (scene && positionControllerRef.current) {
            const newScale = positionControllerRef.current.updateScale(constants_1.SCALE_LERP_FACTOR);
            scene.scale.copy(newScale);
        }
    });
    const position = ((_a = positionControllerRef.current) === null || _a === void 0 ? void 0 : _a.getPosition()) || constants_1.AVATAR_POSITION;
    return ((0, jsx_runtime_1.jsx)("group", { position: position, children: (0, jsx_runtime_1.jsx)("primitive", { object: scene }) }));
}
exports.default = HalfBodyAvatar;
//# sourceMappingURL=halfbodyAvatar.js.map