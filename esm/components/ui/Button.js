import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
import Loading from '../icons/Loading';
const Button = ({ primary = false, outlined = false, ghost = false, padded = true, shape = 'rounded', danger = false, loading = false, disabled = false, block = false, icon, className, title, id, htmlType, onClick, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, children, isActive, }) => (_jsxs("button", { id: id, type: htmlType, onClick: onClick, onMouseDown: onMouseDown, onMouseUp: onMouseUp, onMouseLeave: onMouseLeave, onTouchStart: onTouchStart, onTouchEnd: onTouchEnd, title: title, disabled: loading || disabled, className: cx('memori-button', {
        'memori-button--primary': primary,
        'memori-button--outlined': outlined,
        'memori-button--ghost': ghost,
        'memori-button--square': shape === 'square',
        'memori-button--rounded': shape === 'rounded',
        'memori-button--circle': shape === 'circle',
        'memori-button--padded': padded,
        'memori-button--block': block,
        'memori-button--with-icon': (icon || loading) && children,
        'memori-button--icon-only': (icon || loading) && !children,
        'memori-button--danger': danger,
        'memori-button--loading': loading,
        'memori-button--active': isActive,
    }, className), children: [icon && !loading && _jsx("span", { className: "memori-button--icon", children: icon }), loading && (_jsx("span", { className: "memori-button--icon loading-icon", children: _jsx(Loading, { loading: true }) })), children] }));
export default Button;
//# sourceMappingURL=Button.js.map