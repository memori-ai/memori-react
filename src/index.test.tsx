import React from 'react';
import { render } from '@testing-library/react';
import { memori, tenant, integration } from './mocks/data';
import Memori from './index';

// Mock window.location
const mockLocation = {
  hostname: 'localhost',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

it('renders client', () => {
  const { container } = render(
    <Memori
      memoriID={memori.memoriID}
      ownerUserID={memori.ownerUserID}
      tenantID={tenant.tenantID}
      integration={{
        ...integration,
        customData: JSON.stringify({}),
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders client with whiteListedDomains on allowed domains', () => {
  mockLocation.hostname = 'memori.ai';
  const { container } = render(
    <Memori
      memoriID={memori.memoriID}
      ownerUserID={memori.ownerUserID}
      tenantID={tenant.tenantID}
      integration={{
        ...integration,
        customData: JSON.stringify({
          whiteListedDomains: ['localhost', 'memori.ai'],
        }),
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

it('renders client with whiteListedDomains on not allowed domains', () => {
  mockLocation.hostname = 'aisuru.com';
  const { container } = render(
    <Memori
      memoriID={memori.memoriID}
      ownerUserID={memori.ownerUserID}
      tenantID={tenant.tenantID}
      integration={{
        ...integration,
        customData: JSON.stringify({
          whiteListedDomains: ['localhost', 'memori.ai'],
        }),
      }}
    />
  );
  expect(container).toMatchSnapshot();
});
