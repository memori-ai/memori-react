import { SkinnedMesh } from 'three';
import { EmotionMapping, BlendShapeMap } from '../../constants';
export declare class MorphTargetController {
    private headMesh;
    private currentEmotionValues;
    private previousEmotionKeys;
    private isRPM;
    private rpmBlendShapes;
    private customGlbMapping;
    constructor(headMesh: SkinnedMesh, rpmBlendShapes?: BlendShapeMap, customGlbMapping?: EmotionMapping);
    processChatEmission(chatEmission: any, isLoading: boolean): Record<string, number>;
    private processEmotion;
    private getDefaultEmotionMorphTargets;
    updateMorphTargets(currentTime: number, chatEmission: any, isLoading: boolean, currentViseme: {
        name: string;
        weight: number;
    } | null, eyeBlink: boolean, blinkState: {
        isBlinking: boolean;
        lastBlinkTime: number;
        nextBlinkTime: number;
        blinkStartTime: number;
    }): void;
    private calculateBlinkValue;
}
