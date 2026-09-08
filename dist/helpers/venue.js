"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUncertaintyByViewport = exports.DEGREES_TO_RADIANS = exports.EARTH_RADIUS_AT_45_DEGRESS = void 0;
exports.EARTH_RADIUS_AT_45_DEGRESS = (6357.0 + 6378.0) / 2.0;
exports.DEGREES_TO_RADIANS = Math.PI / 180;
const getUncertaintyByViewport = (bouningBox) => {
    const [minLat, maxLat, minLng, maxLng] = typeof bouningBox[0] === 'string'
        ? bouningBox.map(parseFloat)
        : bouningBox;
    const phi1 = minLat * exports.DEGREES_TO_RADIANS;
    const lambda1 = minLng * exports.DEGREES_TO_RADIANS;
    const phi2 = maxLat * exports.DEGREES_TO_RADIANS;
    const lambda2 = maxLng * exports.DEGREES_TO_RADIANS;
    const angle = 2.0 *
        Math.asin(Math.sqrt(Math.sin((phi2 - phi1) / 2.0) * Math.sin((phi2 - phi1) / 2.0) +
            Math.cos(phi1) *
                Math.cos(phi2) *
                Math.sin((lambda2 - lambda1) / 2.0) *
                Math.sin((lambda2 - lambda1) / 2.0)));
    return exports.EARTH_RADIUS_AT_45_DEGRESS * angle;
};
exports.getUncertaintyByViewport = getUncertaintyByViewport;
//# sourceMappingURL=venue.js.map