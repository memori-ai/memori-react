"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarPositionController = void 0;
const three_1 = require("three");
const constants_1 = require("../../constants");
class AvatarPositionController {
    constructor(defaultPosition = constants_1.AVATAR_POSITION.clone(), zoomedPosition = constants_1.AVATAR_POSITION_ZOOMED.clone(), initialCameraZ = 0.6) {
        this.defaultPosition = defaultPosition;
        this.zoomedPosition = zoomedPosition;
        this.currentScale = new three_1.Vector3(1, 1, 1);
        this.targetScale = new three_1.Vector3(1, 1, 1);
        this.currentPosition = defaultPosition.clone();
        this.basePosition = defaultPosition.clone();
        this.initialCameraPosition = new three_1.Vector3(0, 0, initialCameraZ);
    }
    mapHeightToScale(sliderValue, isHalfBody) {
        if (isHalfBody) {
            return three_1.MathUtils.lerp(1.4, 2.1, sliderValue / 100);
        }
        else {
            return three_1.MathUtils.lerp(0.5, 1.5, sliderValue / 100);
        }
    }
    mapDepthToCamera(depthValue, isHalfBody) {
        const baseZ = this.initialCameraPosition.z;
        if (isHalfBody) {
            return three_1.MathUtils.lerp(baseZ, baseZ + 3, depthValue / 100);
        }
        else {
            return three_1.MathUtils.lerp(baseZ, baseZ + 3, depthValue / 100);
        }
    }
    updateHeight(heightValue, isHalfBody) {
        const heightScale = this.mapHeightToScale(heightValue, isHalfBody);
        this.targetScale.set(heightScale, heightScale, heightScale);
    }
    updateDepth(depthValue, isHalfBody) {
        return this.mapDepthToCamera(depthValue, isHalfBody);
    }
    updateBasePosition(isZoomed) {
        const newPosition = isZoomed ? this.zoomedPosition : this.defaultPosition;
        this.basePosition.copy(newPosition);
        this.currentPosition.copy(newPosition);
    }
    updateScale(lerpFactor) {
        this.currentScale.lerp(this.targetScale, lerpFactor);
        return this.currentScale;
    }
    getPosition() {
        return this.currentPosition;
    }
    reset() {
        this.currentScale.set(1, 1, 1);
        this.targetScale.set(1, 1, 1);
        this.currentPosition.copy(this.defaultPosition);
        this.basePosition.copy(this.defaultPosition);
    }
}
exports.AvatarPositionController = AvatarPositionController;
//# sourceMappingURL=AvatarPositionController.js.map