"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIGHT_CONFIG = exports.definedProps = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fiber_1 = require("@react-three/fiber");
const react_1 = require("react");
const three_1 = require("three");
const fromEntries = (arr) => Object.assign({}, ...arr.map(([k, v]) => ({ [k]: v })));
const definedProps = (obj) => fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
exports.definedProps = definedProps;
exports.LIGHT_CONFIG = Object.freeze({
    fillLightAngle: Math.PI / 3,
    backLightAngle: Math.PI / 8,
    keyLightAngle: Math.PI / 2,
    silhouetteLightAngle: Math.PI * 1.25,
    keyLightPosition: new three_1.Vector3(0.75, 1.75, 0.75),
    liftLightPosition: new three_1.Vector3(0.25, 1.5, 2.0),
    dirLightPosition: new three_1.Vector3(-0.75, 2.5, -1.0),
    silhouetteLightPosition: new three_1.Vector3(-1.25, 0.25, -1.25),
    defaultProps: {
        keyLightIntensity: 1.2,
        keyLightColor: '#FFF5EB',
        fillLightIntensity: 2.5,
        fillLightColor: '#A4C4FF',
        fillLightPosition: new three_1.Vector3(-0.6, 1.7, -0.4),
        backLightIntensity: 4.0,
        backLightColor: '#FFD4A8',
        backLightPosition: new three_1.Vector3(0.6, 1.7, -1.0),
        lightTarget: new three_1.Vector3(0.0, 1.65, 0.0),
    },
});
const Lights = lightingProps => {
    const { keyLightIntensity, keyLightColor, fillLightIntensity, fillLightColor, fillLightPosition, backLightIntensity, backLightColor, backLightPosition, lightTarget, } = Object.assign(exports.LIGHT_CONFIG.defaultProps, (0, exports.definedProps)(lightingProps));
    const { scene } = (0, fiber_1.useThree)();
    const [targets] = (0, react_1.useState)({
        head: new three_1.Object3D(),
        shoe: new three_1.Object3D(),
    });
    (0, react_1.useEffect)(() => {
        targets.head.position.copy(lightTarget);
        targets.shoe.position.set(0.0, 0.1, 0.0);
        scene.add(targets.head);
        scene.add(targets.shoe);
        return () => {
            scene.remove(targets.head);
            scene.remove(targets.shoe);
        };
    }, [scene, targets, lightTarget]);
    return ((0, jsx_runtime_1.jsxs)("group", { children: [(0, jsx_runtime_1.jsx)("spotLight", { position: fillLightPosition, target: targets.head, angle: exports.LIGHT_CONFIG.fillLightAngle, color: fillLightColor, intensity: fillLightIntensity, castShadow: true, "shadow-bias": -0.0001, penumbra: 0.2 }), (0, jsx_runtime_1.jsx)("spotLight", { position: backLightPosition, target: targets.head, angle: exports.LIGHT_CONFIG.backLightAngle, color: backLightColor, intensity: backLightIntensity, castShadow: true, "shadow-bias": -0.0001, penumbra: 0.2 }), (0, jsx_runtime_1.jsx)("spotLight", { position: exports.LIGHT_CONFIG.keyLightPosition, target: targets.head, angle: exports.LIGHT_CONFIG.keyLightAngle, color: keyLightColor, intensity: keyLightIntensity, penumbra: 0.3, castShadow: true }), (0, jsx_runtime_1.jsx)("spotLight", { position: exports.LIGHT_CONFIG.liftLightPosition, target: targets.shoe, angle: exports.LIGHT_CONFIG.keyLightAngle, color: keyLightColor, intensity: keyLightIntensity * 0.3, penumbra: 0.4 }), (0, jsx_runtime_1.jsx)("spotLight", { position: exports.LIGHT_CONFIG.silhouetteLightPosition, target: targets.head, angle: exports.LIGHT_CONFIG.silhouetteLightAngle, color: keyLightColor, intensity: keyLightIntensity * 0.3, penumbra: 0.3 }), (0, jsx_runtime_1.jsx)("ambientLight", { intensity: 0.2, color: "#FFF8EF" })] }));
};
exports.default = Lights;
//# sourceMappingURL=Lights.js.map