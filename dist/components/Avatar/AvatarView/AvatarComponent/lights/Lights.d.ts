import { FC } from 'react';
import { Vector3 } from 'three';
export interface LightingProps {
    keyLightIntensity?: number;
    keyLightColor?: string;
    fillLightIntensity?: number;
    fillLightColor?: string;
    fillLightPosition?: Vector3;
    backLightIntensity?: number;
    backLightColor?: string;
    backLightPosition?: Vector3;
    lightTarget?: Vector3;
}
export declare const definedProps: (obj: Object) => any;
export declare const LIGHT_CONFIG: Readonly<{
    fillLightAngle: number;
    backLightAngle: number;
    keyLightAngle: number;
    silhouetteLightAngle: number;
    keyLightPosition: Vector3;
    liftLightPosition: Vector3;
    dirLightPosition: Vector3;
    silhouetteLightPosition: Vector3;
    defaultProps: Required<LightingProps>;
}>;
declare const Lights: FC<LightingProps>;
export default Lights;
