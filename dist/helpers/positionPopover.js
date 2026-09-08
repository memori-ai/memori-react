"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRestartSessionOnPositionPopoverClose = shouldRestartSessionOnPositionPopoverClose;
function shouldRestartSessionOnPositionPopoverClose(wasOpen, nextOpen, autoStart, sessionAlreadyStarted = false) {
    return (wasOpen && !nextOpen && !!autoStart && !sessionAlreadyStarted);
}
//# sourceMappingURL=positionPopover.js.map