import { useThree } from '@react-three/fiber';
import React, { FC, useEffect, useState } from 'react';
import { Object3D, Vector3 } from 'three';

export interface LightingProps {
  keyLightIntensity?: number;
  keyLightColor?: string; // css-color string

  fillLightIntensity?: number;
  fillLightColor?: string; // css-color string
  fillLightPosition?: Vector3;

  backLightIntensity?: number;
  backLightColor?: string; // css-color string
  backLightPosition?: Vector3;

  /**
   * The position in space which is used by the lights to shine at. (Defaults to approximate head height)
   */
  lightTarget?: Vector3;
}

const fromEntries = (arr: Array<any>) =>
  Object.assign({}, ...arr.map(([k, v]) => ({ [k]: v })));

export const definedProps = (obj: Object) =>
  fromEntries(
    // eslint-disable-next-line
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );

export const LIGHT_CONFIG = Object.freeze({
  fillLightAngle: Math.PI / 3,
  backLightAngle: Math.PI / 8,
  keyLightAngle: Math.PI / 2, // Reduced angle for more focused key light
  silhouetteLightAngle: Math.PI * 1.25, // Slightly reduced angle
  keyLightPosition: new Vector3(0.75, 1.75, 0.75), // Adjusted for better face illumination
  liftLightPosition: new Vector3(0.25, 1.5, 2.0), // Lower height for better body lighting
  dirLightPosition: new Vector3(-0.75, 2.5, -1.0),
  silhouetteLightPosition: new Vector3(-1.25, 0.25, -1.25), // Adjusted for better rim lighting
  defaultProps: {
    keyLightIntensity: 1.2, // Increased for better main illumination
    keyLightColor: '#FFF5EB', // Slightly warmer white
    fillLightIntensity: 2.5, // Reduced to prevent over-exposure
    fillLightColor: '#A4C4FF', // Softer blue
    fillLightPosition: new Vector3(-0.6, 1.7, -0.4), // Adjusted for better fill
    backLightIntensity: 4.0, // Reduced to prevent over-exposure
    backLightColor: '#FFD4A8', // Softer orange
    backLightPosition: new Vector3(0.6, 1.7, -1.0), // Adjusted for better rim light
    lightTarget: new Vector3(0.0, 1.65, 0.0), // Slightly lower target point
  } as Required<LightingProps>,
});

const Lights: FC<LightingProps> = lightingProps => {
  const {
    keyLightIntensity,
    keyLightColor,
    fillLightIntensity,
    fillLightColor,
    fillLightPosition,
    backLightIntensity,
    backLightColor,
    backLightPosition,
    lightTarget,
  } = Object.assign(LIGHT_CONFIG.defaultProps, definedProps(lightingProps));

  const { scene } = useThree();

  const [targets] = useState<{ head: Object3D; shoe: Object3D }>({
    head: new Object3D(),
    shoe: new Object3D(),
  });

  useEffect(() => {
    targets.head.position.copy(lightTarget);
    targets.shoe.position.set(0.0, 0.1, 0.0); // Slightly raised shoe target

    scene.add(targets.head);
    scene.add(targets.shoe);

    return () => {
      scene.remove(targets.head);
      scene.remove(targets.shoe);
    };
  }, [scene, targets, lightTarget]);

  return (
    <group>
      {/* Fill light - creates soft blue rim on the right face side */}
      <spotLight
        position={fillLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.fillLightAngle}
        color={fillLightColor}
        intensity={fillLightIntensity}
        castShadow
        shadow-bias={-0.0001}
        penumbra={0.2}
      />
      {/* Back light - creates warm rim on the left face side */}
      <spotLight
        position={backLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.backLightAngle}
        color={backLightColor}
        intensity={backLightIntensity}
        castShadow
        shadow-bias={-0.0001}
        penumbra={0.2}
      />
      {/* Key light - main face illumination */}
      <spotLight
        position={LIGHT_CONFIG.keyLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.keyLightAngle}
        color={keyLightColor}
        intensity={keyLightIntensity}
        penumbra={0.3}
        castShadow
      />
      {/* Lift light - soft body and shoe illumination */}
      <spotLight
        position={LIGHT_CONFIG.liftLightPosition}
        target={targets.shoe}
        angle={LIGHT_CONFIG.keyLightAngle}
        color={keyLightColor}
        intensity={keyLightIntensity * 0.3}
        penumbra={0.4}
      />
      {/* Silhouette light - rim lighting for arms and legs */}
      <spotLight
        position={LIGHT_CONFIG.silhouetteLightPosition}
        target={targets.head}
        angle={LIGHT_CONFIG.silhouetteLightAngle}
        color={keyLightColor}
        intensity={keyLightIntensity * 0.3}
        penumbra={0.3}
      />
      {/* Ambient light for overall scene brightness */}
      <ambientLight intensity={0.2} color="#FFF8EF" />
    </group>
  );
};

export default Lights;
