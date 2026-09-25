export const ARTIFACT_COLUMN_DEFAULT_WIDTH = 720;
export const ARTIFACT_CHAT_MIN_WIDTH = 400;
export const ARTIFACT_COLUMN_MIN_WIDTH = 360;
export const ARTIFACT_OVERLAY_BREAKPOINT = 1200;

const MIME_LABELS: Record<string, string> = {
  html: 'HTML',
  markdown: 'Markdown',
  json: 'JSON',
  css: 'CSS',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  svg: 'SVG',
  xml: 'XML',
  text: 'Text',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  yaml: 'YAML',
  sql: 'SQL',
};

export function formatArtifactType(mimeType: string): string {
  return MIME_LABELS[mimeType.toLowerCase()] || mimeType;
}

export function clampArtifactColumnWidth(
  requestedWidth: number,
  containerWidth: number,
  overlay: boolean
): number {
  const reserved = overlay ? 0 : ARTIFACT_CHAT_MIN_WIDTH;
  const upperBound = Math.max(0, containerWidth - reserved);

  if (upperBound <= ARTIFACT_COLUMN_MIN_WIDTH) {
    return upperBound;
  }

  return Math.min(
    Math.max(requestedWidth, ARTIFACT_COLUMN_MIN_WIDTH),
    upperBound
  );
}
