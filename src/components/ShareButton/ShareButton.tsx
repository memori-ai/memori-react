import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Share2,
  Mail,
  Link as LinkIcon,
  Check,
  Download,
  FileText,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Button,
  Dropdown,
  useAlertManager,
  createAlertOptions,
  Tooltip,
} from '@memori.ai/ui';
import cx from 'classnames';
import {
  Tenant,
  Memori,
  Message,
} from '@memori.ai/memori-api-client/dist/types';
import { pdfExporter } from '../MemoriArtifactSystem/components/ArtifactActions/utils/PDFExporter';
import {
  formatChatHistoryForPDF,
  createChatPDFDocument,
  ChatPDFOptions,
} from '../../helpers/chatPdfExport';
import FacebookIcon from '../../icons/FacebookIcon';
import TwitterIcon from '../../icons/TwitterIcon';
import LinkedinIcon from '../../icons/LinkedinIcon';
import TelegramIcon from '../../icons/TelegramIcon';
import WhatsappIcon from '../../icons/WhatsappIcon';

export interface Props {
  tenant?: Tenant;
  memori?: Memori;
  sessionID?: string;
  url?: string;
  title?: string;
  primary?: boolean;
  className?: string;
  baseUrl?: string;
  showQrCode?: boolean;
  align?: 'left' | 'right';
  history?: Message[];
  triggerMode?: 'icon' | 'menu-item';
  triggerLabel?: string;
  renderMode?: 'dropdown' | 'inline';
}

/** Copy success/error label reset */
const COPY_FEEDBACK_MS = 2500;
/** Brief primary tint on other menu actions (matches copy success tone) */
const MENU_ACTION_FLASH_MS = 900;

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
  className,
  triggerMode = 'icon',
  triggerLabel,
  renderMode = 'dropdown',
}: Props) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const [targetUrl, setTargetUrl] = useState(url);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [menuFlashKey, setMenuFlashKey] = useState<string | null>(null);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const menuFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearCopyReset = () => {
    if (copyResetTimeoutRef.current !== null) {
      clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }
  };

  const clearMenuFlash = () => {
    if (menuFlashTimeoutRef.current !== null) {
      clearTimeout(menuFlashTimeoutRef.current);
      menuFlashTimeoutRef.current = null;
    }
    setMenuFlashKey(null);
  };

  const flashMenuItem = (key: string) => {
    clearMenuFlash();
    setMenuFlashKey(key);
    menuFlashTimeoutRef.current = setTimeout(() => {
      setMenuFlashKey(null);
      menuFlashTimeoutRef.current = null;
    }, MENU_ACTION_FLASH_MS);
  };

  const scheduleCopyReset = () => {
    clearCopyReset();
    copyResetTimeoutRef.current = setTimeout(() => {
      setCopyStatus('idle');
      copyResetTimeoutRef.current = null;
    }, COPY_FEEDBACK_MS);
  };

  const handleShareMenuOpenChange = (open: boolean) => {
    if (!open) {
      clearCopyReset();
      clearMenuFlash();
      setCopyStatus('idle');
    }
  };

  useEffect(
    () => () => {
      clearCopyReset();
      clearMenuFlash();
    },
    []
  );

  const handleCopyLink = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopyStatus('success');
      scheduleCopyReset();
    } catch {
      setCopyStatus('error');
      scheduleCopyReset();
    }
  };

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
      icon: FacebookIcon,
    },
    {
      id: 'twitter',
      title: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${targetUrl}`,
      icon: TwitterIcon,
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&title=${title}&url=${targetUrl}`,
      icon: LinkedinIcon,
    },
    {
      id: 'whatsapp',
      title: 'Whatsapp',
      url: `https://api.whatsapp.com/send?phone=&text=${targetUrl}`,
      icon: WhatsappIcon,
    },
    {
      id: 'telegram',
      title: 'Telegram',
      url: `https://t.me/share/url?text=${title}&url=${targetUrl}`,
      icon: TelegramIcon,
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

  const handleDownloadQR = () => {
    downloadQRCode();
    flashMenuItem('qr-download');
  };

  const openShareTarget = (item: { id: string; url: string }) => {
    if (item.id === 'email') {
      const opened = window.open(item.url, '_self');
      if (!opened) {
        window.location.href = item.url;
      }
      return;
    }
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  /**
   * Export chat history as PDF
   */
  const handleExportPDF = async () => {
    if (!history || history.length === 0) {
      add(
        createAlertOptions({
          description:
            t('exportChatHistory.empty') || 'No chat history to export',
          severity: 'error',
        })
      );
      return;
    }

    if (!pdfExporter.isSupported()) {
      add(
        createAlertOptions({
          description:
            t('exportChatHistory.pdfNotSupported') ||
            'PDF export is not supported in this browser',
          severity: 'error',
        })
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

      add(
        createAlertOptions({
          description:
            t('exportChatHistory.success') ||
            'Chat exported to PDF successfully',
          severity: 'success',
        })
      );
      flashMenuItem('export-pdf');
    } catch (error) {
      console.error('PDF export error:', error);
      add(
        createAlertOptions({
          description:
            t('exportChatHistory.error') ||
            'Failed to export chat to PDF. Please try again.',
          severity: 'error',
        })
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
    ``;

    return undefined;
  }, [memori, sessionID, baseUrl, i18n.language]);

  const shareMenu = (
    <>
      <div className="memori-share-button--dropdown-section">
        {memori && sessionID && sharedUrl && (
          <button
            type="button"
            className={cx('memori-share-button--inline-item', {
              'memori-share-button--menu-item--flash':
                menuFlashKey === 'share-chat',
            })}
            onClick={() => {
              window.open(sharedUrl, '_blank');
              flashMenuItem('share-chat');
            }}
          >
            <Share2 />
            <span>{t('widget.shareChat') || 'Share chat'}</span>
          </button>
        )}
        {history && history.length > 0 && (
          <button
            type="button"
            className={cx('memori-share-button--inline-item', {
              'memori-share-button--menu-item--flash':
                menuFlashKey === 'export-pdf',
            })}
            onClick={handleExportPDF}
            disabled={isExportingPDF}
          >
            <FileText />
            <span>
              {isExportingPDF
                ? t('exportChatHistory.exporting') || 'Exporting...'
                : t('exportChatHistory.exportPDF') || 'Export chat as PDF'}
            </span>
          </button>
        )}
        <button
          type="button"
          className={cx('memori-share-button--inline-item', {
            'memori-share-button--copy-item--success': copyStatus === 'success',
            'memori-share-button--copy-item--error': copyStatus === 'error',
          })}
          onClick={handleCopyLink}
        >
          {copyStatus === 'success' ? (
            <Check strokeWidth={2.5} />
          ) : (
            <LinkIcon />
          )}
          <span>
            {copyStatus === 'success'
              ? t('copied')
              : copyStatus === 'error'
              ? t('copyFailed', { defaultValue: 'Could not copy' })
              : t('copyToClipboard') || undefined}
          </span>
        </button>
      </div>
      <div className="memori-share-button--dropdown-divider" />
      <div className="memori-share-button--dropdown-section">
        {socialShare.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              className={cx('memori-share-button--inline-item', {
                'memori-share-button--menu-item--flash':
                  menuFlashKey === item.id,
              })}
              onClick={() => {
                openShareTarget(item);
                flashMenuItem(item.id);
              }}
            >
              <IconComponent />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
      {showQrCode && (
        <>
          <div className="memori-share-button--dropdown-divider" />
          <div className="memori-share-button--qr-content">
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
            <button
              type="button"
              className="memori-share-button--qr-download"
              onClick={handleDownloadQR}
            >
              <Download aria-hidden />
              <span>
                {t('widget.downloadQrCode') ||
                  t('download', { defaultValue: 'Download' })}
              </span>
            </button>
          </div>
        </>
      )}
    </>
  );

  if (renderMode === 'inline') {
    return (
      <div className={cx('memori-share-button--inline-list', className)}>
        {shareMenu}
      </div>
    );
  }

  return (
    <Dropdown
      onOpenChange={handleShareMenuOpenChange}
      className={cx(
        'memori-share-button',
        {
          'memori-share-button--align-left': align === 'left',
        },
        className
      )}
    >
      <Tooltip content={t('widget.share') || undefined} placement="bottom">
        <Dropdown.Trigger
          showChevron={false}
          className="memori-share-button--trigger"
          render={(props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
            <Button
              {...props}
              variant={triggerMode === 'menu-item' ? 'ghost' : 'ghost'}
              icon={<Share2 />}
              className={cx({
                'memori-share-button--trigger-menu-item':
                  triggerMode === 'menu-item',
              })}
            >
              {triggerMode === 'menu-item'
                ? triggerLabel || t('widget.share')
                : undefined}
            </Button>
          )}
        />
      </Tooltip>
      <Dropdown.Menu className="memori-share-button--dropdown-menu">
        <div className="memori-share-button--dropdown-section">
          {memori && sessionID && sharedUrl && (
            <Dropdown.Item
              key="shared"
              closeOnClick={false}
              className={cx('memori-share-button--menu-item', {
                'memori-share-button--menu-item--flash':
                  menuFlashKey === 'share-chat',
              })}
              onClick={() => {
                window.open(sharedUrl, '_blank');
                flashMenuItem('share-chat');
              }}
              {...({ icon: <Share2 /> } as React.ComponentProps<
                typeof Dropdown.Item
              >)}
            >
              <span className="memori-share-button--dropdown-item-content">
                {t('widget.shareChat') || 'Share chat'}
              </span>
            </Dropdown.Item>
          )}
          {history && history.length > 0 && (
            <Dropdown.Item
              key="export-pdf"
              closeOnClick={false}
              className={cx('memori-share-button--menu-item', {
                'memori-share-button--menu-item--flash':
                  menuFlashKey === 'export-pdf',
              })}
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              {...({ icon: <FileText /> } as React.ComponentProps<
                typeof Dropdown.Item
              >)}
            >
              <span className="memori-share-button--dropdown-item-content">
                {isExportingPDF
                  ? t('exportChatHistory.exporting') || 'Exporting...'
                  : t('exportChatHistory.exportPDF') || 'Export chat as PDF'}
              </span>
            </Dropdown.Item>
          )}
          <Dropdown.Item
            closeOnClick={false}
            className={cx(
              'memori-share-button--menu-item',
              'memori-share-button--copy-item',
              {
                'memori-share-button--copy-item--success':
                  copyStatus === 'success',
                'memori-share-button--copy-item--error': copyStatus === 'error',
              }
            )}
            onClick={handleCopyLink}
            {...({
              icon:
                copyStatus === 'success' ? (
                  <Check
                    className="memori-share-button--copy-icon"
                    aria-hidden
                    strokeWidth={2.5}
                  />
                ) : (
                  <LinkIcon
                    className="memori-share-button--copy-icon"
                    aria-hidden
                  />
                ),
            } as React.ComponentProps<typeof Dropdown.Item>)}
          >
            <span
              className="memori-share-button--dropdown-item-content memori-share-button--copy-label"
              aria-live="polite"
            >
              {copyStatus === 'success'
                ? t('copied')
                : copyStatus === 'error'
                ? t('copyFailed', { defaultValue: 'Could not copy' })
                : t('copyToClipboard') || undefined}
            </span>
          </Dropdown.Item>
        </div>
        <div className="memori-share-button--dropdown-divider" />
        <div className="memori-share-button--dropdown-section">
          {socialShare.map(item => {
            const IconComponent = item.icon;
            return (
              <Dropdown.Item
                key={item.id}
                closeOnClick={false}
                className={cx('memori-share-button--menu-item', {
                  'memori-share-button--menu-item--flash':
                    menuFlashKey === item.id,
                })}
                onClick={() => {
                  openShareTarget(item);
                  flashMenuItem(item.id);
                }}
                {...({ icon: <IconComponent /> } as React.ComponentProps<
                  typeof Dropdown.Item
                >)}
              >
                <span className="memori-share-button--dropdown-item-content">
                  {item.title}
                </span>
              </Dropdown.Item>
            );
          })}
        </div>
        {showQrCode && (
          <>
            <div className="memori-share-button--dropdown-divider" />
            <Dropdown.Item
              closeOnClick={false}
              className={cx(
                'memori-share-button--menu-item',
                'memori-share-button--qr-item',
                {
                  'memori-share-button--menu-item--flash':
                    menuFlashKey === 'qr-download',
                }
              )}
              onClick={handleDownloadQR}
            >
              <div className="memori-share-button--qr-content">
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
                <div
                  role="button"
                  tabIndex={0}
                  className="memori-share-button--qr-download"
                  onClick={event => {
                    event.stopPropagation();
                    handleDownloadQR();
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      handleDownloadQR();
                    }
                  }}
                >
                  <Download aria-hidden />
                  <span>
                    {t('widget.downloadQrCode') ||
                      t('download', { defaultValue: 'Download' })}
                  </span>
                </div>
              </div>
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ShareButton;
