import React, { useEffect, useMemo, useState } from 'react';
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
import { Button, Dropdown } from '@memori.ai/ui';
import cx from 'classnames';
import { Tenant, Memori, Message } from '@memori.ai/memori-api-client/dist/types';
import { pdfExporter } from '../MemoriArtifactSystem/components/ArtifactActions/utils/PDFExporter';
import toast from 'react-hot-toast';
import {
  formatChatHistoryForPDF,
  createChatPDFDocument,
  ChatPDFOptions,
} from '../../helpers/chatPdfExport';

export interface Props {
  tenant?: Tenant;
  memori?: Memori;
  sessionID?: string;
  url?: string;
  title?: string;
  className?: string;
  primary?: boolean;
  baseUrl?: string;
  showQrCode?: boolean;
  align?: 'left' | 'right';
  history?: Message[];
}

const ShareButton: React.FC<Props> = ({
  tenant,
  memori,
  sessionID,
  url,
  title = '',
  className,
  baseUrl,
  primary = true,
  showQrCode = true,
  align = 'right',
  history = [],
}: Props) => {
  const { t, i18n } = useTranslation();
  const [targetUrl, setTargetUrl] = useState(url);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const qrImageURL = useMemo(
    () =>
      tenant?.theme
        ? `${baseUrl ?? 'https://aisuru.com'}/images/${
            tenant.theme
          }/square_logo.png`
        : `${baseUrl ?? 'https://aisuru.com'}/images/memori_logo.png`,
    [tenant, baseUrl]
  );

  useEffect(() => {
    if (!url) setTargetUrl(window.location.href);
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
      url: `mailto:?subject=${
        title?.length > 0 ? title : url
      }&body=${targetUrl}`,
      icon: Mail,
    },
  ];

  const downloadQRCode = () => {
    const canvas: HTMLCanvasElement | null = document.getElementById(
      'qr-canvas'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `memori-${title}-share.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Export chat history as PDF
   */
  const handleExportPDF = async () => {
    if (!history || history.length === 0) {
      toast.error(t('exportChatHistory.empty') || 'No chat history to export');
      return;
    }

    if (!pdfExporter.isSupported()) {
      toast.error(
        t('exportChatHistory.pdfNotSupported') ||
          'PDF export is not supported in this browser'
      );
      return;
    }

    setIsExportingPDF(true);

    try {
      const memoriName = memori?.name || 'Chat';
      const pdfTitle = `${memoriName} - Chat Export`;

      // Format chat history as HTML using modular utility
      if (!memori) {
        throw new Error('Memori is required for PDF export');
      }

      const htmlContent = formatChatHistoryForPDF({
        messages: history,
        memori: memori,
        conversationStartedLabel:
          t('write_and_speak.conversationStartedLabel') ||
          'Conversation started',
        language: navigator.language,
      });

      // Get the primary color RGB value from CSS variable
      let primaryColorRgb: string | undefined;
      try {
        const rootElement =
          document.querySelector('.memori-widget') ||
          document.querySelector('memori-client') ||
          document.documentElement;
        const computedStyle = getComputedStyle(rootElement);
        primaryColorRgb = computedStyle.getPropertyValue('--memori-primary-rgb').trim();
        // If empty, try to get it from :root
        if (!primaryColorRgb) {
          primaryColorRgb = getComputedStyle(document.documentElement)
            .getPropertyValue('--memori-primary-rgb')
            .trim();
        }
      } catch (error) {
        console.warn('Could not read --memori-primary-rgb CSS variable:', error);
      }

      const pdfOptions: ChatPDFOptions = {
        fontSize: '12pt',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#fff',
        primaryColorRgb: primaryColorRgb || undefined,
      };

      // Create the full HTML document with structure like artifacts
      const htmlDocument = createChatPDFDocument(
        htmlContent,
        pdfTitle,
        pdfOptions
      );

      // Create print window and export PDF directly (not through pdfExporter which expects markdown)
      const printWindow = window.open(
        '',
        '_blank',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );
      if (!printWindow) {
        throw new Error('Popup blocked! Please enable popups to export PDF.');
      }

      printWindow.document.write(htmlDocument);
      printWindow.document.close();
      printWindow.document.title = pdfTitle;

      // Wait for content to load, then trigger print
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.focus();
          printWindow.print();

          // Close window after print dialog closes
          setTimeout(() => {
            if (printWindow && !printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        }
      }, 500);

      toast.success(
        t('exportChatHistory.success') || 'Chat exported to PDF successfully'
      );
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(
        t('exportChatHistory.error') ||
          'Failed to export chat to PDF. Please try again.'
      );
    } finally {
      setIsExportingPDF(false);
    }
  };

  const sharedUrl = useMemo(() => {
    if (!memori || !sessionID) return undefined;

    if (memori.ownerUserID) {
      return `${baseUrl ?? 'https://www.aisuru.com'}/${
        i18n.language === 'it' ? 'it' : 'en'
      }/shared/${memori.ownerUserID}/${memori.memoriID}/${sessionID}`;
    }

    if (memori.exposed) {
      return `${baseUrl ?? 'https://www.aisuru.com'}/${
        i18n.language === 'it' ? 'it' : 'en'
      }/shared/${memori.ownerUserName}/${memori.name}/${sessionID}`;
    }

    return undefined;
  }, [memori, sessionID, baseUrl, i18n.language]);

  return (
    <Dropdown
      className={cx('memori-share-button', {
        'memori-share-button--align-left': align === 'left',
      })}
    >
      <Dropdown.Trigger
        showChevron={false}
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          className,
          {
            'memori-button--primary': primary,
          }
        )}
        title={t('widget.share') || undefined}
      >
        <div className="memori-button--icon">
          <Share />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className="memori-share-button--overlay">
        <ul>
        {memori && sessionID && sharedUrl && (
          <li key="shared" className="memori-share-button--li memori-share-button--li-shared">
            <Dropdown.Item
              className={cx(
                'memori-button',
                'memori-button--with-icon',
                'memori-button--ghost',
                'memori-button--padded',
                'memori-share-button--link'
              )}
            >
              <a
                href={sharedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  'memori-button',
                  'memori-button--with-icon',
                  'memori-button--ghost',
                  'memori-button--padded',
                  'memori-share-button--link'
                )}
              >
                <div className="memori-button--icon">
                  <Share />
                </div>
                {t('widget.shareChat') || 'Share chat'}
              </a>
            </Dropdown.Item>
          </li>
        )}
        {history && history.length > 0 && (
          <li key="export-pdf" className="memori-share-button--li">
            <Dropdown.Item className="memori-share-button--link">
              <Button
                variant="ghost"
                icon={<FilePdf />}
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="memori-share-button--link"
              >
                {isExportingPDF
                  ? t('exportChatHistory.exporting') || 'Exporting...'
                  : t('exportChatHistory.exportPDF') || 'Export chat as PDF'}
              </Button>
            </Dropdown.Item>
          </li>
        )}
        <li key="copy" className="memori-share-button--li">
          <Dropdown.Item
            className="memori-share-button--link"
            onClick={() => {
              targetUrl && navigator.clipboard.writeText(targetUrl);
            }}
          >
            <Button
              variant="ghost"
              icon={<Link />}
              className="memori-share-button--link"
            >
              {t('copyToClipboard') || undefined}
            </Button>
          </Dropdown.Item>
        </li>
        {socialShare.map(item => (
          <li key={item.id} className="memori-share-button--li">
            <Dropdown.Item
              className={cx(
                'memori-button',
                'memori-button--with-icon',
                'memori-button--ghost',
                'memori-button--padded',
                'memori-share-button--link'
              )}
            >
              <a
                href={item.url ?? ''}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  'memori-button',
                  'memori-button--with-icon',
                  'memori-button--ghost',
                  'memori-button--padded',
                  'memori-share-button--link'
                )}
              >
                <div className="memori-button--icon">
                  <item.icon />
                </div>
                {item.title}
              </a>
            </Dropdown.Item>
          </li>
        ))}
        {showQrCode && (
          <li key="qrcode" className="memori-share-button--li-qr-code">
            <QRCodeCanvas
              id="qr-canvas"
              value={targetUrl ?? ''}
              size={128}
              bgColor={'#ffffff'}
              fgColor={'#000000'}
              level={'H'}
              includeMargin={false}
              imageSettings={{
                src: qrImageURL,
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
            <div>
              <Button
                onClick={downloadQRCode}
                icon={<Download />}
                title="Download QR"
              >
                Download
              </Button>
            </div>
          </li>
        )}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ShareButton;
