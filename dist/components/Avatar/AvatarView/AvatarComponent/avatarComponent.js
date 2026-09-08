"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarView = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fullbodyAvatar_1 = require("./components/FullbodyAvatar/fullbodyAvatar");
const halfbodyAvatar_1 = tslib_1.__importDefault(require("./components/halfbodyAvatar"));
const MemoizedFullbodyAvatar = (0, react_1.memo)(fullbodyAvatar_1.FullbodyAvatar);
const MemoizedHalfBodyAvatar = (0, react_1.memo)(halfbodyAvatar_1.default);
const AvatarView = ({ chatEmission, url, sex, eyeBlink, halfBody, loading, avatarHeight = 50, avatarDepth = -50, updateCurrentViseme, setCameraZ, headMovement, showControls, }) => {
    const animatorRef = (0, react_1.useRef)(null);
    const setAnimatorRef = (0, react_1.useCallback)((animator) => {
        if (animator !== animatorRef.current) {
            animatorRef.current = animator;
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (!animatorRef.current)
            return;
        try {
            animatorRef.current.processChatEmission(chatEmission, loading);
        }
        catch (error) {
            console.error('Error processing chat emission:', error);
        }
    }, [loading, chatEmission]);
    const commonAvatarProps = (0, react_1.useCallback)(() => ({
        url,
        onCameraZChange: setCameraZ,
        updateCurrentViseme,
        avatarHeight,
        avatarDepth,
        setAnimatorRef,
    }), [url, setCameraZ, updateCurrentViseme, avatarHeight, avatarDepth, setAnimatorRef]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [halfBody ? ((0, jsx_runtime_1.jsx)(MemoizedHalfBodyAvatar, { ...commonAvatarProps(), eyeBlink: eyeBlink, headMovement: headMovement })) : ((0, jsx_runtime_1.jsx)(MemoizedFullbodyAvatar, { ...commonAvatarProps(), sex: sex, eyeBlink: eyeBlink, chatEmission: chatEmission, loading: loading })), showControls && animatorRef.current && ((0, jsx_runtime_1.jsx)("div", { className: "animation-controls" }))] }));
};
exports.AvatarView = AvatarView;
exports.default = (0, react_1.memo)(exports.AvatarView);
//# sourceMappingURL=avatarComponent.js.map