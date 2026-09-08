import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useCallback, memo } from 'react';
import { FullbodyAvatar } from './components/FullbodyAvatar/fullbodyAvatar';
import HalfBodyAvatar from './components/halfbodyAvatar';
const MemoizedFullbodyAvatar = memo(FullbodyAvatar);
const MemoizedHalfBodyAvatar = memo(HalfBodyAvatar);
export const AvatarView = ({ chatEmission, url, sex, eyeBlink, halfBody, loading, avatarHeight = 50, avatarDepth = -50, updateCurrentViseme, setCameraZ, headMovement, showControls, }) => {
    const animatorRef = useRef(null);
    const setAnimatorRef = useCallback((animator) => {
        if (animator !== animatorRef.current) {
            animatorRef.current = animator;
        }
    }, []);
    useEffect(() => {
        if (!animatorRef.current)
            return;
        try {
            animatorRef.current.processChatEmission(chatEmission, loading);
        }
        catch (error) {
            console.error('Error processing chat emission:', error);
        }
    }, [loading, chatEmission]);
    const commonAvatarProps = useCallback(() => ({
        url,
        onCameraZChange: setCameraZ,
        updateCurrentViseme,
        avatarHeight,
        avatarDepth,
        setAnimatorRef,
    }), [url, setCameraZ, updateCurrentViseme, avatarHeight, avatarDepth, setAnimatorRef]);
    return (_jsxs(_Fragment, { children: [halfBody ? (_jsx(MemoizedHalfBodyAvatar, { ...commonAvatarProps(), eyeBlink: eyeBlink, headMovement: headMovement })) : (_jsx(MemoizedFullbodyAvatar, { ...commonAvatarProps(), sex: sex, eyeBlink: eyeBlink, chatEmission: chatEmission, loading: loading })), showControls && animatorRef.current && (_jsx("div", { className: "animation-controls" }))] }));
};
export default memo(AvatarView);
//# sourceMappingURL=avatarComponent.js.map