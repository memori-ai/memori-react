"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("react");
const fiber_1 = require("@react-three/fiber");
const drei_1 = require("@react-three/drei");
const avatarComponent_1 = require("./AvatarComponent/avatarComponent");
const positionControls_1 = tslib_1.__importDefault(require("./AvatarComponent/positionControls/positionControls"));
const configuration_1 = require("../../../helpers/configuration");
const loader_1 = tslib_1.__importDefault(require("./AvatarComponent/components/loader"));
const Lights_1 = tslib_1.__importDefault(require("./AvatarComponent/lights/Lights"));
const defaultStyles = {
    halfBody: {
        width: '100%',
        height: '100%',
        minHeight: '500px',
        backgroundColor: 'white',
        borderRadius: '100%',
    },
    fullBody: {
        width: '500px',
        height: '500px',
        backgroundColor: 'white',
    },
};
const getCameraSettings = (halfBody, isZoomed) => {
    const baseZ = halfBody ? 0.6 : 3;
    return {
        fov: isZoomed ? 44 : 40,
        position: [0, 0, baseZ],
        target: [0, 0, 0],
    };
};
function ContainerAvatarView({ url, sex, style, rotateAvatar, eyeBlink, headMovement, speaking, fallback, fallbackImg, halfBody = true, loading, showControls = false, isZoomed, chatEmission, updateCurrentViseme, enablePositionControls, setEnablePositionControls, isTotem = false, }) {
    const [cameraZ, setCameraZ] = (0, react_1.useState)(() => getCameraSettings(halfBody, isZoomed || false).position[2]);
    const getAvatarHeight = () => {
        if (isTotem) {
            const height = (0, configuration_1.getLocalConfig)('avatarHeight', 50);
            return height;
        }
        if (halfBody) {
            return 80;
        }
        return isZoomed ? 16 : 65;
    };
    const getAvatarDepth = () => {
        if (isTotem) {
            const depth = (0, configuration_1.getLocalConfig)('avatarDepth', 50);
            return depth;
        }
        if (halfBody) {
            return 50;
        }
        return isZoomed ? 5 : 100;
    };
    const [avatarHeight, setAvatarHeight] = (0, react_1.useState)(getAvatarHeight());
    const [avatarDepth, setAvatarDepth] = (0, react_1.useState)(getAvatarDepth());
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [enablePositionControls && ((0, jsx_runtime_1.jsx)(positionControls_1.default, { avatarHeight: avatarHeight, avatarDepth: avatarDepth, halfBody: halfBody, setAvatarHeight: setAvatarHeight, setAvatarDepth: setAvatarDepth, setEnablePositionControls: setEnablePositionControls })), (0, jsx_runtime_1.jsxs)(fiber_1.Canvas, { style: style || defaultStyles.fullBody, shadows: true, dpr: [1, 2], gl: {
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false
                }, children: [(0, jsx_runtime_1.jsx)(drei_1.PerspectiveCamera, { makeDefault: true, position: [0, 0, cameraZ], fov: getCameraSettings(halfBody, isZoomed || false).fov, near: 0.1, far: 1000 }), rotateAvatar && ((0, jsx_runtime_1.jsx)(drei_1.OrbitControls, { enablePan: false, enableZoom: false, target: [0, 0, 0], enableDamping: true, dampingFactor: 0.05 })), (0, jsx_runtime_1.jsxs)(react_2.Suspense, { fallback: fallback || (0, jsx_runtime_1.jsx)(loader_1.default, { fallbackImg: fallbackImg }), children: [(0, jsx_runtime_1.jsx)(Lights_1.default, {}), (0, jsx_runtime_1.jsx)(avatarComponent_1.AvatarView, { url: url, sex: sex, showControls: showControls, loading: loading || false, eyeBlink: eyeBlink || false, headMovement: headMovement || false, speaking: speaking || false, halfBody: halfBody, chatEmission: chatEmission, updateCurrentViseme: updateCurrentViseme, setCameraZ: setCameraZ, avatarHeight: avatarHeight, avatarDepth: avatarDepth })] })] })] }));
}
exports.default = ContainerAvatarView;
//# sourceMappingURL=index.js.map