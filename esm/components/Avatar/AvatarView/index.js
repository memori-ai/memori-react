import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, } from '@react-three/drei';
import { AvatarView } from './AvatarComponent/avatarComponent';
import PositionControls from './AvatarComponent/positionControls/positionControls';
import { getLocalConfig } from '../../../helpers/configuration';
import Loader from './AvatarComponent/components/loader';
import Lights from './AvatarComponent/lights/Lights';
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
export default function ContainerAvatarView({ url, sex, style, rotateAvatar, eyeBlink, headMovement, speaking, fallback, fallbackImg, halfBody = true, loading, showControls = false, isZoomed, chatEmission, updateCurrentViseme, enablePositionControls, setEnablePositionControls, isTotem = false, }) {
    const [cameraZ, setCameraZ] = useState(() => getCameraSettings(halfBody, isZoomed || false).position[2]);
    const getAvatarHeight = () => {
        if (isTotem) {
            const height = getLocalConfig('avatarHeight', 50);
            return height;
        }
        if (halfBody) {
            return 80;
        }
        return isZoomed ? 16 : 65;
    };
    const getAvatarDepth = () => {
        if (isTotem) {
            const depth = getLocalConfig('avatarDepth', 50);
            return depth;
        }
        if (halfBody) {
            return 50;
        }
        return isZoomed ? 5 : 100;
    };
    const [avatarHeight, setAvatarHeight] = useState(getAvatarHeight());
    const [avatarDepth, setAvatarDepth] = useState(getAvatarDepth());
    return (_jsxs(_Fragment, { children: [enablePositionControls && (_jsx(PositionControls, { avatarHeight: avatarHeight, avatarDepth: avatarDepth, halfBody: halfBody, setAvatarHeight: setAvatarHeight, setAvatarDepth: setAvatarDepth, setEnablePositionControls: setEnablePositionControls })), _jsxs(Canvas, { style: style || defaultStyles.fullBody, shadows: true, dpr: [1, 2], gl: {
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false
                }, children: [_jsx(PerspectiveCamera, { makeDefault: true, position: [0, 0, cameraZ], fov: getCameraSettings(halfBody, isZoomed || false).fov, near: 0.1, far: 1000 }), rotateAvatar && (_jsx(OrbitControls, { enablePan: false, enableZoom: false, target: [0, 0, 0], enableDamping: true, dampingFactor: 0.05 })), _jsxs(Suspense, { fallback: fallback || _jsx(Loader, { fallbackImg: fallbackImg }), children: [_jsx(Lights, {}), _jsx(AvatarView, { url: url, sex: sex, showControls: showControls, loading: loading || false, eyeBlink: eyeBlink || false, headMovement: headMovement || false, speaking: speaking || false, halfBody: halfBody, chatEmission: chatEmission, updateCurrentViseme: updateCurrentViseme, setCameraZ: setCameraZ, avatarHeight: avatarHeight, avatarDepth: avatarDepth })] })] })] }));
}
//# sourceMappingURL=index.js.map