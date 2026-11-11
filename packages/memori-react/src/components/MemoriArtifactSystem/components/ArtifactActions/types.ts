/**
 * TypeScript interfaces for artifact copy system components
 */

import React from 'react';

export interface CopyFormat {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode | undefined;
  mimeType: string;
  action: 'copy' | 'pdf' | 'print' | 'download' | 'link';
  isAsync?: boolean;
}

export interface CopyMenuItemProps {
  format: CopyFormat;
  onClick: (format: CopyFormat) => void;
  loading?: boolean;
  disabled?: boolean;
}

// CopyDropdownProps removed - using headless-ui Menu directly

export interface CopyButtonWithDropdownProps {
  artifact: {
    content: string;
    mimeType: string;
    title?: string;
  };
  onCopy?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onOpenExternal?: () => void;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface CopyState {
  isOpen: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
  activeFormat: string | null;
}

export interface UseCopyArtifactReturn {
  copyState: CopyState;
  formats: CopyFormat[];
  handleCopy: (format: CopyFormat) => Promise<void>;
  toggleDropdown: () => void;
  closeDropdown: () => void;
  resetState: () => void;
  handleCopyClick: () => Promise<void>;
}

export interface PDFExportOptions {
  title?: string;
  author?: string;
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  fontSize?: string;
  fontFamily?: string;
  lineHeight?: string;
  color?: string;
  backgroundColor?: string;
}
