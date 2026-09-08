"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const Tooltip_1 = tslib_1.__importDefault(require("../ui/Tooltip"));
const Warning_1 = tslib_1.__importDefault(require("../icons/Warning"));
const react_i18next_1 = require("react-i18next");
const BlockedMemoriBadge = ({ memoriName, blockedUntil, notEnoughCredits = false, showGiverInfo = false, showTitle = false, marginLeft = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const blockedUntilDate = new Date(blockedUntil || Date.now());
    return notEnoughCredits || blockedUntilDate > new Date(Date.now()) ? ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { className: "blocked-memori-badge--tooltip", content: notEnoughCredits ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: t('notEnoughCredits') })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!showGiverInfo &&
                    t('memoriBlockedAnon', {
                        name: memoriName,
                        date: new Intl.DateTimeFormat('it', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format(blockedUntilDate),
                    }), showGiverInfo &&
                    t('memoriBlockedUntil', {
                        date: new Intl.DateTimeFormat('it', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format(blockedUntilDate),
                    }), showGiverInfo && ` ${t('memoriBlockedReasonExceedChats')}`, showGiverInfo && (0, jsx_runtime_1.jsx)("br", {}), showGiverInfo && `\n${t('memoriBlockedGiverHelper')}`] })), children: (0, jsx_runtime_1.jsxs)("div", { className: "blocked-memori-badge--wrapper", children: [(0, jsx_runtime_1.jsx)("div", { className: `blocked-memori-badge ${marginLeft ? ` margin-left` : ''}`, children: (0, jsx_runtime_1.jsx)(Warning_1.default, { className: "blocked-memori-badge--icon" }) }), showTitle && ((0, jsx_runtime_1.jsx)("span", { className: "blocked-memori-badge--title", children: t('memoriBlockedTitle') }))] }) })) : null;
};
exports.default = BlockedMemoriBadge;
//# sourceMappingURL=BlockedMemoriBadge.js.map