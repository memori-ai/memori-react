import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Html, useProgress } from '@react-three/drei';
import Spin from '../../../../ui/Spin';
const Loader = ({ fallbackImg }) => {
    const { progress } = useProgress();
    return (_jsx(Html, { center: true, className: "avatar-loader", children: _jsx(Spin, { spinning: true, children: fallbackImg ? (_jsxs("figure", { children: [_jsx("img", { src: fallbackImg, alt: `${Math.round(progress)}% loaded`, title: `${Math.round(progress)}% loaded` }), _jsx("figcaption", { children: `${Math.round(progress)}%` })] })) : (_jsxs(_Fragment, { children: [Math.round(progress), " % loaded"] })) }) }));
};
export default Loader;
//# sourceMappingURL=loader.js.map