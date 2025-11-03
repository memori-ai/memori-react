import { render, screen, waitFor } from '@testing-library/react';
import { ArtifactProvider } from '../context/ArtifactContext';
import { ArtifactAPIBridge } from './ArtifactAPI';
import { ArtifactData } from '../types/artifact.types';

describe('ArtifactAPIBridge', () => {
  beforeEach(() => {
    // Clean up any previous API instance
    if (window.MemoriArtifactAPI) {
      delete window.MemoriArtifactAPI;
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (window.MemoriArtifactAPI) {
      delete window.MemoriArtifactAPI;
    }
  });

  it('should expose MemoriArtifactAPI on window', () => {
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
    );

    expect(window.MemoriArtifactAPI).toBeDefined();
    expect(typeof window.MemoriArtifactAPI?.createAndOpenArtifact).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.openArtifact).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.closeArtifact).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.toggleFullscreen).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.getState).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.createFromOutputElement).toBe('function');
    expect(typeof window.MemoriArtifactAPI?.processAllArtifacts).toBe('function');
  });

  it('should create and open artifact with simple parameters', async () => {
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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

  it('should process all artifacts in the DOM', () => {
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
    );

    // Create multiple output elements
    const output1 = document.createElement('output');
    output1.className = 'memori-artifact';
    output1.innerHTML = '<div>Artifact 1</div>';
    output1.setAttribute('data-mimetype', 'html');
    
    const output2 = document.createElement('output');
    output2.className = 'memori-artifact';
    output2.innerHTML = '<div>Artifact 2</div>';
    output2.setAttribute('data-mimetype', 'html');
    
    const container = document.createElement('div');
    container.appendChild(output1);
    container.appendChild(output2);
    document.body.appendChild(container);

    const processedIds = window.MemoriArtifactAPI!.processAllArtifacts(container);

    expect(processedIds.length).toBe(2);
    expect(output1.getAttribute('data-memori-processed')).toBe('true');
    expect(output2.getAttribute('data-memori-processed')).toBe('true');
    expect(output1.style.display).toBe('none');
    expect(output2.style.display).toBe('none');

    // Check that handlers were created
    const handlers = container.querySelectorAll('.memori-artifact-handler');
    expect(handlers.length).toBe(2);

    // Clean up
    document.body.removeChild(container);
  });

  it('should not reprocess already processed artifacts', () => {
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
    );

    const output = document.createElement('output');
    output.className = 'memori-artifact';
    output.innerHTML = '<div>Artifact</div>';
    output.setAttribute('data-mimetype', 'html');
    output.setAttribute('data-memori-processed', 'true'); // Already processed
    
    const container = document.createElement('div');
    container.appendChild(output);
    document.body.appendChild(container);

    const processedIds = window.MemoriArtifactAPI!.processAllArtifacts(container);

    expect(processedIds.length).toBe(0);

    // Clean up
    document.body.removeChild(container);
  });

  it('should return initial state correctly', () => {
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
    );

    const state = window.MemoriArtifactAPI!.getState();

    expect(state.currentArtifact).toBeNull();
    expect(state.isDrawerOpen).toBe(false);
    expect(state.isFullscreen).toBe(false);
  });

  it('should clean up API on unmount', () => {
    const { unmount } = render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
    );

    expect(window.MemoriArtifactAPI).toBeDefined();

    unmount();

    expect(window.MemoriArtifactAPI).toBeUndefined();
  });

  it('should handle different mime types with correct titles', async () => {
    render(
      <ArtifactProvider>
        <ArtifactAPIBridge />
      </ArtifactProvider>
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

