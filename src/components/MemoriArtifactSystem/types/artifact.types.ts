/**
 * Type definitions for the Memori Artifact System
 * Following the project's TypeScript patterns and conventions
 */

import { Message } from "@memori.ai/memori-api-client/dist/types";

export type ArtifactMimeType = 
  | 'html'
  | 'json'
  | 'markdown'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'svg'
  | 'xml'
  | 'text'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'yaml'
  | 'sql';

export interface ArtifactTypeInfo {
  name: string;
  icon: string;
  hasPreview: boolean;
  language: string;
  mimeType: string;
}

export interface ArtifactData {
  id: string;
  content: string;
  mimeType: ArtifactMimeType;
  typeInfo: ArtifactTypeInfo;
  title: string;
  customTitle?: string;
  messageID: string;
  timestamp: Date;
  size: number;
}

export interface ArtifactHistoryEntry extends ArtifactData {
  isActive?: boolean;
}


export interface ArtifactActionsProps {
  artifact: ArtifactData;
  onCopy: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onOpenExternal: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  loading?: boolean;
}

export interface ArtifactPreviewProps {
  artifact: ArtifactData;
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
  showLineNumbers?: boolean;
  enableSyntaxHighlighting?: boolean;
}

export interface ArtifactHistoryProps {
  history: ArtifactHistoryEntry[];
  onSelectArtifact: (artifact: ArtifactData) => void;
  onClearHistory?: () => void;
  maxItems?: number;
}

export interface ArtifactHandlerProps {
  artifact?: ArtifactData | null;
  artifacts?: ArtifactHistoryEntry[];
  content?: string;
  mimeType?: ArtifactMimeType;
  config: ArtifactSystemConfig;
  actions: ArtifactSystemActions;
  message: Message;
  customTitle?: string;
  onArtifactCreated?: (artifact: ArtifactData) => void;
}

export interface ArtifactSystemConfig {
  maxHistoryItems?: number;
  enableSyntaxHighlighting?: boolean;
  showLineNumbers?: boolean;
  autoOpenArtifacts?: boolean;
  supportedMimeTypes?: Partial<Record<ArtifactMimeType, ArtifactTypeInfo>>;
}

export interface ArtifactSystemState {
  history: ArtifactHistoryEntry[];
  currentArtifact: ArtifactData | null;
  isDrawerOpen: boolean;
  isFullscreen: boolean;
  processedArtifacts: Set<string>;
  artifactCounter: number;
}

export interface ArtifactSystemActions {
  addArtifact: (artifact: ArtifactData) => void;
  selectArtifact: (artifact: ArtifactData) => void;
  closeDrawer: () => void;
  toggleFullscreen: () => void;
  clearHistory: () => void;
  removeArtifact: (id: string) => void;
}

export interface ArtifactSystemHook {
  state: ArtifactSystemState;
  actions: ArtifactSystemActions;
  config: ArtifactSystemConfig;
}

// Event types for artifact system
export interface ArtifactEvent {
  type: 'artifact-created' | 'artifact-selected' | 'artifact-closed' | 'history-cleared';
  payload: any;
}

export interface MemoriNewDialogStateEvent extends CustomEvent {
  detail: {
    emission?: string;
  };
}

// Utility types
export type ArtifactTab = 'code' | 'preview';

export interface ArtifactValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ArtifactProcessingOptions {
  removeThinkTags?: boolean;
  validateContent?: boolean;
  deduplicate?: boolean;
  minContentLength?: number;
}

// Constants
export const DEFAULT_ARTIFACT_CONFIG: ArtifactSystemConfig = {
  maxHistoryItems: 50,
  enableSyntaxHighlighting: true,
  showLineNumbers: false,
  autoOpenArtifacts: true,
};

export const SUPPORTED_MIME_TYPES: Record<ArtifactMimeType, ArtifactTypeInfo> = {
  html: { name: 'HTML', icon: '🌐', hasPreview: true, language: 'html', mimeType: 'application/xml' },
  json: { name: 'JSON', icon: '📊', hasPreview: false, language: 'json', mimeType: 'application/json' },
  markdown: { name: 'Markdown', icon: '📝', hasPreview: true, language: 'markdown', mimeType: 'text/markdown' },
  css: { name: 'CSS', icon: '🎨', hasPreview: true, language: 'css', mimeType: 'text/css' },
  javascript: { name: 'JavaScript', icon: '⚡', hasPreview: false, language: 'javascript', mimeType: 'text/javascript' },
  typescript: { name: 'TypeScript', icon: '🔷', hasPreview: false, language: 'typescript', mimeType: 'text/typescript' },
  svg: { name: 'SVG', icon: '🖼️', hasPreview: true, language: 'xml', mimeType: 'image/svg+xml' },
  xml: { name: 'XML', icon: '📋', hasPreview: false, language: 'xml', mimeType: 'text/xml' },
  text: { name: 'Text', icon: '📄', hasPreview: false, language: 'text', mimeType: 'text/plain' },
  python: { name: 'Python', icon: '🐍', hasPreview: false, language: 'python', mimeType: 'text/x-python' },
  java: { name: 'Java', icon: '☕', hasPreview: false, language: 'java', mimeType: 'text/x-java' },
  cpp: { name: 'C++', icon: '⚙️', hasPreview: false, language: 'cpp', mimeType: 'text/x-c++' },
  csharp: { name: 'C#', icon: '🔷', hasPreview: false, language: 'csharp', mimeType: 'text/x-csharp' },
  php: { name: 'PHP', icon: '🐘', hasPreview: false, language: 'php', mimeType: 'text/x-php' },
  ruby: { name: 'Ruby', icon: '💎', hasPreview: false, language: 'ruby', mimeType: 'text/x-ruby' },
  go: { name: 'Go', icon: '🐹', hasPreview: false, language: 'go', mimeType: 'text/x-go' },
  rust: { name: 'Rust', icon: '🦀', hasPreview: false, language: 'rust', mimeType: 'text/x-rust' },
  yaml: { name: 'YAML', icon: '📝', hasPreview: false, language: 'yaml', mimeType: 'text/yaml' },
  sql: { name: 'SQL', icon: '🗄️', hasPreview: false, language: 'sql', mimeType: 'text/x-sql' },
};
