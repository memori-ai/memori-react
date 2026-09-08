import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import { useTranslation } from 'react-i18next';
const BlockedMemoriBadge = ({ memoriName, blockedUntil, notEnoughCredits = false, showGiverInfo = false, showTitle = false, marginLeft = false, }) => {
    const { t } = useTranslation();
    const blockedUntilDate = new Date(blockedUntil || Date.now());
    return notEnoughCredits || blockedUntilDate > new Date(Date.now()) ? (_jsx(Tooltip, { className: "blocked-memori-badge--tooltip", content: notEnoughCredits ? (_jsx(_Fragment, { children: t('notEnoughCredits') })) : (_jsxs(_Fragment, { children: [!showGiverInfo &&
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
                    }), showGiverInfo && ` ${t('memoriBlockedReasonExceedChats')}`, showGiverInfo && _jsx("br", {}), showGiverInfo && `\n${t('memoriBlockedGiverHelper')}`] })), children: _jsxs("div", { className: "blocked-memori-badge--wrapper", children: [_jsx("div", { className: `blocked-memori-badge ${marginLeft ? ` margin-left` : ''}`, children: _jsx(Warning, { className: "blocked-memori-badge--icon" }) }), showTitle && (_jsx("span", { className: "blocked-memori-badge--title", children: t('memoriBlockedTitle') }))] }) })) : null;
};
export default BlockedMemoriBadge;
//# sourceMappingURL=BlockedMemoriBadge.js.map