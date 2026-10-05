import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FlowWidget,
  flowArgTypes,
  flowBase,
  renderFlow,
} from '../components/layouts/flows/FlowWidget';
import { withWidgetProviders } from '../../.storybook/decorators';

/**
 * WEBSITE_ASSISTANT rendered on top of real host pages, to check stacking
 * (z-index) and CSS conflicts against production sites.
 *
 * The host HTML is fetched through the dev-only `/__host-page` proxy in
 * `.storybook/middleware.js` and injected in the same document as the widget
 * (an iframe could never overlap the widget). Host scripts are not executed,
 * so JS-driven parts (sliders, cookie banners) stay static.
 * Only works with `yarn storybook`, not in a static build.
 */

type HostPageProps = {
  url: string;
  children?: React.ReactNode;
};

const absolutize = (value: string, base: string) => {
  try {
    return new URL(value, base).href;
  } catch {
    return value;
  }
};

const absolutizeSrcset = (value: string, base: string) =>
  value
    .split(',')
    .map(candidate => {
      const [src, ...descriptor] = candidate.trim().split(/\s+/);
      return [absolutize(src, base), ...descriptor].join(' ');
    })
    .join(', ');

const absolutizeCssUrls = (css: string, base: string) =>
  css.replace(
    /url\((['"]?)(?!data:|https?:|\/\/)([^'")]+)\1\)/g,
    (_match, quote, path) => `url(${quote}${absolutize(path, base)}${quote})`
  );

const HostPage = ({ url, children }: HostPageProps) => {
  const [bodyHtml, setBodyHtml] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    const injected: Element[] = [];
    const previousBodyClass = document.body.className;
    const previousHtmlClass = document.documentElement.className;

    fetch(`/__host-page?url=${encodeURIComponent(url)}`)
      .then(async res => {
        const html = await res.text();
        if (!res.ok) throw new Error(`${res.status}: ${html}`);
        return {
          html,
          finalUrl: res.headers.get('X-Host-Page-Final-Url') || url,
        };
      })
      .then(({ html, finalUrl }) => {
        if (cancelled) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');

        doc
          .querySelectorAll('script, noscript, iframe')
          .forEach(el => el.remove());
        doc
          .querySelectorAll('[href]')
          .forEach(el =>
            el.setAttribute(
              'href',
              absolutize(el.getAttribute('href')!, finalUrl)
            )
          );
        doc
          .querySelectorAll('[src]')
          .forEach(el =>
            el.setAttribute(
              'src',
              absolutize(el.getAttribute('src')!, finalUrl)
            )
          );
        doc
          .querySelectorAll('[srcset]')
          .forEach(el =>
            el.setAttribute(
              'srcset',
              absolutizeSrcset(el.getAttribute('srcset')!, finalUrl)
            )
          );
        doc
          .querySelectorAll('[data-src]')
          .forEach(el =>
            el.setAttribute(
              'src',
              absolutize(el.getAttribute('data-src')!, finalUrl)
            )
          );
        doc
          .querySelectorAll('[style]')
          .forEach(el =>
            el.setAttribute(
              'style',
              absolutizeCssUrls(el.getAttribute('style')!, finalUrl)
            )
          );

        doc.querySelectorAll('link[rel~="stylesheet"], style').forEach(el => {
          const node = el.cloneNode(true) as Element;
          if (node.tagName === 'STYLE') {
            node.textContent = absolutizeCssUrls(
              node.textContent || '',
              finalUrl
            );
          }
          node.setAttribute('data-host-page', url);
          document.head.appendChild(node);
          injected.push(node);
        });

        document.body.className = `${previousBodyClass} ${doc.body.className}`;
        document.documentElement.className = `${previousHtmlClass} ${doc.documentElement.className}`;
        setBodyHtml(doc.body.innerHTML);
      })
      .catch(err => !cancelled && setError(String(err)));

    return () => {
      cancelled = true;
      injected.forEach(el => el.remove());
      document.body.className = previousBodyClass;
      document.documentElement.className = previousHtmlClass;
    };
  }, [url]);

  if (error) {
    return (
      <p style={{ padding: 24, fontFamily: 'sans-serif' }}>
        Impossibile caricare {url}: {error}
      </p>
    );
  }

  return (
    <>
      {bodyHtml !== undefined && (
        <div
          className="storybook-host-page"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}
      {bodyHtml !== undefined && children}
    </>
  );
};

const meta = {
  title: 'Live/HostSites',
  component: FlowWidget,
  decorators: [withWidgetProviders],
  argTypes: flowArgTypes,
  parameters: {
    controls: { expanded: true },
    layout: 'fullscreen',
  },
  args: {
    ...flowBase,
    layout: 'WEBSITE_ASSISTANT',
    multilingual: true,
  },
  render: (args, context) => (
    <HostPage url={context.parameters.hostUrl}>
      {renderFlow(args, context)}
    </HostPage>
  ),
} satisfies Meta<typeof FlowWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MemoriAi: Story = {
  parameters: { hostUrl: 'https://memori.ai/it' },
};

export const MarconiExpress: Story = {
  parameters: { hostUrl: 'https://www.marconiexpress.it/' },
};

export const ComuneFirenzeServizi: Story = {
  parameters: { hostUrl: 'https://www.comune.firenze.it/servizi' },
};
