import {
  ARTIFACT_CHAT_MIN_WIDTH,
  ARTIFACT_COLUMN_MIN_WIDTH,
  clampArtifactColumnWidth,
  formatArtifactType,
} from './artifactPanel';

describe('formatArtifactType', () => {
  it('maps known mime types to labels', () => {
    expect(formatArtifactType('markdown')).toBe('Markdown');
    expect(formatArtifactType('html')).toBe('HTML');
  });

  it('returns the original value when unknown', () => {
    expect(formatArtifactType('custom')).toBe('custom');
  });
});

describe('clampArtifactColumnWidth', () => {
  it('keeps chat at least 400px in split mode', () => {
    expect(clampArtifactColumnWidth(900, 1200, false)).toBe(
      1200 - ARTIFACT_CHAT_MIN_WIDTH
    );
  });

  it('does not shrink below the column minimum when space allows', () => {
    expect(clampArtifactColumnWidth(200, 1400, false)).toBe(
      ARTIFACT_COLUMN_MIN_WIDTH
    );
  });

  it('lets the overlay use the full container width', () => {
    expect(clampArtifactColumnWidth(900, 800, true)).toBe(800);
  });

  it('shrinks the overlay when the viewport is narrower than the minimum', () => {
    expect(clampArtifactColumnWidth(720, 300, true)).toBe(300);
  });
});
