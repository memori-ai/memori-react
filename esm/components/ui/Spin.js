import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
import Loading from '../icons/Loading';
const Spin = ({ spinning = false, primary = false, className, children, }) => (_jsxs("div", { className: cx('memori-spin', className, {
        'memori-spin--spinning': spinning,
        'memori-spin--primary': primary,
    }), children: [children, _jsx("div", { className: "memori-spin--spinner", children: _jsx(Loading, { loading: true }) })] }));
export default Spin;
//# sourceMappingURL=Spin.js.map