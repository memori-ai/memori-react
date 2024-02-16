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
import { QRCodeCanvas } from 'qrcode.react';
import { Menu } from '@headlessui/react';
import Button from '../ui/Button';
import cx from 'classnames';
import { Tenant } from '@memori.ai/memori-api-client/dist/types';

export interface Props {
  tenant?: Tenant;
  url?: string;
  title?: string;
  className?: string;
  primary?: boolean;
  baseUrl?: string;
  showQrCode?: boolean;
  align?: 'left' | 'right';
}

const ShareButton: React.FC<Props> = ({
  tenant,
  url,
  title = '',
  className,
  baseUrl,
  primary = true,
  showQrCode = true,
  align = 'right',
}: Props) => {
  const { t } = useTranslation();
  const [targetUrl, setTargetUrl] = useState(url);

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
