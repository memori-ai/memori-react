"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const react_i18next_1 = require("react-i18next");
class ErrorBoundary extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
        };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback ? (this.props.fallback) : ((0, jsx_runtime_1.jsxs)("div", { style: {
                    background: 'rgba(255, 255, 255, 0.4)',
                    color: '#000',
                    padding: '2rem',
                    borderRadius: '10px',
                }, children: [(0, jsx_runtime_1.jsx)("h2", { children: this.props.t('error.generic') }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, onClick: () => this.setState({ hasError: false }), children: this.props.t('error.tryAgain') || 'Try again' })] }));
        }
        return this.props.children;
    }
}
exports.default = (0, react_i18next_1.withTranslation)(['common'])(ErrorBoundary);
//# sourceMappingURL=ErrorBoundary.js.map