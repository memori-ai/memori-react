import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Facebook from '../icons/Facebook';
import Twitter from '../icons/Twitter';
import LinkedIn from '../icons/Linkedin';
import WhatsApp from '../icons/WhatsApp';
import Mail from '../icons/Mail';
import Link from '../icons/Link';
import Share from '../icons/Share';
import Download from '../icons/Download';
import Telegram from '../icons/Telegram';
import FilePdf from '../icons/FilePdf';
import { QRCodeCanvas } from 'qrcode.react';
import { Menu } from '@headlessui/react';
import Button from '../ui/Button';
import cx from 'classnames';
import { pdfExporter } from '../MemoriArtifactSystem/components/ArtifactActions/utils/PDFExporter';
import toast from 'react-hot-toast';
import { formatChatHistoryForPDF, createChatPDFDocument, } from '../../helpers/chatPdfExport';
const ShareButton = ({ tenant, memori, sessionID, url, title = '', className, baseUrl, primary = true, showQrCode = true, align = 'right', history = [], }) => {
    const { t, i18n } = useTranslation();
    const [targetUrl, setTargetUrl] = useState(url);
    const [isExportingPDF, setIsExportingPDF] = useState(false);
    const qrImageURL = useMemo(() => (tenant === null || tenant === void 0 ? void 0 : tenant.theme)
        ? `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://aisuru.com'}/images/${tenant.theme}/square_logo.png`
        : `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://aisuru.com'}/images/memori_logo.png`, [tenant, baseUrl]);
    useEffect(() => {
        if (!url)
            setTargetUrl(window.location.href);
    }, [url]);
    const socialShare = [
        {
            id: 'facebook',
            title: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${targetUrl}`,
            icon: Facebook,
        },
        {
            id: 'twitter',
            title: 'Twitter',
            url: `https://twitter.com/intent/tweet?url=${targetUrl}`,
            icon: Twitter,
        },
        {
            id: 'linkedin',
            title: 'LinkedIn',
            url: `https://www.linkedin.com/shareArticle?mini=true&title=${title}&url=${targetUrl}`,
            icon: LinkedIn,
        },
        {
            id: 'whatsapp',
            title: 'Whatsapp',
            url: `https://api.whatsapp.com/send?phone=&text=${targetUrl}`,
            icon: WhatsApp,
        },
        {
            id: 'telegram',
            title: 'Telegram',
            url: `https://t.me/share/url?text=${title}&url=${targetUrl}`,
            icon: Telegram,
        },
        {
            id: 'email',
            title: 'Email',
            url: `mailto:?subject=${(title === null || title === void 0 ? void 0 : title.length) > 0 ? title : url}&body=${targetUrl}`,
            icon: Mail,
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
            toast.error(t('exportChatHistory.empty') || 'No chat history to export');
            return;
        }
        if (!pdfExporter.isSupported()) {
            toast.error(t('exportChatHistory.pdfNotSupported') ||
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
            const htmlContent = formatChatHistoryForPDF({
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
            const htmlDocument = createChatPDFDocument(htmlContent, pdfTitle, pdfOptions);
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
            toast.success(t('exportChatHistory.success') || 'Chat exported to PDF successfully');
        }
        catch (error) {
            console.error('PDF export error:', error);
            toast.error(t('exportChatHistory.error') ||
                'Failed to export chat to PDF. Please try again.');
        }
        finally {
            setIsExportingPDF(false);
        }
    };
    const sharedUrl = useMemo(() => {
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
    return (_jsxs(Menu, { as: "div", className: cx('memori-share-button', {
            'memori-share-button--align-left': align === 'left',
        }), children: [_jsx(Menu.Button, { className: cx('memori-button', 'memori-button--circle', 'memori-button--icon-only', 'memori-share-button--button', className, {
                    'memori-button--primary': primary,
                }), title: t('widget.share') || undefined, children: _jsx("div", { className: "memori-button--icon", children: _jsx(Share, {}) }) }), _jsxs(Menu.Items, { className: "memori-share-button--overlay", as: "ul", children: [memori && sessionID && sharedUrl && (_jsx(Menu.Item, { as: "li", className: "memori-share-button--li memori-share-button--li-shared", children: _jsxs("a", { className: cx('memori-button', 'memori-button--with-icon', 'memori-button--ghost', 'memori-button--padded', 'memori-share-button--link'), href: sharedUrl, target: "_blank", rel: "noopener noreferrer", children: [_jsx("div", { className: "memori-button--icon", children: _jsx(Share, {}) }), t('widget.shareChat') || 'Share chat'] }) }, "shared")), history && history.length > 0 && (_jsx(Menu.Item, { as: "li", className: "memori-share-button--li", children: _jsx(Button, { className: "memori-share-button--link", ghost: true, icon: _jsx(FilePdf, {}), onClick: handleExportPDF, disabled: isExportingPDF, children: isExportingPDF
                                ? t('exportChatHistory.exporting') || 'Exporting...'
                                : t('exportChatHistory.exportPDF') || 'Export chat as PDF' }) }, "export-pdf")), _jsx(Menu.Item, { as: "li", className: "memori-share-button--li", children: _jsx(Button, { className: "memori-share-button--link", ghost: true, icon: _jsx(Link, {}), onClick: () => {
                                targetUrl && navigator.clipboard.writeText(targetUrl);
                            }, children: t('copyToClipboard') || undefined }) }, "copy"), socialShare.map(item => {
                        var _a;
                        return (_jsx(Menu.Item, { as: "li", className: "memori-share-button--li", children: _jsxs("a", { className: cx('memori-button', 'memori-button--with-icon', 'memori-button--ghost', 'memori-button--padded', 'memori-share-button--link'), href: (_a = item.url) !== null && _a !== void 0 ? _a : '', target: "_blank", rel: "noopener noreferrer", children: [_jsx("div", { className: "memori-button--icon", children: _jsx(item.icon, {}) }), item.title] }) }, item.id));
                    }), showQrCode && (_jsxs(Menu.Item, { as: "li", className: "memori-share-button--li-qr-code", children: [_jsx(QRCodeCanvas, { id: "qr-canvas", value: targetUrl !== null && targetUrl !== void 0 ? targetUrl : '', size: 128, bgColor: '#ffffff', fgColor: '#000000', level: 'H', includeMargin: false, imageSettings: {
                                    src: qrImageURL,
                                    x: undefined,
                                    y: undefined,
                                    height: 32,
                                    width: 32,
                                    excavate: true,
                                } }), _jsx("div", { children: _jsx(Button, { onClick: downloadQRCode, icon: _jsx(Download, {}), title: "Download QR", children: "Download" }) })] }, "qrcode"))] })] }));
};
export default ShareButton;
//# sourceMappingURL=ShareButton.js.map