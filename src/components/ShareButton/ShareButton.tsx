import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Share2,
  Mail,
  Link as LinkIcon,
  Download,
  Send,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button, Dropdown } from '@memori.ai/ui';
import cx from 'classnames';
import {
  Tenant,
  Memori,
  Message,
} from '@memori.ai/memori-api-client/dist/types';
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
  baseUrl,
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
      icon: Share2,
    },
    {
      id: 'twitter',
      title: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${targetUrl}`,
      icon: Share2,
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&title=${title}&url=${targetUrl}`,
      icon: Share2,
    },
    {
      id: 'whatsapp',
      title: 'Whatsapp',
      url: `https://api.whatsapp.com/send?phone=&text=${targetUrl}`,
      icon: MessageCircle,
    },
    {
      id: 'telegram',
      title: 'Telegram',
      url: `https://t.me/share/url?text=${title}&url=${targetUrl}`,
      icon: Send,
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
        primaryColorRgb = computedStyle
          .getPropertyValue('--memori-primary-rgb')
          .trim();
        // If empty, try to get it from :root
        if (!primaryColorRgb) {
          primaryColorRgb = getComputedStyle(document.documentElement)
            .getPropertyValue('--memori-primary-rgb')
            .trim();
        }
      } catch (error) {
        console.warn(
          'Could not read --memori-primary-rgb CSS variable:',
          error
        );
      }

      const pdfOptions: ChatPDFOptions = {
        fontSize: '12pt',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6',
        color: 'var(--memori-text-color)',
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
        className="memori-share-button--trigger"
        title={t('widget.share') || undefined}
        render={(props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
          <Button
            {...props}
            variant="primary"
            icon={<Share2 />}
            title={t('widget.share') || undefined}
          />
        )}
      />
      <Dropdown.Menu className="memori-share-button--dropdown-menu">
        {memori && sessionID && sharedUrl && (
          <Dropdown.Item
            key="shared"
            onClick={() => window.open(sharedUrl, '_blank')}
            {...({ icon: <Share2 /> } as React.ComponentProps<typeof Dropdown.Item>)}
          >
            <span className="memori-share-button--dropdown-item-content">
              {t('widget.shareChat') || 'Share chat'}
            </span>
          </Dropdown.Item>
        )}
        {history && history.length > 0 && (
          <Dropdown.Item
            key="export-pdf"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            {...({ icon: <FileText /> } as React.ComponentProps<typeof Dropdown.Item>)}
          >
            <span className="memori-share-button--dropdown-item-content">
              {isExportingPDF
                ? t('exportChatHistory.exporting') || 'Exporting...'
                : t('exportChatHistory.exportPDF') || 'Export chat as PDF'}
            </span>
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onClick={() => {
            targetUrl && navigator.clipboard.writeText(targetUrl);
          }}
          {...({ icon: <LinkIcon /> } as React.ComponentProps<typeof Dropdown.Item>)}
        >
          <span className="memori-share-button--dropdown-item-content">
            {t('copyToClipboard') || undefined}
          </span>
        </Dropdown.Item>
        {socialShare.map(item => {
          const IconComponent = item.icon;
          return (
            <Dropdown.Item
              key={item.id}
              {...({ icon: <IconComponent /> } as React.ComponentProps<typeof Dropdown.Item>)}
            >
              <span className="memori-share-button--dropdown-item-content">
                {item.title}
              </span>
            </Dropdown.Item>
          );
        })}
        {showQrCode && (
          <Dropdown.Item>
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
              <span
                className="memori-share-button--dropdown-item-content"
                onClick={downloadQRCode}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: 8,
                }}
                role="button"
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === 'Enter' || e.key === ' ') downloadQRCode();
                }}
              >
                <Download style={{ marginRight: 8 }} />
                Download
              </span>
            </div>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ShareButton;
