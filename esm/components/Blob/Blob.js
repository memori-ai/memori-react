import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
const ExperienceBlob = ({ avatar, speaking = false }) => {
    return (_jsxs("div", { className: cx('memori-blob', { 'memori-blob--speaking': speaking }), children: [avatar && (_jsx("figure", { children: _jsx("img", { src: avatar, alt: "", role: "presentation" }) })), _jsx("div", { className: "mainDiv" }), _jsx("div", { className: "mainDiv" }), _jsx("div", { className: "mainDiv" }), _jsx("div", { className: "mainDiv" }), _jsx("div", { className: "mainDiv" })] }));
};
export default ExperienceBlob;
//# sourceMappingURL=Blob.js.map