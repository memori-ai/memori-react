import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import { stripReasoningTags } from '../../../../helpers/utils';

// Event type for artifact creation
type ArtifactCreatedEvent = CustomEvent<{
  artifact: ArtifactData;
  message: Message;
}>;

interface ArtifactHandlerProps {
  isChatlogPanel?: boolean;
  message: Message;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Lightweight deterministic hash of the first 200 chars of a string.
 * Used to produce stable artifact IDs that survive re-renders.
 */
const hashContent = (str: string): string => {
  let hash = 0;
  const len = Math.min(str.length, 200);
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash).toString(36);
};

/**
 * Returns true when the `class` attribute value of an opening tag contains
 * the word "memori-artifact" as a whole word (handles multiple classes).
 *
 * Examples that match:
 *   class="memori-artifact"
 *   class="memori-artifact extra-class"
 *   class="foo memori-artifact"
 *   class='memori-artifact'
 *   class = "memori-artifact extra"
 */
const CLASS_ATTR_RE = /class\s*=\s*["']([^"']*)["']/i;
const hasMemoriArtifactClass = (openingTag: string): boolean => {
  const m = openingTag.match(CLASS_ATTR_RE);
  if (!m) return false;
  // \b word-boundary ensures we don't match "foo-memori-artifact-bar"
  return /\bmemori-artifact\b/.test(m[1]);
};

/**
 * Parser-style artifact detector.
 *
 * Replaces the previous single-regex approach with a depth-tracking loop so
 * that:
 *  - Multiple CSS classes are handled correctly  (e.g. class="memori-artifact foo")
 *  - Nested / self-contained <output> tags inside the content don't truncate it
 *  - Unclosed tags are gracefully skipped
 *  - IDs are stable across re-renders (derived from message + content hash)
 */
const detectArtifacts = (
  text: string,
  isFromUser: boolean,
  messageKey: string
): ArtifactData[] => {
  if (!text || isFromUser) return [];

  const cleaned = stripReasoningTags(text);
  const artifacts: ArtifactData[] = [];
  let searchFrom = 0;
  let artifactNum = 0;

  // Regex that matches any <output …> opening tag (capturing the full tag)
  const OPEN_TAG_RE = /<output\b([^>]*)>/gi;

  while (searchFrom < cleaned.length) {
    // Find the next <output …> opening tag from the current position
    OPEN_TAG_RE.lastIndex = searchFrom;
    const openMatch = OPEN_TAG_RE.exec(cleaned);
    if (!openMatch) break;

    const fullOpenTag = openMatch[0]; // e.g. <output class="memori-artifact" data-mimetype="text/html">
    const openStart = openMatch.index;
    const openEnd = openStart + fullOpenTag.length;

    // Only process tags that carry the required class
    if (!hasMemoriArtifactClass(fullOpenTag)) {
      searchFrom = openEnd;
      continue;
    }

    // Depth-tracking scan to find the matching </output>
    let depth = 1;
    let pos = openEnd;
    let closeStart = -1;

    while (pos < cleaned.length && depth > 0) {
      const nextOpen = cleaned.indexOf('<output', pos);
      const nextClose = cleaned.indexOf('</output>', pos);

      if (nextClose === -1) {
        // No closing tag found — treat everything until EOF as content
        // (handles streaming / partial messages)
        closeStart = cleaned.length;
        depth = 0;
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        // There's another opening tag before the next closing tag → go deeper
        depth++;
        pos = nextOpen + '<output'.length;
      } else {
        // Found a closing tag
        depth--;
        if (depth === 0) {
          closeStart = nextClose;
        } else {
          pos = nextClose + '</output>'.length;
        }
      }
    }

    if (closeStart === -1) {
      // Malformed — skip past this opening tag and continue
      searchFrom = openEnd;
      continue;
    }

    const content = cleaned.slice(openEnd, closeStart).trim();

    // Extract metadata from the opening tag
    const mimeTypeMatch = fullOpenTag.match(
      /data-mimetype\s*=\s*["']([^"']+)["']/i
    );
    const mimeType = mimeTypeMatch?.[1]?.trim() || 'text/plain';

    const dataTitleMatch = fullOpenTag.match(
      /data-title\s*=\s*["']([^"']+)["']/i
    );
    const htmlTitleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title =
      dataTitleMatch?.[1] ||
      htmlTitleMatch?.[1] ||
      `${mimeType.toUpperCase()} Artifact`;

    artifactNum++;

    // Stable ID: does not change across re-renders for the same content
    const stableId = `artifact-${messageKey}-${artifactNum}-${hashContent(
      content
    )}`;

    artifacts.push({
      id: stableId,
      content,
      mimeType,
      title,
      timestamp: new Date(),
      size: content.length,
    });

    // Advance past the closing tag (or EOF)
    searchFrom =
      closeStart === cleaned.length
        ? cleaned.length
        : closeStart + '</output>'.length;
  }

  return artifacts;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  isChatlogPanel = false,
  message,
}) => {
  const { openArtifact, state, closeArtifact } = useArtifact();

  /**
   * Use raw text for artifact detection.
   * translatedText may lose <output> tags — keep it as fallback only.
   */
  const messageText = useMemo(() => message.text || '', [message.text]);
  const translatedMessageText = useMemo(
    () => message.translatedText || '',
    [message.translatedText]
  );

  /**
   * Stable key that identifies this specific message.
   * Used both for effect gating and for stable artifact ID generation.
   */
  const messageKey = useMemo(
    () => `${message.timestamp}-${message.fromUser ? '1' : '0'}`,
    [message.timestamp, message.fromUser]
  );

  const dispatchArtifactCreatedEvent = useCallback(
    (artifact: ArtifactData) => {
      const event: ArtifactCreatedEvent = new CustomEvent('artifactCreated', {
        detail: { artifact, message },
      });
      document.dispatchEvent(event);
    },
    [message]
  );

  /**
   * Memoised artifact list.
   * Falls back to translatedText only when the primary text yields nothing.
   * Both branches use the same messageKey so IDs remain stable.
   */
  const artifacts = useMemo<ArtifactData[]>(() => {
    const fromUser = message.fromUser || false;
    const primary = detectArtifacts(messageText, fromUser, messageKey);
    if (primary.length > 0) return primary;
    return detectArtifacts(translatedMessageText, fromUser, messageKey);
  }, [messageText, translatedMessageText, message.fromUser, messageKey]);

  /**
   * Auto-open the first artifact when a new message arrives.
   *
   * FIX: messageText is now included in the dependency array so the effect
   * re-fires correctly if the text changes without the messageKey changing
   * (e.g. streaming updates).
   */
  useEffect(() => {
    if (!messageText || artifacts.length === 0) return;

    artifacts.forEach(artifact => dispatchArtifactCreatedEvent(artifact));

    if (!isChatlogPanel) {
      const timer = setTimeout(() => openArtifact(artifacts[0]), 100);
      return () => clearTimeout(timer);
    }
  }, [
    messageKey,
    messageText,
    artifacts,
    dispatchArtifactCreatedEvent,
    isChatlogPanel,
    openArtifact,
  ]);

  const handleArtifactClick = useCallback(
    (artifact: ArtifactData) => {
      if (state.isDrawerOpen && state.currentArtifact?.id === artifact.id) {
        closeArtifact();
      } else {
        openArtifact(artifact);
      }
    },
    [state.isDrawerOpen, state.currentArtifact?.id, closeArtifact, openArtifact]
  );

  const getIconForMimeType = useCallback((mimeType: string): string => {
    if (mimeType.includes('html')) return '🌐';
    if (mimeType.includes('markdown')) return '📝';
    if (mimeType.includes('javascript') || mimeType.includes('typescript'))
      return '📜';
    if (mimeType.includes('python')) return '🐍';
    if (mimeType.includes('json')) return '📊';
    if (mimeType.includes('css')) return '🎨';
    if (mimeType.includes('xml')) return '📋';
    if (mimeType.includes('svg')) return '🖼️';
    return '📄';
  }, []);

  if (artifacts.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {artifacts.map(artifact => {
        const isSelected =
          state.isDrawerOpen && state.currentArtifact?.id === artifact.id;

        return (
          <React.Fragment key={artifact.id}>
            <div
              className={`memori-artifact-handler${
                isSelected ? ' memori-artifact-handler--selected' : ''
              }`}
              onClick={() => handleArtifactClick(artifact)}
              style={
                isSelected
                  ? {
                      border: '2px solid var(--memori-primary, #3b82f6)',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    }
                  : undefined
              }
            >
              <div className="memori-artifact-handler-icon">
                {getIconForMimeType(artifact.mimeType)}
              </div>
              <div className="memori-artifact-handler-info">
                <div className="memori-artifact-handler-title">
                  {artifact.title}
                </div>
                <div className="memori-artifact-handler-meta">
                  {artifact.mimeType} • {formatBytes(artifact.size || 0)}
                </div>
              </div>
              <div className="memori-artifact-handler-action">
                {isChatlogPanel ? (
                  isSelected ? (
                    <ChevronUp className="memori-artifact-handler-action-icon" />
                  ) : (
                    <ChevronDown className="memori-artifact-handler-action-icon" />
                  )
                ) : isSelected ? (
                  <ChevronLeft className="memori-artifact-handler-action-icon" />
                ) : (
                  <ChevronRight className="memori-artifact-handler-action-icon" />
                )}
              </div>
            </div>

            {/* Render ArtifactDrawer inline when in chatlog panel */}
            {isSelected && <ArtifactDrawer isChatLogPanel={isChatlogPanel} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Memoised export
// ---------------------------------------------------------------------------

/**
 * FIX: comparison now uses the same field priority as detectArtifacts
 * (message.text first, translatedText as fallback) to avoid asymmetric
 * re-render skipping.
 */
const MemoizedArtifactHandler = memo(ArtifactHandler, (prev, next) => {
  const prevText = prev.message.text || prev.message.translatedText || '';
  const nextText = next.message.text || next.message.translatedText || '';

  return (
    prev.isChatlogPanel === next.isChatlogPanel &&
    prevText === nextText &&
    prev.message.fromUser === next.message.fromUser &&
    prev.message.timestamp === next.message.timestamp
  );
});

export default MemoizedArtifactHandler;
