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
import { Menu } from '@headlessui/react';
import Button from '../ui/Button';
import cx from 'classnames';
import { Tenant, Memori, Message } from '@memori.ai/memori-api-client/dist/types';
import { pdfExporter } from '../MemoriArtifactSystem/components/ArtifactActions/utils/PDFExporter';
import toast from 'react-hot-toast';
import { stripOutputTags, stripReasoningTags, stripHTML } from '../../helpers/utils';

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
   * Format chat history into markdown for PDF export
   */
  const formatChatHistoryForPDF = (messages: Message[]): string => {
    if (!messages || messages.length === 0) {
      return '';
    }

    const memoriName = memori?.name || 'Assistant';
    const conversationTitle = `${memoriName} - Chat Export`;
    const exportDate = new Intl.DateTimeFormat(navigator.language, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());

    let markdown = `# ${conversationTitle}\n\n`;
    markdown += `**${t('write_and_speak.conversationStartedLabel') || 'Conversation started'}**: ${exportDate}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((message, index) => {
      const timestamp = message.timestamp
        ? new Intl.DateTimeFormat(navigator.language, {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(
            new Date(
              message.timestamp.endsWith('Z')
                ? message.timestamp
                : `${message.timestamp}Z`
            )
          )
        : '';

      const sender = message.fromUser ? 'You' : memoriName;
      
      // Clean message text by removing tags (same as when copying)
      let messageText = message.text || '';
      
      // Remove document_attachment tags
      messageText = messageText.replace(
        /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g,
        ''
      );
      
      // For non-user messages, remove output tags, reasoning tags, and HTML tags
      if (!message.fromUser) {
        messageText = stripHTML(stripOutputTags(stripReasoningTags(messageText)));
      } else {
        // For user messages, just remove document_attachment tags (already done above)
        // and remove think tags
        messageText = messageText.replaceAll(/<think.*?>(.*?)<\/think>/gs, '');
      }
      
      // Format message with sender and timestamp
      markdown += `## ${sender}${timestamp ? ` - ${timestamp}` : ''}\n\n`;
      
      // Add message text (preserve markdown if present)
      if (messageText.trim()) {
        markdown += `${messageText}\n\n`;
      }

      // Add media attachments if present
      if (message.media && message.media.length > 0) {
        message.media.forEach(media => {
          if (media.title) {
            markdown += `- [${media.title}](${media.url || '#'})\n`;
          } else if (media.url) {
            markdown += `- ${media.url}\n`;
          }
        });
        markdown += '\n';
      }

      // Add separator between messages (except last)
      if (index < messages.length - 1) {
        markdown += '---\n\n';
      }
    });

    return markdown;
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
      const markdownContent = formatChatHistoryForPDF(history);

      const pdfOptions = {
        title: pdfTitle,
        fontSize: '12pt',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#fff',
      };

      await pdfExporter.exportAsPDF(markdownContent, pdfTitle, pdfOptions);
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
    <Menu
      as="div"
      className={cx('memori-share-button', {
        'memori-share-button--align-left': align === 'left',
      })}
    >
      <Menu.Button
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
      </Menu.Button>
      <Menu.Items className="memori-share-button--overlay" as="ul">
        {memori && sessionID && sharedUrl && (
          <Menu.Item
            key="shared"
            as="li"
            className="memori-share-button--li memori-share-button--li-shared"
          >
            <a
              className={cx(
                'memori-button',
                'memori-button--with-icon',
                'memori-button--ghost',
                'memori-button--padded',
                'memori-share-button--link'
              )}
              href={sharedUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="memori-button--icon">
                <Share />
              </div>
              {t('widget.shareChat') || 'Share chat'}
            </a>
          </Menu.Item>
        )}
        {history && history.length > 0 && (
          <Menu.Item key="export-pdf" as="li" className="memori-share-button--li">
            <Button
              className="memori-share-button--link"
              ghost
              icon={<FilePdf />}
              onClick={handleExportPDF}
              disabled={isExportingPDF}
            >
              {isExportingPDF
                ? t('exportChatHistory.exporting') || 'Exporting...'
                : t('exportChatHistory.exportPDF') || 'Export chat as PDF'}
            </Button>
          </Menu.Item>
        )}
        <Menu.Item key="copy" as="li" className="memori-share-button--li">
          <Button
            className="memori-share-button--link"
            ghost
            icon={<Link />}
            onClick={() => {
              targetUrl && navigator.clipboard.writeText(targetUrl);
            }}
          >
            {t('copyToClipboard') || undefined}
          </Button>
        </Menu.Item>
        {socialShare.map(item => (
          <Menu.Item key={item.id} as="li" className="memori-share-button--li">
            <a
              className={cx(
                'memori-button',
                'memori-button--with-icon',
                'memori-button--ghost',
                'memori-button--padded',
                'memori-share-button--link'
              )}
              href={item.url ?? ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="memori-button--icon">
                <item.icon />
              </div>
              {item.title}
            </a>
          </Menu.Item>
        ))}
        {showQrCode && (
          <Menu.Item
            key="qrcode"
            as="li"
            className="memori-share-button--li-qr-code"
          >
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
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  );
};

export default ShareButton;
