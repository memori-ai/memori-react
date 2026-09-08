"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const drei_1 = require("@react-three/drei");
const DynamicShadow = ({ animator, avatarPosition, }) => {
    const getShadowProps = () => {
        var _a, _b, _c, _d, _e;
        const baseProps = {
            width: 10,
            height: 10,
            blur: 2.5,
            scale: 10,
            far: 5,
            resolution: 1024,
            color: '#000000',
        };
        if (!animator) {
            return {
                ...baseProps,
                opacity: 0,
            };
        }
        if ((_a = animator.getCurrentAnimationName()) === null || _a === void 0 ? void 0 : _a.startsWith('Loading')) {
            return {
                ...baseProps,
                opacity: 0.85,
                blur: 3,
                width: 12,
                height: 12,
            };
        }
        else if (((_b = animator.getCurrentAnimationName()) === null || _b === void 0 ? void 0 : _b.includes('Gioia')) ||
            ((_c = animator.getCurrentAnimationName()) === null || _c === void 0 ? void 0 : _c.includes('Joy'))) {
            return {
                ...baseProps,
                opacity: 0.9,
                blur: 2,
                width: 11,
                height: 11,
            };
        }
        else if (((_d = animator.getCurrentAnimationName()) === null || _d === void 0 ? void 0 : _d.includes('Rabbia')) ||
            ((_e = animator.getCurrentAnimationName()) === null || _e === void 0 ? void 0 : _e.includes('Anger'))) {
            return {
                ...baseProps,
                opacity: 0.95,
                blur: 1.8,
                width: 12,
                height: 12,
            };
        }
        return {
            ...baseProps,
            opacity: 0.9,
            blur: 2.2,
        };
    };
    const shadowProps = getShadowProps();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(drei_1.ContactShadows, { opacity: shadowProps.opacity, scale: shadowProps.scale, blur: shadowProps.blur, far: shadowProps.far, resolution: shadowProps.resolution, color: shadowProps.color, frames: Infinity, position: [0, avatarPosition.y, 0] }), (0, jsx_runtime_1.jsx)(drei_1.ContactShadows, { opacity: 1, width: 5, height: 5, blur: 1, far: 2, resolution: 1024, color: "#000000", position: [0, -0.98, 0] })] }));
};
exports.default = DynamicShadow;
//# sourceMappingURL=DynamicShadow.js.map