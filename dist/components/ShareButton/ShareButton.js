"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const Facebook_1 = tslib_1.__importDefault(require("../icons/Facebook"));
const Twitter_1 = tslib_1.__importDefault(require("../icons/Twitter"));
const Linkedin_1 = tslib_1.__importDefault(require("../icons/Linkedin"));
const WhatsApp_1 = tslib_1.__importDefault(require("../icons/WhatsApp"));
const Mail_1 = tslib_1.__importDefault(require("../icons/Mail"));
const Link_1 = tslib_1.__importDefault(require("../icons/Link"));
const Share_1 = tslib_1.__importDefault(require("../icons/Share"));
const Download_1 = tslib_1.__importDefault(require("../icons/Download"));
const Telegram_1 = tslib_1.__importDefault(require("../icons/Telegram"));
const FilePdf_1 = tslib_1.__importDefault(require("../icons/FilePdf"));
const qrcode_react_1 = require("qrcode.react");
const react_2 = require("@headlessui/react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const PDFExporter_1 = require("../MemoriArtifactSystem/components/ArtifactActions/utils/PDFExporter");
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const chatPdfExport_1 = require("../../helpers/chatPdfExport");
const ShareButton = ({ tenant, memori, sessionID, url, title = '', className, baseUrl, primary = true, showQrCode = true, align = 'right', history = [], }) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [targetUrl, setTargetUrl] = (0, react_1.useState)(url);
    const [isExportingPDF, setIsExportingPDF] = (0, react_1.useState)(false);
    const qrImageURL = (0, react_1.useMemo)(() => (tenant === null || tenant === void 0 ? void 0 : tenant.theme)
        ? `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://aisuru.com'}/images/${tenant.theme}/square_logo.png`
        : `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://aisuru.com'}/images/memori_logo.png`, [tenant, baseUrl]);
    (0, react_1.useEffect)(() => {
        if (!url)
            setTargetUrl(window.location.href);
    }, [url]);
    const socialShare = [
        {
            id: 'facebook',
            title: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${targetUrl}`,
            icon: Facebook_1.default,
        },
        {
            id: 'twitter',
            title: 'Twitter',
            url: `https://twitter.com/intent/tweet?url=${targetUrl}`,
            icon: Twitter_1.default,
        },
        {
            id: 'linkedin',
            title: 'LinkedIn',
            url: `https://www.linkedin.com/shareArticle?mini=true&title=${title}&url=${targetUrl}`,
            icon: Linkedin_1.default,
        },
        {
            id: 'whatsapp',
            title: 'Whatsapp',
            url: `https://api.whatsapp.com/send?phone=&text=${targetUrl}`,
            icon: WhatsApp_1.default,
        },
        {
            id: 'telegram',
            title: 'Telegram',
            url: `https://t.me/share/url?text=${title}&url=${targetUrl}`,
            icon: Telegram_1.default,
        },
        {
            id: 'email',
            title: 'Email',
            url: `mailto:?subject=${(title === null || title === void 0 ? void 0 : title.length) > 0 ? title : url}&body=${targetUrl}`,
            icon: Mail_1.default,
        },
    ];
    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-canvas');
        if (!canvas)
            return;
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = `memori-${title}-share.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleExportPDF = async () => {
        if (!history || history.length === 0) {
            react_hot_toast_1.default.error(t('exportChatHistory.empty') || 'No chat history to export');
            return;
        }
        if (!PDFExporter_1.pdfExporter.isSupported()) {
            react_hot_toast_1.default.error(t('exportChatHistory.pdfNotSupported') ||
                'PDF export is not supported in this browser');
            return;
        }
        setIsExportingPDF(true);
        try {
            const memoriName = (memori === null || memori === void 0 ? void 0 : memori.name) || 'Chat';
            const pdfTitle = `${memoriName} - Chat Export`;
            if (!memori) {
                throw new Error('Memori is required for PDF export');
            }
            const htmlContent = (0, chatPdfExport_1.formatChatHistoryForPDF)({
                messages: history,
                memori: memori,
                conversationStartedLabel: t('write_and_speak.conversationStartedLabel') ||
                    'Conversation started',
                language: navigator.language,
            });
            let primaryColorRgb;
            try {
                const rootElement = document.querySelector('.memori-widget') ||
                    document.querySelector('memori-client') ||
                    document.documentElement;
                const computedStyle = getComputedStyle(rootElement);
                primaryColorRgb = computedStyle.getPropertyValue('--memori-primary-rgb').trim();
                if (!primaryColorRgb) {
                    primaryColorRgb = getComputedStyle(document.documentElement)
                        .getPropertyValue('--memori-primary-rgb')
                        .trim();
                }
            }
            catch (error) {
                console.warn('Could not read --memori-primary-rgb CSS variable:', error);
            }
            const pdfOptions = {
                fontSize: '12pt',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6',
                color: '#333',
                backgroundColor: '#fff',
                primaryColorRgb: primaryColorRgb || undefined,
            };
            const htmlDocument = (0, chatPdfExport_1.createChatPDFDocument)(htmlContent, pdfTitle, pdfOptions);
            const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
            if (!printWindow) {
                throw new Error('Popup blocked! Please enable popups to export PDF.');
            }
            printWindow.document.write(htmlDocument);
            printWindow.document.close();
            printWindow.document.title = pdfTitle;
            setTimeout(() => {
                if (printWindow && !printWindow.closed) {
                    printWindow.focus();
                    printWindow.print();
                    setTimeout(() => {
                        if (printWindow && !printWindow.closed) {
                            printWindow.close();
                        }
                    }, 1000);
                }
            }, 500);
            react_hot_toast_1.default.success(t('exportChatHistory.success') || 'Chat exported to PDF successfully');
        }
        catch (error) {
            console.error('PDF export error:', error);
            react_hot_toast_1.default.error(t('exportChatHistory.error') ||
                'Failed to export chat to PDF. Please try again.');
        }
        finally {
            setIsExportingPDF(false);
        }
    };
    const sharedUrl = (0, react_1.useMemo)(() => {
        if (!memori || !sessionID)
            return undefined;
        if (memori.ownerUserID) {
            return `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://www.aisuru.com'}/${i18n.language === 'it' ? 'it' : 'en'}/shared/${memori.ownerUserID}/${memori.memoriID}/${sessionID}`;
        }
        if (memori.exposed) {
            return `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://www.aisuru.com'}/${i18n.language === 'it' ? 'it' : 'en'}/shared/${memori.ownerUserName}/${memori.name}/${sessionID}`;
        }
        return undefined;
    }, [memori, sessionID, baseUrl, i18n.language]);
    return ((0, jsx_runtime_1.jsxs)(react_2.Menu, { as: "div", className: (0, classnames_1.default)('memori-share-button', {
            'memori-share-button--align-left': align === 'left',
        }), children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Button, { className: (0, classnames_1.default)('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', className, {
                    'memori-button--primary': primary,
                }), title: t('widget.share') || undefined, children: (0, jsx_runtime_1.jsx)("div", { className: "memori-button--icon", children: (0, jsx_runtime_1.jsx)(Share_1.default, {}) }) }), (0, jsx_runtime_1.jsxs)(react_2.Menu.Items, { className: "memori-share-button--overlay", as: "ul", children: [memori && sessionID && sharedUrl && ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { as: "li", className: "memori-share-button--li memori-share-button--li-shared", children: (0, jsx_runtime_1.jsxs)("a", { className: (0, classnames_1.default)('memori-button', 'memori-button--with-icon', 'memori-button--ghost', 'memori-button--padded', 'memori-share-button--link'), href: sharedUrl, target: "_blank", rel: "noopener noreferrer", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-button--icon", children: (0, jsx_runtime_1.jsx)(Share_1.default, {}) }), t('widget.shareChat') || 'Share chat'] }) }, "shared")), history && history.length > 0 && ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { as: "li", className: "memori-share-button--li", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-share-button--link", ghost: true, icon: (0, jsx_runtime_1.jsx)(FilePdf_1.default, {}), onClick: handleExportPDF, disabled: isExportingPDF, children: isExportingPDF
                                ? t('exportChatHistory.exporting') || 'Exporting...'
                                : t('exportChatHistory.exportPDF') || 'Export chat as PDF' }) }, "export-pdf")), (0, jsx_runtime_1.jsx)(react_2.Menu.Item, { as: "li", className: "memori-share-button--li", children: (0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori-share-button--link", ghost: true, icon: (0, jsx_runtime_1.jsx)(Link_1.default, {}), onClick: () => {
                                targetUrl && navigator.clipboard.writeText(targetUrl);
                            }, children: t('copyToClipboard') || undefined }) }, "copy"), socialShare.map(item => {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { as: "li", className: "memori-share-button--li", children: (0, jsx_runtime_1.jsxs)("a", { className: (0, classnames_1.default)('memori-button', 'memori-button--with-icon', 'memori-button--ghost', 'memori-button--padded', 'memori-share-button--link'), href: (_a = item.url) !== null && _a !== void 0 ? _a : '', target: "_blank", rel: "noopener noreferrer", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-button--icon", children: (0, jsx_runtime_1.jsx)(item.icon, {}) }), item.title] }) }, item.id));
                    }), showQrCode && ((0, jsx_runtime_1.jsxs)(react_2.Menu.Item, { as: "li", className: "memori-share-button--li-qr-code", children: [(0, jsx_runtime_1.jsx)(qrcode_react_1.QRCodeCanvas, { id: "qr-canvas", value: targetUrl !== null && targetUrl !== void 0 ? targetUrl : '', size: 128, bgColor: '#ffffff', fgColor: '#000000', level: 'H', includeMargin: false, imageSettings: {
                                    src: qrImageURL,
                                    x: undefined,
                                    y: undefined,
                                    height: 32,
                                    width: 32,
                                    excavate: true,
                                } }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: downloadQRCode, icon: (0, jsx_runtime_1.jsx)(Download_1.default, {}), title: "Download QR", children: "Download" }) })] }, "qrcode"))] })] }));
};
exports.default = ShareButton;
//# sourceMappingURL=ShareButton.js.map