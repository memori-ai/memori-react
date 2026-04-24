import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@memori.ai/ui';
import {
  Message,
  Memori,
  ChatLog,
} from '@memori.ai/memori-api-client/dist/types';
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import { stripHTML } from '../../helpers/utils';
import Chat from '../Chat/Chat';
import './ChatResumeDrawer.css';

export interface ResumeDrawerMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'completed' | 'interrupted';
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
  onExportChat: (chatLog: ChatLog, e: React.MouseEvent) => void;
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
}

const ANIMATION_DURATION_MS = 280;
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
}: ChatResumeDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    const timeout = window.setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    backButtonRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        } as Message;
      }),
    [session.messages]
  );

  if (!embedded && !shouldRender) return null;

  const content = (
    <div
      ref={panelRef}
      className={`memori-chat-resume-drawer--panel ${
        embedded ? 'memori-chat-resume-drawer--panel-embedded' : ''
      }`}
      onClick={event => event.stopPropagation()}
    >
      <header className="memori-chat-resume-drawer--header">
        <Button
          ref={backButtonRef}
          variant="ghost"
          type="button"
          className="memori-chat-resume-drawer--header-icon-button"
          onClick={onBack || onClose}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="memori-chat-resume-drawer--header-main">
          <h2 className="memori-chat-resume-drawer--title" title={safeTitle}>
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
          aria-label="Download"
          title="Download"
          icon={<Download />}
          onClick={(e: React.MouseEvent) =>
            onExportChat(
              session as unknown as ChatLog,
              e as React.MouseEvent<HTMLButtonElement>
            )
          }
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
          Riprendi conversazione <ArrowUpRight size={16} />
        </Button>
      </footer>
    </div>
  );

  if (embedded) {
    return (
      <div className="memori-chat-resume-drawer--embedded-shell">{content}</div>
    );
  }

  return (
    <div
      className={`memori-chat-resume-drawer ${
        isVisible ? 'memori-chat-resume-drawer--open' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Riprendi conversazione"
    >
      <Button
        className="memori-chat-resume-drawer--backdrop"
        type="button"
        aria-label="Close resume drawer"
        onClick={onClose}
      />
      {content}
    </div>
  );
};

export default ChatResumeDrawer;
