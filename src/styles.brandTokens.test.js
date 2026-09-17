/* eslint-env node */
const fs = require('fs');
const path = require('path');

/**
 * Embeds set `--memori-primary-color` on `.memori-widget`, not always on `:root`.
 * CSS custom properties resolve `var()` when the custom property itself is
 * computed, so derived tokens defined only on `:root` stay frozen to the
 * default brand. Disabled / soft / subtle UI uses those derived tokens
 * (`--memori-primary-disabled`, etc.), so the host must rebind them on the
 * same scopes as `--memori-primary`.
 */
describe('brand token cascade (styles.css)', () => {
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

  const overridesBlocks = [
    ...css.matchAll(/@layer\s+memori\.overrides\s*\{([\s\S]*?)\n\}/g),
  ].map(match => match[1]);

  it('rebinds primary-derived tokens next to --memori-primary on host scopes', () => {
    const lightBlock = overridesBlocks.find(
      block =>
        block.includes('.memori-widget') &&
        block.includes('--memori-primary:') &&
        !block.includes("data-theme='dark'")
    );

    expect(lightBlock).toBeDefined();
    expect(lightBlock).toMatch(/--memori-primary-disabled\s*:/);
    expect(lightBlock).toMatch(/--memori-primary-hover\s*:/);
    expect(lightBlock).toMatch(/--memori-primary-subtle\s*:/);
    expect(lightBlock).toMatch(/--memori-border-primary\s*:/);
    expect(lightBlock).toMatch(
      /--memori-primary-disabled\s*:\s*color-mix\(in oklch,\s*var\(--memori-primary\)/
    );
  });

  it('rebinds dark primary-derived tokens on dark host scopes', () => {
    const darkBlock = overridesBlocks.find(
      block =>
        block.includes("data-theme='dark'") &&
        block.includes('.memori-widget')
    );

    expect(darkBlock).toBeDefined();
    expect(darkBlock).toMatch(/--memori-primary-disabled\s*:/);
    expect(darkBlock).toMatch(/--memori-primary-hover\s*:/);
    expect(darkBlock).toMatch(
      /--memori-primary-disabled\s*:\s*color-mix\(in oklch,\s*var\(--memori-primary\)/
    );
  });
});
