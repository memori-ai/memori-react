import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Drawer } from '@memori.ai/ui';
import {
  Message,
  Memori,
} from '@memori.ai/memori-api-client/dist/types';
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { stripHTML } from '../../helpers/utils';
import { useWidgetSurfaceEl } from '../../context/widgetSurfaceContext';
import Chat from '../Chat/Chat';

export interface ResumeDrawerMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'completed' | 'interrupted';
  media?: Message['media'];
  attachment?: {
    name: string;
    type: string;
    size: string;
    ext: string;
  };
}

export interface ChatResumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onExportChat: () => void;
  /**
   * When true, render panel content only (nested inside ChatHistory Drawer).
   * When false, open as a library Drawer on the widget surface.
   */
  embedded?: boolean;
  session: {
    title: string;
    subtitle: string;
    summary: string;
    messages: ResumeDrawerMessage[];
    quickActions: { label: string; prompt: string }[];
  };
  onResume: (prompt?: string) => void;
  isLoading?: boolean;
  showFunctionCache?: boolean;
  showMessageConsumption?: boolean;
}

const EMPTY_MEMORI = {
  memoriID: 'chat-resume-drawer',
  name: 'AI',
  culture: 'it-IT',
  coverURL: '',
  avatarURL: '',
  enableBoardOfExperts: false,
} as Memori;
const NOOP = () => {};

const stripMarkdownChars = (value: string): string => {
  return value
    .replace(/[#*_`~>\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const escapeAttachmentAttr = (value: string): string =>
  value.replaceAll('"', '&quot;');

const ChatResumeDrawer = ({
  isOpen,
  onClose,
  onBack,
  embedded = false,
  session,
  onResume,
  isLoading = false,
  onExportChat,
  showFunctionCache = false,
  showMessageConsumption = false,
}: ChatResumeDrawerProps) => {
  const { t } = useTranslation();
  const surfaceEl = useWidgetSurfaceEl();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = 'chat-resume-drawer-title';

  useEffect(() => {
    if (!isOpen) return;
    backButtonRef.current?.focus();
  }, [isOpen]);

  const safeTitle = useMemo(() => {
    const cleaned = stripMarkdownChars(stripHTML(session.title || ''));
    return cleaned || 'Conversazione';
  }, [session.title]);

  const history = useMemo<Message[]>(
    () =>
      session.messages.map(message => {
        const attachmentTag = message.attachment
          ? `<document_attachment filename="${escapeAttachmentAttr(
              message.attachment.name
            )}" type="${escapeAttachmentAttr(
              message.attachment.type
            )}"></document_attachment>`
          : '';
        const interruptedText =
          message.role === 'assistant' && message.status === 'interrupted'
            ? 'Risposta interrotta - sessione in pausa'
            : message.content;

        return {
          fromUser: message.role === 'user',
          text: `${interruptedText}${attachmentTag}`,
          timestamp: message.timestamp,
          media: message.media || [],
        } as Message;
      }),
    [session.messages]
  );

  const content = (
    <div
      className={`memori-chat-resume-drawer--panel ${
        embedded ? 'memori-chat-resume-drawer--panel-embedded' : ''
      }`}
    >
      <header className="memori-chat-resume-drawer--header">
        <Button
          ref={backButtonRef}
          variant="ghost"
          type="button"
          className="memori-chat-resume-drawer--header-icon-button"
          onClick={onBack || onClose}
          aria-label={String(t('back', { defaultValue: 'Back' }))}
        >
          <ArrowLeft size={16} aria-hidden />
        </Button>
        <div className="memori-chat-resume-drawer--header-main">
          <h2
            id={titleId}
            className="memori-chat-resume-drawer--title"
            title={safeTitle}
          >
            {safeTitle}
          </h2>
          <p className="memori-chat-resume-drawer--subtitle">
            {session.subtitle}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="memori-chat-history-drawer--header-download-button"
          aria-label={String(t('download', { defaultValue: 'Download' }))}
          title={String(t('download', { defaultValue: 'Download' }))}
          icon={<Download aria-hidden />}
          onClick={onExportChat}
        />
      </header>

      <div className="memori-chat-resume-drawer--thread">
        {isLoading && (
          <div className="memori-chat-resume-drawer--skeletons">
            {[0, 1, 2].map(item => (
              <div
                key={item}
                className="memori-chat-resume-drawer--skeleton-bubble"
              />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="memori-chat-resume-drawer--embedded-chat">
            <Chat
              memori={EMPTY_MEMORI}
              sessionID="chat-resume-drawer"
              history={history}
              pushMessage={NOOP}
              simulateUserPrompt={NOOP}
              setSendOnEnter={NOOP}
              setAttachmentsMenuOpen={NOOP}
              onChangeUserMessage={NOOP}
              sendMessage={NOOP}
              setEnableFocusChatInput={NOOP}
              stopAudio={NOOP}
              startListening={NOOP}
              stopListening={NOOP}
              showInputs={false}
              showAIicon={true}
              showCopyButton={true}
              isHistoryView={true}
              isChatlogPanel={true}
              showFunctionCache={showFunctionCache}
              showMessageConsumption={showMessageConsumption}
            />
          </div>
        )}
      </div>

      <footer className="memori-chat-resume-drawer--actions">
        <Button
          className="memori-chat-resume-drawer--resume-cta"
          variant="primary"
          onClick={() => onResume()}
        >
          {t('chatResume.resume', { defaultValue: 'Resume conversation' })}{' '}
          <ArrowUpRight size={16} aria-hidden />
        </Button>
      </footer>
    </div>
  );

  if (embedded) {
    if (!isOpen) return null;
    return (
      <div className="memori-chat-resume-drawer--embedded-shell">{content}</div>
    );
  }

  return (
    <Drawer
      container={surfaceEl ?? undefined}
      open={isOpen}
      onClose={onClose}
      className="memori-chat-resume-drawer"
      anchor="right"
      size="md"
      showCloseButton={false}
    >
      {content}
    </Drawer>
  );
};

export default ChatResumeDrawer;
