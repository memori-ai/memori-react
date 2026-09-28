import React, { useMemo } from 'react';
import { Drawer } from '@memori.ai/ui';
import { Message, Memori } from '@memori.ai/memori-api-client/dist/types';
import { stripHTML } from '../../helpers/utils';
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
   * When true, render the chat thread only (chrome lives on SideDrawer).
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
  memori?: Memori;
}

const FALLBACK_MEMORI = {
  memoriID: 'chat-resume-drawer',
  name: 'AI',
  culture: 'it-IT',
  coverURL: '',
  avatarURL: '',
  enableBoardOfExperts: false,
} as Memori;
const NOOP = () => {};

const escapeAttachmentAttr = (value: string): string =>
  value.replaceAll('"', '&quot;');

const ChatResumeDrawer = ({
  isOpen,
  onClose,
  embedded = false,
  session,
  isLoading = false,
  showFunctionCache = false,
  showMessageConsumption = false,
  memori = FALLBACK_MEMORI,
}: ChatResumeDrawerProps) => {
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

  const thread = (
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
            memori={memori}
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
  );

  if (embedded) {
    if (!isOpen) return null;
    return (
      <div className="memori-chat-resume-drawer--embedded-shell">{thread}</div>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      className="memori-chat-resume-drawer"
      anchor="right"
      size="md"
      showCloseButton={false}
      title={stripHTML(session.title)}
    >
      {thread}
    </Drawer>
  );
};

export default ChatResumeDrawer;
