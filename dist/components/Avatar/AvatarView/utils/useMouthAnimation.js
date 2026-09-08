"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMouthAnimation = void 0;
const react_1 = require("react");
const VISEME_SMOOTHING = 0.2;
const VISEME_SPEED_FACTOR = 0.44;
const lerp = (start, end, alpha) => {
    return start * (1 - alpha) + end * alpha;
};
function useMouthAnimation({ currentVisemes, avatarMeshRef }) {
    const visemeStartTimeRef = (0, react_1.useRef)(0);
    const currentVisemeWeightRef = (0, react_1.useRef)({});
    const getCurrentVisemeInfo = (elapsedTime) => {
        let currentVisemeIndex = 0;
        let accumulatedDuration = 0;
        while (currentVisemeIndex < currentVisemes.length &&
            accumulatedDuration <= elapsedTime) {
            accumulatedDuration += currentVisemes[currentVisemeIndex].duration;
            currentVisemeIndex++;
        }
        return { currentVisemeIndex, accumulatedDuration };
    };
    const applyCurrentViseme = (index, elapsedTime, accumulatedDuration) => {
        var _a, _b, _c;
        const currentViseme = currentVisemes[index - 1];
        const visemeProgress = (elapsedTime - (accumulatedDuration - currentViseme.duration)) / currentViseme.duration;
        const targetWeight = Math.sin(visemeProgress * Math.PI) * currentViseme.weight;
        if (!currentVisemeWeightRef.current[currentViseme.name]) {
            currentVisemeWeightRef.current[currentViseme.name] = 0;
        }
        currentVisemeWeightRef.current[currentViseme.name] = lerp(currentVisemeWeightRef.current[currentViseme.name], targetWeight, VISEME_SMOOTHING);
        const visemeIndex = (_b = (_a = avatarMeshRef.current) === null || _a === void 0 ? void 0 : _a.morphTargetDictionary) === null || _b === void 0 ? void 0 : _b[currentViseme.name];
        if (typeof visemeIndex === 'number' && ((_c = avatarMeshRef.current) === null || _c === void 0 ? void 0 : _c.morphTargetInfluences)) {
            avatarMeshRef.current.morphTargetInfluences[visemeIndex] = currentVisemeWeightRef.current[currentViseme.name];
        }
    };
    const resetVisemeAnimation = (currentTime) => {
        visemeStartTimeRef.current = currentTime;
        currentVisemeWeightRef.current = {};
    };
    const handleMouthMovement = (elapsedTime) => {
        if (currentVisemes.length === 0)
            return;
        const currentTime = elapsedTime * VISEME_SPEED_FACTOR;
        const visemeElapsedTime = currentTime - visemeStartTimeRef.current;
        const { currentVisemeIndex, accumulatedDuration } = getCurrentVisemeInfo(visemeElapsedTime);
        if (currentVisemeIndex > 0) {
            applyCurrentViseme(currentVisemeIndex, visemeElapsedTime, accumulatedDuration);
        }
        if (visemeElapsedTime > accumulatedDuration) {
            resetVisemeAnimation(currentTime);
        }
    };
    return {
        handleMouthMovement,
    };
}
exports.useMouthAnimation = useMouthAnimation;
//# sourceMappingURL=useMouthAnimation.js.map