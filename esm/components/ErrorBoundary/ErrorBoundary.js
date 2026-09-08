import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import Button from '../ui/Button';
import { withTranslation } from 'react-i18next';
class ErrorBoundary extends Component {
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
            return this.props.fallback ? (this.props.fallback) : (_jsxs("div", { style: {
                    background: 'rgba(255, 255, 255, 0.4)',
                    color: '#000',
                    padding: '2rem',
                    borderRadius: '10px',
                }, children: [_jsx("h2", { children: this.props.t('error.generic') }), _jsx(Button, { primary: true, onClick: () => this.setState({ hasError: false }), children: this.props.t('error.tryAgain') || 'Try again' })] }));
        }
        return this.props.children;
    }
}
export default withTranslation(['common'])(ErrorBoundary);
//# sourceMappingURL=ErrorBoundary.js.map