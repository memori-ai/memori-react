import React from 'react';
import { Spin } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import { LayoutProps } from '../MemoriWidget/MemoriWidget';
import { useArtifact } from '../MemoriArtifactSystem/context/ArtifactContext';
import { getResourceUrl } from '../../helpers/media';
import ChatInputs from '../ChatInputs/ChatInputs';
import {
  maxDocumentsPerMessage,
  maxDocumentContentLength,
  pasteAsCardLineThreshold,
  pasteAsCardCharThreshold,
} from '../../helpers/constants';

const ChatLayout: React.FC<LayoutProps> = ({
  Header,
  headerProps,
  Chat,
  chatProps,
  StartPanel,
  startPanelProps,
  integrationStyle,
  integrationBackground,
  sessionId,
  hasUserActivatedSpeak,
  loading = false,
  poweredBy,
}) => {
  const { t } = useTranslation();
  const { state } = useArtifact();

  const memori = headerProps?.memori;
  const tenant = headerProps?.tenant;
  const baseUrl = headerProps?.baseUrl;

  const brandAvatarSrc = memori
    ? memori.avatarURL && memori.avatarURL.length > 0
      ? getResourceUrl({
          type: 'avatar',
          tenantID: tenant?.name,
          resourceURI: memori.avatarURL,
          baseURL: baseUrl,
          apiURL: '',
        })
      : getResourceUrl({
          type: 'avatar',
          tenantID: tenant?.name,
          baseURL: baseUrl,
          apiURL: '',
        })
    : undefined;

  return (
    <>
      {integrationStyle}
      {integrationBackground}

      <Spin spinning={loading} className="memori-chat-layout">
        {poweredBy}

        <div id="extension" />

        <div
          className={`memori-chat-layout--main ${
            state.isDrawerOpen ? 'memori-chat-layout--main-with-artifact' : ''
          }`}
        >
          <div
            className={
              state.isFullscreen
                ? `memori-chat-layout-controls-hide`
                : `memori-chat-layout--controls ${
                    state.isDrawerOpen
                      ? 'memori-chat-layout--controls-with-artifact'
                      : ''
                  }`
            }
          >
            <div
              className={`memori-chat-layout--header ${
                state.isDrawerOpen
                  ? 'memori-chat-layout--header-with-artifact'
                  : ''
              }`}
            >
              {Header && headerProps && (
                <div className="memori-chat-layout--header-row">
                  {memori && brandAvatarSrc && (
                    <div className="memori-chat-layout--brand">
                      <img
                        className="memori-chat-layout--brand-avatar"
                        src={brandAvatarSrc}
                        alt=""
                        role="presentation"
                      />
                      <div className="memori-chat-layout--brand-text">
                        <span className="memori-chat-layout--brand-name">
                          {memori.name}
                        </span>
                      </div>
                    </div>
                  )}
                  <Header {...headerProps} buttonVariant="outline" />
                </div>
              )}
            </div>

            <div className="memori-chat-layout--body">
              {sessionId && hasUserActivatedSpeak && Chat && chatProps ? (
                <Chat {...chatProps} />
              ) : startPanelProps ? (
                <div
                  className="memori-chat-layout--start-shell"
                  id="chat-wrapper"
                >
                  <div className="memori-chat-layout--start-panel-wrap">
                    <StartPanel {...startPanelProps} />
                  </div>
                  {Chat &&
                    chatProps &&
                    chatProps.showInputs !== false && (
                      <div className="memori-chat-layout--prechat-inputs">
                        <ChatInputs
                          userMessage={chatProps.userMessage}
                          onChangeUserMessage={chatProps.onChangeUserMessage}
                          dialogState={chatProps.dialogState}
                          instruct={chatProps.instruct}
                          authToken={chatProps.authToken}
                          sendMessage={chatProps.sendMessage}
                          isTyping={chatProps.memoriTyping}
                          microphoneMode={chatProps.microphoneMode}
                          sendOnEnter={chatProps.sendOnEnter}
                          setSendOnEnter={chatProps.setSendOnEnter}
                          client={chatProps.client}
                          sessionID={chatProps.sessionID}
                          showUpload={chatProps.showUpload}
                          attachmentsMenuOpen={chatProps.attachmentsMenuOpen}
                          setAttachmentsMenuOpen={
                            chatProps.setAttachmentsMenuOpen
                          }
                          onTextareaFocus={() => {
                            chatProps.stopListening?.();
                          }}
                          onTextareaBlur={() => {}}
                          onTextareaExpanded={() => {}}
                          startListening={chatProps.startListening}
                          stopListening={chatProps.stopListening}
                          stopAudio={chatProps.stopAudio}
                          listening={chatProps.listening}
                          isPlayingAudio={chatProps.isPlayingAudio}
                          showMicrophone={chatProps.showMicrophone}
                          memoriID={chatProps.memori?.memoriID}
                          maxTextareaCharacters={chatProps.maxTextareaCharacters}
                          maxDocumentsPerMessage={maxDocumentsPerMessage}
                          maxDocumentContentLength={maxDocumentContentLength}
                          pasteAsCardLineThreshold={pasteAsCardLineThreshold}
                          pasteAsCardCharThreshold={pasteAsCardCharThreshold}
                        />
                      </div>
                    )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default ChatLayout;
