import React from 'react';
import { render } from '@testing-library/react';
import { memori, tenant, integration } from './mocks/data';
import Memori from './index';

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.location
const mockLocation = {
  hostname: 'localhost',
  href: 'http://localhost:3000',
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

it('renders client with all the props', () => {
  const { container } = render(
    <Memori
      memoriID={memori.memoriID}
      ownerUserID={memori.ownerUserID}
      tenantID={tenant.tenantID}
      integration={{
        ...integration,
        customData: JSON.stringify({}),
      }}
      secretToken="1234567890"
      height="100%"
      tag="🌻"
      pin="123456"
      showShare={true}
      showChatHistory={true}
      showCopyButton={true}
      showTranslationOriginal={true}
      showSettings={true}
      showTypingText={true}
      showClear={true}
      showLogin={true}
      showUpload={true}
      showReasoning={true}
      showContextPerLine={true}
      context={{
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+39 333 333 3333',
      }}
      initialQuestion="What is the capital of France?"
      autoStart={true}
      enableAudio={true}
      defaultSpeakerActive={true}
      useMathFormatting={true}
      spokenLang="EL"
      multilingual={true}
      authToken="1234567890"
      onStateChange={() => {}}
      additionalInfo={{}}
      customMediaRenderer={() => <div>Custom Media Renderer</div>}
      additionalSettings={<div>Additional Settings</div>}
      userAvatar="https://memori.ai/avatar.png"
      applyVarsToRoot={true}
      disableTextEnteredEvents={true}
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
