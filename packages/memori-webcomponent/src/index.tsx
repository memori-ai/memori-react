import ReactDOM from 'react-dom';
import type { Integration } from '@memori.ai/memori-api-client/dist/types';
import Memori from '@memori.ai/memori-react';

const parseJSONsafe = <T = { [key: string]: any },>(json: string): T | null => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return null;
  }
};

const fillParent = (el: HTMLElement, height = '100%') => {
  el.style.display = 'block';
  el.style.width = '100%';
  el.style.height = height;
  el.style.minHeight = '0';
};

const shouldSizeHost = (host: HTMLElement) =>
  host.hasAttribute('height') || host.getAttribute('layout') === 'CHAT';

class MemoriWebComponent extends HTMLElement {
  connectedCallback() {
    const wrapper = document.createElement('div');
    const mountPoint = document.createElement('div');
    mountPoint.setAttribute('id', 'memori-root');

    // Custom elements default to display:inline. A block child with height:100%
    // then percentages against the slot, not the host — which turns FAB/sidebar
    // into a spacer. Make this a block container first; only assign height for
    // CHAT (slot-fill) or an explicit `height` attribute. Never default to 100vh.
    this.style.display = 'block';
    fillParent(wrapper);
    fillParent(mountPoint);
    if (shouldSizeHost(this)) {
      fillParent(this, this.getAttribute('height') || '100%');
    }

    wrapper.appendChild(mountPoint);
    this.appendChild(wrapper);

    const props = Object.keys(
      Memori.propTypes as { [key: string]: any }
    ).reduce<{ [key: string]: any }>((acc, key) => {
      if (this.hasAttribute(key)) {
        acc[key] = this.getAttribute(key);

        if (acc[key] === 'true' || acc[key] === 'false') {
          acc[key] = acc[key] === 'true';
        }
      }
      return acc;
    }, {});
    const tenantID = this.getAttribute('tenantId');
    const context = this.getAttribute('context');
    const parsedContext = context?.split(',')?.reduce((acc, cur) => {
      const [key, value] = cur.split(':').map(t => t.trim());
      return { ...acc, [key]: value };
    }, {});
    const additionalInfo =
      parseJSONsafe(this.getAttribute('additionalInfo') || '{}') || {};
    const integration = this.getAttribute('integration');
    const parsedIntegration = integration
      ? parseJSONsafe<Integration>(integration) || undefined
      : undefined;

    let apiURL = this.getAttribute('apiURL') || undefined;
    if (apiURL && new URL(apiURL).hostname === 'backend.memori.ai') {
      apiURL = 'https://backend-proxy.aisuru.com';
    }

    if (tenantID) {
      ReactDOM.render(
        <Memori
          {...props}
          apiURL={apiURL}
          context={parsedContext}
          tenantID={tenantID}
          additionalInfo={additionalInfo}
          integration={parsedIntegration}
          __WEBCOMPONENT__={true}
        />,
        mountPoint
      );
    } else {
      console.error('No tenantId attribute found');
    }
  }
}

customElements.define('memori-client', MemoriWebComponent);
