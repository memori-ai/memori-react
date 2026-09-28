import { enhanceBubbleCodeBlocks } from './enhanceBubbleCodeBlocks';

describe('enhanceBubbleCodeBlocks', () => {
  const labels = { copy: 'Copy', copied: 'Copied' };

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('wraps bare pre/code with toolbar, language label, and copy button', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<p>intro</p><pre><code class="language-javascript">const x = 1;</code></pre>';
    document.body.appendChild(root);

    const cleanup = enhanceBubbleCodeBlocks(root, labels);

    const block = root.querySelector('.memori-chat--code-block');
    expect(block).toBeTruthy();
    expect(
      block?.querySelector('.memori-chat--code-block-lang')?.textContent
    ).toBe('javascript');
    expect(
      block?.querySelector('.memori-chat--code-block-copy')?.getAttribute(
        'aria-label'
      )
    ).toBe('Copy');
    expect(block?.querySelector('pre code')?.textContent).toBe('const x = 1;');
    // Does not double-wrap
    enhanceBubbleCodeBlocks(root, labels);
    expect(root.querySelectorAll('.memori-chat--code-block')).toHaveLength(1);

    cleanup();
  });

  it('copies code text on button click', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const root = document.createElement('div');
    root.innerHTML = '<pre><code class="language-js">hello()</code></pre>';
    document.body.appendChild(root);

    enhanceBubbleCodeBlocks(root, labels);
    const btn = root.querySelector(
      '.memori-chat--code-block-copy'
    ) as HTMLButtonElement;
    btn.click();

    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith('hello()');
  });
});
