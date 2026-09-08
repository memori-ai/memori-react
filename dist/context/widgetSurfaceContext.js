"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSurfaceProvider = void 0;
exports.useWidgetSurfaceEl = useWidgetSurfaceEl;
const react_1 = require("react");
const WidgetSurfaceContext = (0, react_1.createContext)(null);
exports.WidgetSurfaceProvider = WidgetSurfaceContext.Provider;
function useWidgetSurfaceEl() {
    return (0, react_1.useContext)(WidgetSurfaceContext);
}
//# sourceMappingURL=widgetSurfaceContext.js.map