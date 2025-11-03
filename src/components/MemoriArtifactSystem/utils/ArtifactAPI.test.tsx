import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ArtifactProvider } from '../context/ArtifactContext';
import { ArtifactAPIBridge } from './ArtifactAPI';
import { ArtifactData } from '../types/artifact.types';
import MemoriWidget from '../../MemoriWidget/MemoriWidget';
import { Memori } from '@memori.ai/memori-api-client/dist/types';
import { VisemeProvider } from '../../../context/visemeContext';

const mockMemori: Memori = {
  memoriID: 'test-memori-id',
  name: 'Test Memori',
  culture: 'en-US',
  coverURL: '',
  enableBoardOfExperts: false,
} as Memori;

// Helper function to wrap component with all required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <VisemeProvider>
      <ArtifactProvider>
        {component}
      </ArtifactProvider>
    </VisemeProvider>
  );
};

describe('ArtifactAPIBridge', () => {
  beforeEach(() => {
    // Clean up any previous API instance
    if (window.MemoriArtifactAPI) {
      delete window.MemoriArtifactAPI;
    }

    // Mock window.matchMedia
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
  });

  afterEach(() => {
    // Clean up after each test
    if (window.MemoriArtifactAPI) {
      delete window.MemoriArtifactAPI;
    }
  });

  it('should expose MemoriArtifactAPI on window', () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    expect(window.MemoriArtifactAPI).toBeDefined();
    expect(typeof window.MemoriArtifactAPI?.createAndOpenArtifact).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.openArtifact).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.closeArtifact).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.toggleFullscreen).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.getState).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.createFromOutputElement).toBe('function');
  });

  it('should create and open artifact with simple parameters', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    const testContent = '<h1>Test Content</h1><p>This is a test</p>';
    const testTitle = 'Test Artifact';

    window.MemoriArtifactAPI!.createAndOpenArtifact(
      testContent,
      'html',
      testTitle
    );

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isDrawerOpen).toBe(true);
      expect(state.currentArtifact?.title).toBe(testTitle);
      expect(state.currentArtifact?.content).toBe(testContent);
      expect(state.currentArtifact?.mimeType).toBe('html');
    });
  });

  it('should generate default title from mime type when not provided', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    window.MemoriArtifactAPI!.createAndOpenArtifact(
      'console.log("test")',
      'javascript'
    );

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.currentArtifact?.title).toBe('JavaScript Code');
    });
  });

  it('should open artifact with full ArtifactData object', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    const artifact: ArtifactData = {
      id: 'test-artifact-123',
      content: '<div>Full artifact</div>',
      mimeType: 'html',
      title: 'Full Artifact Test',
      timestamp: new Date(),
      size: 100,
    };

    window.MemoriArtifactAPI!.openArtifact(artifact);

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isDrawerOpen).toBe(true);
      expect(state.currentArtifact?.id).toBe('test-artifact-123');
      expect(state.currentArtifact?.title).toBe('Full Artifact Test');
    });
  });

  it('should close artifact', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    // First open an artifact
    window.MemoriArtifactAPI!.createAndOpenArtifact(
      '<h1>Test</h1>',
      'html',
      'Test'
    );

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isDrawerOpen).toBe(true);
    });

    // Then close it
    window.MemoriArtifactAPI!.closeArtifact();

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isDrawerOpen).toBe(false);
      expect(state.currentArtifact).toBeNull();
    });
  });

  it('should toggle fullscreen', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    // Open an artifact first
    window.MemoriArtifactAPI!.createAndOpenArtifact(
      '<h1>Test</h1>',
      'html',
      'Test'
    );

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isFullscreen).toBe(false);
    });

    // Toggle fullscreen
    window.MemoriArtifactAPI!.toggleFullscreen();

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isFullscreen).toBe(true);
    });

    // Toggle back
    window.MemoriArtifactAPI!.toggleFullscreen();

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isFullscreen).toBe(false);
    });
  });

  it('should create artifact from output element', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    // Create a mock output element
    const outputElement = document.createElement('output');
    outputElement.className = 'memori-artifact';
    outputElement.innerHTML = '<div>Content from output</div>';
    outputElement.setAttribute('data-mimetype', 'html');
    outputElement.setAttribute('data-title', 'Output Artifact');
    document.body.appendChild(outputElement);

    const artifactId = window.MemoriArtifactAPI!.createFromOutputElement(outputElement);

    expect(artifactId).toBeDefined();
    expect(outputElement.style.display).toBe('none');
    expect(outputElement.getAttribute('data-memori-processed')).toBe('true');

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      expect(state.isDrawerOpen).toBe(true);
      expect(state.currentArtifact?.content).toBe('<div>Content from output</div>');
      expect(state.currentArtifact?.title).toBe('Output Artifact');
    });

    // Clean up
    document.body.removeChild(outputElement);
  });

  it('should handle multiple artifacts in the same message', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    // Create a message with multiple output elements
    const messageContent = `
      <output class="memori-artifact" data-mimetype="html" data-title="Artifact 1">
        <div>Content 1</div>
      </output>
      <output class="memori-artifact" data-mimetype="javascript" data-title="Artifact 2">
        console.log("test");
      </output>
    `;

    window.MemoriArtifactAPI!.createAndOpenArtifact(messageContent, 'html');

    await waitFor(() => {
      const state = window.MemoriArtifactAPI!.getState();
      // The first artifact should be opened
      expect(state.isDrawerOpen).toBe(true);
      expect(state.currentArtifact).toBeDefined();
    });
  });

  it('should return initial state correctly', () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    const state = window.MemoriArtifactAPI!.getState();

    expect(state.currentArtifact).toBeNull();
    expect(state.isDrawerOpen).toBe(false);
    expect(state.isFullscreen).toBe(false);
  });

  it('should clean up API on unmount', () => {
    const { unmount } = renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    expect(window.MemoriArtifactAPI).toBeDefined();

    unmount();

    expect(window.MemoriArtifactAPI).toBeUndefined();
  });

  it('should handle different mime types with correct titles', async () => {
    renderWithProviders(
      <MemoriWidget memori={mockMemori} tenantID="test-tenant-id" />
    );

    const testCases = [
      { mimeType: 'html', expectedTitle: 'HTML Document' },
      { mimeType: 'markdown', expectedTitle: 'Markdown Document' },
      { mimeType: 'javascript', expectedTitle: 'JavaScript Code' },
      { mimeType: 'python', expectedTitle: 'Python Code' },
      { mimeType: 'json', expectedTitle: 'JSON Data' },
      { mimeType: 'css', expectedTitle: 'CSS Stylesheet' },
      { mimeType: 'typescript', expectedTitle: 'TypeScript Code' },
      { mimeType: 'xml', expectedTitle: 'XML Document' },
      { mimeType: 'svg', expectedTitle: 'SVG Image' },
      { mimeType: 'unknown', expectedTitle: 'Document' },
    ];

    for (const testCase of testCases) {
      window.MemoriArtifactAPI!.createAndOpenArtifact(
        'test content',
        testCase.mimeType
      );

      await waitFor(() => {
        const state = window.MemoriArtifactAPI!.getState();
        expect(state.currentArtifact?.title).toBe(testCase.expectedTitle);
      });
    }
  });
});

