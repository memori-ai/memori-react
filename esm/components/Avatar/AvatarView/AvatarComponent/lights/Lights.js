import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Object3D, Vector3 } from 'three';
const fromEntries = (arr) => Object.assign({}, ...arr.map(([k, v]) => ({ [k]: v })));
export const definedProps = (obj) => fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
export const LIGHT_CONFIG = Object.freeze({
    fillLightAngle: Math.PI / 3,
    backLightAngle: Math.PI / 8,
    keyLightAngle: Math.PI / 2,
    silhouetteLightAngle: Math.PI * 1.25,
    keyLightPosition: new Vector3(0.75, 1.75, 0.75),
    liftLightPosition: new Vector3(0.25, 1.5, 2.0),
    dirLightPosition: new Vector3(-0.75, 2.5, -1.0),
    silhouetteLightPosition: new Vector3(-1.25, 0.25, -1.25),
    defaultProps: {
        keyLightIntensity: 1.2,
        keyLightColor: '#FFF5EB',
        fillLightIntensity: 2.5,
        fillLightColor: '#A4C4FF',
        fillLightPosition: new Vector3(-0.6, 1.7, -0.4),
        backLightIntensity: 4.0,
        backLightColor: '#FFD4A8',
        backLightPosition: new Vector3(0.6, 1.7, -1.0),
        lightTarget: new Vector3(0.0, 1.65, 0.0),
    },
});
const Lights = lightingProps => {
    const { keyLightIntensity, keyLightColor, fillLightIntensity, fillLightColor, fillLightPosition, backLightIntensity, backLightColor, backLightPosition, lightTarget, } = Object.assign(LIGHT_CONFIG.defaultProps, definedProps(lightingProps));
    const { scene } = useThree();
    const [targets] = useState({
        head: new Object3D(),
        shoe: new Object3D(),
    });
    useEffect(() => {
        targets.head.position.copy(lightTarget);
        targets.shoe.position.set(0.0, 0.1, 0.0);
        scene.add(targets.head);
        scene.add(targets.shoe);
        return () => {
            scene.remove(targets.head);
            scene.remove(targets.shoe);
        };
    }, [scene, targets, lightTarget]);
    return (_jsxs("group", { children: [_jsx("spotLight", { position: fillLightPosition, target: targets.head, angle: LIGHT_CONFIG.fillLightAngle, color: fillLightColor, intensity: fillLightIntensity, castShadow: true, "shadow-bias": -0.0001, penumbra: 0.2 }), _jsx("spotLight", { position: backLightPosition, target: targets.head, angle: LIGHT_CONFIG.backLightAngle, color: backLightColor, intensity: backLightIntensity, castShadow: true, "shadow-bias": -0.0001, penumbra: 0.2 }), _jsx("spotLight", { position: LIGHT_CONFIG.keyLightPosition, target: targets.head, angle: LIGHT_CONFIG.keyLightAngle, color: keyLightColor, intensity: keyLightIntensity, penumbra: 0.3, castShadow: true }), _jsx("spotLight", { position: LIGHT_CONFIG.liftLightPosition, target: targets.shoe, angle: LIGHT_CONFIG.keyLightAngle, color: keyLightColor, intensity: keyLightIntensity * 0.3, penumbra: 0.4 }), _jsx("spotLight", { position: LIGHT_CONFIG.silhouetteLightPosition, target: targets.head, angle: LIGHT_CONFIG.silhouetteLightAngle, color: keyLightColor, intensity: keyLightIntensity * 0.3, penumbra: 0.3 }), _jsx("ambientLight", { intensity: 0.2, color: "#FFF8EF" })] }));
};
export default Lights;
//# sourceMappingURL=Lights.js.map