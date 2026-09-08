import { MathUtils } from 'three';
import { EMOTION_SMOOTHING, EMOTION_INTENSITY, VISEME_SMOOTHING, BLINK_CONFIG, MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH, MAPPING_BLEND_SHAPE_TO_EMOTION_RPM, } from '../../constants';
export class MorphTargetController {
    constructor(headMesh, rpmBlendShapes, customGlbMapping) {
        this.currentEmotionValues = {};
        this.previousEmotionKeys = new Set();
        this.isRPM = false;
        this.rpmBlendShapes = MAPPING_BLEND_SHAPE_TO_EMOTION_RPM;
        this.customGlbMapping = MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH;
        this.headMesh = headMesh;
        this.isRPM = headMesh.name !== 'GBNL__Head';
        if (rpmBlendShapes) {
            this.rpmBlendShapes = rpmBlendShapes;
        }
        if (customGlbMapping) {
            this.customGlbMapping = customGlbMapping;
        }
    }
    processChatEmission(chatEmission, isLoading) {
        var _a, _b;
        const defaultEmotions = this.getDefaultEmotionMorphTargets();
        if (isLoading || !chatEmission) {
            return defaultEmotions;
        }
        const hasOutputTagEmotion = chatEmission === null || chatEmission === void 0 ? void 0 : chatEmission.includes('<output class="memori-emotion">');
        if (!hasOutputTagEmotion) {
            return defaultEmotions;
        }
        const outputContentEmotion = (_b = (_a = chatEmission === null || chatEmission === void 0 ? void 0 : chatEmission.split('<output class="memori-emotion">')[1]) === null || _a === void 0 ? void 0 : _a.split('</output>')[0]) === null || _b === void 0 ? void 0 : _b.trim();
        if (!outputContentEmotion) {
            return defaultEmotions;
        }
        return this.processEmotion(outputContentEmotion);
    }
    processEmotion(emotionName) {
        const defaultEmotions = this.getDefaultEmotionMorphTargets();
        if (this.isRPM) {
            const foundEmotion = this.rpmBlendShapes.find(item => item.emotion.italian.toLowerCase() === emotionName.toLowerCase() ||
                item.emotion.english.toLowerCase() === emotionName.toLowerCase());
            if (foundEmotion) {
                return { ...defaultEmotions, ...foundEmotion.blendShapes };
            }
        }
        else {
            const foundEmotion = this.customGlbMapping.find(item => item.italian.toLowerCase() === emotionName.toLowerCase() ||
                item.english.toLowerCase() === emotionName.toLowerCase());
            if (foundEmotion) {
                return { ...defaultEmotions, [foundEmotion.english]: 1 };
            }
        }
        return defaultEmotions;
    }
    getDefaultEmotionMorphTargets() {
        if (this.isRPM) {
            const allBlendShapeKeys = new Set();
            this.rpmBlendShapes.forEach(item => {
                Object.keys(item.blendShapes).forEach(key => allBlendShapeKeys.add(key));
            });
            return Array.from(allBlendShapeKeys).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
        }
        else {
            return this.customGlbMapping.reduce((acc, emotion) => ({ ...acc, [emotion.english]: 0 }), {});
        }
    }
    updateMorphTargets(currentTime, chatEmission, isLoading, currentViseme, eyeBlink, blinkState) {
        if (!this.headMesh.morphTargetDictionary ||
            !this.headMesh.morphTargetInfluences) {
            console.error('[MorphTargetController] Missing morphTargetDictionary or morphTargetInfluences');
            return;
        }
        const emotionMorphTargets = this.processChatEmission(chatEmission, isLoading);
        const blinkValue = this.calculateBlinkValue(currentTime, blinkState, eyeBlink);
        const currentEmotionKeys = new Set(Object.keys(emotionMorphTargets));
        Object.entries(this.headMesh.morphTargetDictionary).forEach(([key, index]) => {
            if (typeof index !== 'number')
                return;
            let targetValue = 0;
            if (currentEmotionKeys.has(key)) {
                const targetEmotionValue = emotionMorphTargets[key];
                const currentEmotionValue = this.currentEmotionValues[key] || 0;
                const newEmotionValue = MathUtils.lerp(currentEmotionValue, targetEmotionValue * EMOTION_INTENSITY, EMOTION_SMOOTHING);
                this.currentEmotionValues[key] = newEmotionValue;
                targetValue += newEmotionValue;
            }
            if (currentViseme && key === currentViseme.name) {
                targetValue += currentViseme.weight;
            }
            if (key === 'eyesClosed' && eyeBlink) {
                targetValue += blinkValue;
            }
            targetValue = MathUtils.clamp(targetValue, 0, 1);
            if (this.headMesh.morphTargetInfluences) {
                const finalValue = MathUtils.lerp(this.headMesh.morphTargetInfluences[index] || 0, targetValue, VISEME_SMOOTHING);
                this.headMesh.morphTargetInfluences[index] = finalValue;
            }
        });
        this.previousEmotionKeys = currentEmotionKeys;
    }
    calculateBlinkValue(currentTime, blinkState, eyeBlink) {
        if (!eyeBlink)
            return 0;
        let blinkValue = 0;
        if (currentTime >= blinkState.nextBlinkTime && !blinkState.isBlinking) {
            blinkState.isBlinking = true;
            blinkState.blinkStartTime = currentTime;
            blinkState.lastBlinkTime = currentTime;
            blinkState.nextBlinkTime =
                currentTime +
                    Math.random() * (BLINK_CONFIG.maxInterval - BLINK_CONFIG.minInterval) +
                    BLINK_CONFIG.minInterval;
        }
        if (blinkState.isBlinking) {
            const blinkProgress = (currentTime - blinkState.blinkStartTime) / BLINK_CONFIG.blinkDuration;
            if (blinkProgress <= 0.5) {
                blinkValue = blinkProgress * 2;
            }
            else if (blinkProgress <= 1) {
                blinkValue = 2 - blinkProgress * 2;
            }
            else {
                blinkState.isBlinking = false;
                blinkValue = 0;
            }
        }
        return blinkValue;
    }
}
//# sourceMappingURL=MorphTargetController.js.map