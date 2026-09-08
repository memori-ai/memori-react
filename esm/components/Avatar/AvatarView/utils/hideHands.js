export const hideHands = (nodes) => {
    if (nodes.Wolf3D_Hands) {
        nodes.Wolf3D_Hands.visible = false;
    }
    if (nodes.RightHand && nodes.LeftHand) {
        nodes.RightHand.position.set(0, -2, 0);
        nodes.LeftHand.position.set(0, -2, 0);
    }
};
//# sourceMappingURL=hideHands.js.map