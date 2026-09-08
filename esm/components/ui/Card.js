import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
import Spin from './Spin';
const Card = ({ loading = false, className, title, description, cover, hoverable = false, children, onClick, }) => (_jsx("div", { onClick: onClick, className: cx('memori-card', className, {
        'memori-card--loading': loading,
        'memori-card--with-cover': cover,
        'memori-card--hoverable': hoverable,
        'memori-card--pointer': !!onClick,
    }), children: _jsxs(Spin, { spinning: loading, children: [cover && _jsx("div", { className: "memori-card--cover", children: cover }), _jsxs("div", { className: "memori-card--content", children: [title && _jsx("h3", { className: "memori-card--title", children: title }), description && (_jsx("p", { className: "memori-card--description", children: description })), _jsx("div", { className: "memori-card--children", children: children })] })] }) }));
export default Card;
//# sourceMappingURL=Card.js.map