import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
const ModelViewer = ({ src, poster, alt = '' }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        script.type = 'module';
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);
    return (_jsx("div", { className: "model-viewer", children: _jsx("model-viewer", { src: src, "ios-src": "", poster: poster, alt: alt, "shadow-intensity": "1", "disable-zoom": true, "camera-controls": true, autoplay: true }) }));
};
export default ModelViewer;
//# sourceMappingURL=ModelViewer.js.map