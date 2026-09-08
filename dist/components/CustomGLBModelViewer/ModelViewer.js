"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ModelViewer = ({ src, poster, alt = '' }) => {
    (0, react_1.useEffect)(() => {
        const script = document.createElement('script');
        script.src =
            'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        script.type = 'module';
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: "model-viewer", children: (0, jsx_runtime_1.jsx)("model-viewer", { src: src, "ios-src": "", poster: poster, alt: alt, "shadow-intensity": "1", "disable-zoom": true, "camera-controls": true, autoplay: true }) }));
};
exports.default = ModelViewer;
//# sourceMappingURL=ModelViewer.js.map