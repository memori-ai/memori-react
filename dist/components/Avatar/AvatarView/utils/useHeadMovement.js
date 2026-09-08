"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const react_1 = require("react");
const utils_1 = require("./utils");
const fiber_1 = require("@react-three/fiber");
const rad = Math.PI / 180;
let reset = false;
let timeout;
const targetPos = new three_1.Vector2(0, 0);
const currentPos = new three_1.Vector2(0, 0);
const setResetTrue = () => {
    timeout = setTimeout(() => {
        reset = true;
    }, 1000);
};
const setResetFalse = () => {
    clearTimeout(timeout);
    reset = false;
};
function useHeadMovement(enabled, nodes) {
    const { gl } = (0, fiber_1.useThree)();
    (0, react_1.useEffect)(() => {
        if (!enabled)
            return;
        gl.domElement.addEventListener('mouseleave', setResetTrue);
        gl.domElement.addEventListener('mouseenter', setResetFalse);
        return () => {
            gl.domElement.removeEventListener('mouseleave', setResetTrue);
            gl.domElement.removeEventListener('mouseenter', setResetFalse);
        };
    }, [gl.domElement, enabled]);
    (0, fiber_1.useFrame)(state => {
        if (!enabled || !(nodes === null || nodes === void 0 ? void 0 : nodes.Neck) || !(nodes === null || nodes === void 0 ? void 0 : nodes.Head))
            return;
        const cameraRotation = Math.abs(state.camera.rotation.z);
        if (!reset && cameraRotation < 0.2) {
            targetPos.x = (0, utils_1.mapRange)(state.mouse.y, -1, 1, 5 * rad, -5 * rad);
            targetPos.y = (0, utils_1.mapRange)(state.mouse.x, -1, 1, -10 * rad, 10 * rad);
        }
        else {
            targetPos.set(0, 0);
        }
        currentPos.x = (0, utils_1.lerp)(currentPos.x, targetPos.x);
        currentPos.y = (0, utils_1.lerp)(currentPos.y, targetPos.y);
        nodes.Neck.rotation.x = currentPos.x + 0.1;
        nodes.Neck.rotation.y = currentPos.y;
        nodes.Head.rotation.x = currentPos.x * 2;
        nodes.Head.rotation.y = currentPos.y * 2;
    });
}
exports.default = useHeadMovement;
//# sourceMappingURL=useHeadMovement.js.map