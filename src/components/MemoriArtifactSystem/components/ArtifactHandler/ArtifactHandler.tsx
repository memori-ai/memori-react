import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
} from 'react';
import { useArtifact } from '../../context/ArtifactContext';
import { ArtifactData, ArtifactEdit } from '../../types/artifact.types';
import ChevronRight from '../../../icons/ChevronRight';
import ArtifactDrawer from '../ArtifactDrawer/ArtifactDrawer';
import ChevronDown from '../../../icons/ChevronDown';
import ChevronLeft from '../../../icons/ChevronLeft';
import ChevronUp from '../../../icons/ChevronUp';
import { Message } from '@memori.ai/memori-api-client/dist/types';
import { stripReasoningTags } from '../../../../helpers/utils';
import { parseEdits } from '../../utils/applyEdits';
import { useTranslation } from 'react-i18next';

// Event type for artifact creation
type ArtifactCreatedEvent = CustomEvent<{
  artifact: ArtifactData;
  message: Message;
}>;

interface ArtifactHandlerProps {
  isChatlogPanel?: boolean;
  message: Message;
}

interface DetectedUpdate {
  artifactId: string;
  edits: ArtifactEdit[];
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
 * Returns true when the `class` attribute contains the whole-word
 * "memori-artifact" but NOT "memori-artifact-update".
 */
const CLASS_ATTR_RE = /class\s*=\s*["']([^"']*)["']/i;
const hasMemoriArtifactClass = (openingTag: string): boolean => {
  const m = openingTag.match(CLASS_ATTR_RE);
  if (!m) return false;
  const classes = m[1].split(/\s+/);
  return (
    classes.includes('memori-artifact') &&
    !classes.includes('memori-artifact-update')
  );
};

const hasMemoriArtifactUpdateClass = (openingTag: string): boolean => {
  const m = openingTag.match(CLASS_ATTR_RE);
  if (!m) return false;
  return m[1].split(/\s+/).includes('memori-artifact-update');
};

/**
 * Parser-style artifact detector for create tags (class="memori-artifact").
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

  const OPEN_TAG_RE = /<output\b([^>]*)>/gi;

  while (searchFrom < cleaned.length) {
    OPEN_TAG_RE.lastIndex = searchFrom;
    const openMatch = OPEN_TAG_RE.exec(cleaned);
    if (!openMatch) break;

    const fullOpenTag = openMatch[0];
    const openStart = openMatch.index;
    const openEnd = openStart + fullOpenTag.length;

    if (!hasMemoriArtifactClass(fullOpenTag)) {
      searchFrom = openEnd;
      continue;
    }

    let depth = 1;
    let pos = openEnd;
    let closeStart = -1;

    while (pos < cleaned.length && depth > 0) {
      const nextOpen = cleaned.indexOf('<output', pos);
      const nextClose = cleaned.indexOf('</output>', pos);

      if (nextClose === -1) {
        closeStart = cleaned.length;
        depth = 0;
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + '<output'.length;
      } else {
        depth--;
        if (depth === 0) {
          closeStart = nextClose;
        } else {
          pos = nextClose + '</output>'.length;
        }
      }
    }

    if (closeStart === -1) {
      searchFrom = openEnd;
      continue;
    }

    const content = cleaned.slice(openEnd, closeStart).trim();

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

    const dataArtifactIdMatch = fullOpenTag.match(
      /data-artifact-id\s*=\s*["']([^"']+)["']/i
    );
    const artifactId =
      dataArtifactIdMatch?.[1]?.trim() ||
      `artifact-${messageKey}-${artifactNum}`;

    artifacts.push({
      id: `artifact-ui-${artifactId}`,
      artifactId,
      content,
      mimeType,
      title,
      timestamp: new Date(),
      size: content.length,
    });

    searchFrom =
      closeStart === cleaned.length
        ? cleaned.length
        : closeStart + '</output>'.length;
  }

  return artifacts;
};

/**
 * Detect memori-artifact-update tags and parse their JSON edit bodies.
 */
const detectUpdates = (
  text: string,
  isFromUser: boolean
): DetectedUpdate[] => {
  if (!text || isFromUser) return [];

  const cleaned = stripReasoningTags(text);
  const updates: DetectedUpdate[] = [];
  let searchFrom = 0;

  const OPEN_TAG_RE = /<output\b([^>]*)>/gi;

  while (searchFrom < cleaned.length) {
    OPEN_TAG_RE.lastIndex = searchFrom;
    const openMatch = OPEN_TAG_RE.exec(cleaned);
    if (!openMatch) break;

    const fullOpenTag = openMatch[0];
    const openEnd = openMatch.index + fullOpenTag.length;

    if (!hasMemoriArtifactUpdateClass(fullOpenTag)) {
      searchFrom = openEnd;
      continue;
    }

    const closeStart = cleaned.indexOf('</output>', openEnd);
    const bodyEnd = closeStart === -1 ? cleaned.length : closeStart;
    const body = cleaned.slice(openEnd, bodyEnd).trim();

    const idMatch = fullOpenTag.match(
      /data-artifact-id\s*=\s*["']([^"']+)["']/i
    );
    const artifactId = idMatch?.[1]?.trim();
    const edits = parseEdits(body);

    if (artifactId && edits) {
      updates.push({ artifactId, edits });
    }

    searchFrom =
      closeStart === -1 ? cleaned.length : closeStart + '</output>'.length;
  }

  return updates;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ArtifactHandler: React.FC<ArtifactHandlerProps> = ({
  isChatlogPanel = false,
  message,
}) => {
  const { openArtifact, state, closeArtifact, registerArtifact, applyArtifactUpdate } =
    useArtifact();
  const { t } = useTranslation();

  const messageText = useMemo(() => message.text || '', [message.text]);
  const translatedMessageText = useMemo(
    () => message.translatedText || '',
    [message.translatedText]
  );

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

  const artifacts = useMemo<ArtifactData[]>(() => {
    const fromUser = message.fromUser || false;
    const primary = detectArtifacts(messageText, fromUser, messageKey);
    if (primary.length > 0) return primary;
    return detectArtifacts(translatedMessageText, fromUser, messageKey);
  }, [messageText, translatedMessageText, message.fromUser, messageKey]);

  const detectedUpdates = useMemo<DetectedUpdate[]>(() => {
    const fromUser = message.fromUser || false;
    const primary = detectUpdates(messageText, fromUser);
    if (primary.length > 0) return primary;
    return detectUpdates(translatedMessageText, fromUser);
  }, [messageText, translatedMessageText, message.fromUser]);

  // Per-message map of update index → resulting ArtifactData version
  const [updateResultMap, setUpdateResultMap] = useState<
    Record<number, ArtifactData>
  >({});

  // Prevent re-applying the same update payload (e.g. streaming re-renders)
  const processedUpdatesRef = useRef<string>('');
  const hasAutoOpenedRef = useRef<string>('');

  // Register creates + apply updates when this message arrives
  useEffect(() => {
    if (!messageText && !translatedMessageText) return;

    artifacts.forEach(artifact => {
      registerArtifact(artifact);
      dispatchArtifactCreatedEvent(artifact);
    });

    const updatesSignature = `${messageKey}:${detectedUpdates
      .map(u => `${u.artifactId}:${JSON.stringify(u.edits)}`)
      .join('|')}`;

    let lastUpdated: ArtifactData | null = null;

    if (
      detectedUpdates.length > 0 &&
      processedUpdatesRef.current !== updatesSignature
    ) {
      processedUpdatesRef.current = updatesSignature;
      const nextMap: Record<number, ArtifactData> = {};

      detectedUpdates.forEach((update, idx) => {
        const result = applyArtifactUpdate(update.artifactId, update.edits);
        if (result.updatedArtifact) {
          nextMap[idx] = result.updatedArtifact;
          lastUpdated = result.updatedArtifact;
          dispatchArtifactCreatedEvent(result.updatedArtifact);
        }
      });

      setUpdateResultMap(nextMap);
    }

    if (isChatlogPanel) return;

    const openTarget =
      lastUpdated ??
      (Object.keys(updateResultMap).length === 0 && artifacts.length > 0
        ? artifacts[0]
        : null);
    if (!openTarget) return;

    if (hasAutoOpenedRef.current === messageKey) return;
    hasAutoOpenedRef.current = messageKey;

    const timer = setTimeout(() => openArtifact(openTarget), 100);
    return () => clearTimeout(timer);
  }, [
    messageKey,
    messageText,
    translatedMessageText,
    artifacts,
    detectedUpdates,
    updateResultMap,
    registerArtifact,
    applyArtifactUpdate,
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

  const updatedLabel = t('artifact.updated') || 'updated';

  const hasCreates = artifacts.length > 0;
  const updateEntries = Object.entries(updateResultMap);
  const hasUpdates = updateEntries.length > 0;

  if (!hasCreates && !hasUpdates) return null;

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

            {isSelected && <ArtifactDrawer isChatLogPanel={isChatlogPanel} />}
          </React.Fragment>
        );
      })}

      {updateEntries.map(([, artifact]) => {
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
              <div className="memori-artifact-handler-icon">✏️</div>
              <div className="memori-artifact-handler-info">
                <div className="memori-artifact-handler-title">
                  {artifact.title} — {updatedLabel}
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
