import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Button } from '@memori.ai/ui';
import I18nWrapper from './I18nWrapper';
import { ArtifactProvider } from './components/MemoriArtifactSystem/context/ArtifactContext';
import { AlertProvider } from '@memori.ai/ui';
import memoriApiClient from '@memori.ai/memori-api-client';

import {
  memori,
  tenant,
  user,
  history,
  sessionID,
  integration,
  dialogState,
  knownFact,
  expertReference,
  venue,
} from './mocks/data';

// Components
import Header from './components/Header/Header';
import ChatBubble from './components/ChatBubble/ChatBubble';
import ChatInputs from './components/ChatInputs/ChatInputs';
import StartPanel from './components/StartPanel/StartPanel';
import BlockedMemoriBadge from './components/BlockedMemoriBadge/BlockedMemoriBadge';
import PoweredBy from './components/PoweredBy/PoweredBy';
import FeedbackButtons from './components/FeedbackButtons/FeedbackButtons';
import ShareButton from './components/ShareButton/ShareButton';
import Snippet from './components/Snippet/Snippet';
import CompletionProviderStatus from './components/CompletionProviderStatus/CompletionProviderStatus';
import KnownFacts from './components/KnownFacts/KnownFacts';
import WhyThisAnswer from './components/WhyThisAnswer/WhyThisAnswer';
import Blob from './components/Blob/Blob';
import MicrophoneButton from './components/MicrophoneButton/MicrophoneButton';
import Typing from './components/Typing/Typing';
import ChangeMode from './components/ChangeMode/ChangeMode';
import DateSelector from './components/DateSelector/DateSelector';
import VenueWidget from './components/VenueWidget/VenueWidget';
import SendOnEnterMenu from './components/SendOnEnterMenu/SendOnEnterMenu';
import ExpertsDrawer from './components/ExpertsDrawer/ExpertsDrawer';
import SettingsDrawer from './components/SettingsDrawer/SettingsDrawer';
import LoginDrawer from './components/LoginDrawer/LoginDrawer';
import FilePreview from './components/FilePreview/FilePreview';
import MediaWidget from './components/MediaWidget/MediaWidget';
import MediaItemWidget from './components/MediaWidget/MediaItemWidget';

// CSS
import './components/Header/Header.css';
import './components/ChatBubble/ChatBubble.css';
import './components/ChatInputs/ChatInputs.css';
import './components/StartPanel/StartPanel.css';
import './components/BlockedMemoriBadge/BlockedMemoriBadge.css';
import './components/PoweredBy/PoweredBy.css';
import './components/FeedbackButtons/FeedbackButtons.css';
import './components/ShareButton/ShareButton.css';
import './components/Snippet/Snippet.css';
import './components/CompletionProviderStatus/CompletionProviderStatus.css';
import './components/KnownFacts/KnownFacts.css';
import './components/WhyThisAnswer/WhyThisAnswer.css';
import './components/Blob/Blob.css';
import './components/MicrophoneButton/MicrophoneButton.css';
import './components/ChangeMode/ChangeMode.css';
import './components/DateSelector/DateSelector.css';
import './components/VenueWidget/VenueWidget.css';
import './components/SendOnEnterMenu/SendOnEnterMenu.css';
import './components/ExpertsDrawer/ExpertsDrawer.css';
import './components/SettingsDrawer/SettingsDrawer.css';
import './components/LoginDrawer/LoginDrawer.css';
import './components/FilePreview/FilePreview.css';
import './components/MediaWidget/MediaWidget.css';
import './components/MediaWidget/MediaItemWidget.css';

const sectionStyle: React.CSSProperties = {
  marginBottom: '3rem',
  padding: '1.5rem',
  border: '1px solid var(--showcase-section-border)',
  borderRadius: '8px',
  backgroundColor: 'var(--showcase-section-bg)',
};

const titleStyle: React.CSSProperties = {
  marginBottom: '1rem',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--showcase-title-color)',
};

const meta: Meta = {
  title: 'Showcase/All Components',
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: false },
  },
};

export default meta;

export const AllComponentsWithAllPropsEnabled: Story = () => {
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showLoginDrawer, setShowLoginDrawer] = useState(false);
  const [showKnownFactsDrawer, setShowKnownFactsDrawer] = useState(false);
  const [showWhyThisAnswerDrawer, setShowWhyThisAnswerDrawer] = useState(false);
  const [showExpertsDrawer, setShowExpertsDrawer] = useState(false);
  const [instruct, setInstruct] = useState(false);
  const [sendOnEnter, setSendOnEnter] = useState<'keypress' | 'click'>('keypress');
  const [venueState, setVenueState] = useState(venue);
  const [listening, setListening] = useState(false);
  const [userMessage, setUserMessage] = useState('Sample message with all features enabled');
  const [previewFiles, setPreviewFiles] = useState<{ name: string; id: string; content: string }[]>([]);

  const integrationConfig = integration?.customData ? JSON.parse(integration.customData) : {};

  return (
    <I18nWrapper>
      <AlertProvider>
      <ArtifactProvider>
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', color: 'var(--memori-label-color)' }}>
          <h1 style={{ marginBottom: '2rem', color: 'var(--showcase-title-color)' }}>Component Showcase — All Props Enabled</h1>

          {/* Header - all props */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>Header</h2>
            <Header
              memori={{ ...memori, needsPosition: true, enableDeepThought: true, enableBoardOfExperts: true }}
              history={history}
              position={{ placeName: 'Berlin', latitude: 52.52, longitude: 13.405 }}
              setShowPositionDrawer={() => {}}
              setShowSettingsDrawer={() => setShowSettingsDrawer(true)}
              setShowChatHistoryDrawer={() => {}}
              setShowKnownFactsDrawer={() => {}}
              setShowExpertsDrawer={() => {}}
              setShowLoginDrawer={() => setShowLoginDrawer(true)}
              clearHistory={() => {}}
              speakerMuted={speakerMuted}
              setSpeakerMuted={setSpeakerMuted}
              hasUserActivatedSpeak={true}
              showShare={true}
              showSettings={true}
              showClear={true}
              showLogin={true}
              enableAudio={true}
              apiClient={memoriApiClient()}
              sessionID={sessionID}
              loginToken="demo-token"
            />
          </section>

          {/* ChatBubble - all addons */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>ChatBubble</h2>
            <div style={{ maxWidth: '480px' }}>
              <ChatBubble
                memori={memori}
                tenant={tenant}
                sessionID={sessionID}
                apiUrl="https://backend.memori.ai"
                user={{ avatarURL: 'https://picsum.photos/200' }}
                userAvatar="https://picsum.photos/200"
                experts={[expertReference]}
                message={{
                  fromUser: false,
                  text: '**Markdown** support with [links](https://memori.ai). Copy, feedback, translation and reasoning enabled.',
                  initial: false,
                  translatedText: 'Translated text example.',
                  generatedByAI: true,
                  emitter: 'Expert name',
                  media: [
                    {
                      mediumID: '1',
                      mimeType: 'text/plain',
                      title: 'Attachment',
                      content: 'Sample content',
                      properties: { functionCache: 'true' },
                    },
                  ],
                }}
                showCopyButton={true}
                showFeedback={true}
                showTranslationOriginal={true}
                showReasoning={true}
                showFunctionCache={true}
                simulateUserPrompt={() => {}}
              />
            </div>
          </section>

          {/* ChatInputs */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>ChatInputs</h2>
            <div style={{ paddingTop: '2rem' }}>
              <ChatInputs
                userMessage={userMessage}
                onChangeUserMessage={setUserMessage}
                dialogState={dialogState}
                sendMessage={(msg) => console.log(msg)}
                onTextareaBlur={() => {}}
                onTextareaFocus={() => {}}
                setAttachmentsMenuOpen={() => {}}
                setSendOnEnter={() => {}}
                sendOnEnter={sendOnEnter}
                listening={listening}
                isPlayingAudio={false}
                stopAudio={() => {}}
                startListening={() => setListening(true)}
                stopListening={() => setListening(false)}
                showMicrophone={true}
              />
            </div>
          </section>

          {/* StartPanel */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>StartPanel</h2>
            <div style={{ maxWidth: '500px' }}>
              <StartPanel
                memori={{ ...memori, enableCompletions: true, nsfw: true, enableDeepThought: true, enableBoardOfExperts: true, needsPosition: true }}
                tenant={tenant}
                language="it"
                userLang="en"
                setUserLang={() => {}}
                openPositionDrawer={() => {}}
                instruct={false}
                sessionId={sessionID}
                hasInitialSession={true}
                clickedStart={false}
                onClickStart={() => {}}
                isUserLoggedIn={true}
                user={user}
                showLogin={true}
                setShowLoginDrawer={() => {}}
                integrationConfig={integrationConfig}
              />
            </div>
          </section>

          {/* BlockedMemoriBadge */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>BlockedMemoriBadge</h2>
            <BlockedMemoriBadge
              memoriName="Demo Memori"
              blockedUntil="2026-01-01T00:00:00.000Z"
              showGiverInfo={true}
              showTitle={true}
              marginLeft={true}
            />
          </section>

          {/* PoweredBy */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>PoweredBy</h2>
            <PoweredBy
              userLang="en"
              tenant={{ ...tenant, theme: 'aisuru' }}
              integrationID="showcase"
              memoriHash="tenant-owner-memori"
            />
          </section>

          {/* FeedbackButtons */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>FeedbackButtons</h2>
            <div style={{ textAlign: 'right' }}>
              <FeedbackButtons
                memori={memori}
                toggle={true}
                dropdown={true}
                onNegativeClick={() => {}}
              />
            </div>
          </section>

          {/* ShareButton */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>ShareButton</h2>
            <ShareButton
              url="https://memori.ai"
              showQrCode={true}
              align="right"
              tenant={tenant}
              memori={memori}
              sessionID={sessionID}
            />
          </section>

          {/* Snippet */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>Snippet</h2>
            <Snippet
              medium={{
                mediumID: '1',
                mimeType: 'text/javascript',
                title: 'example.js',
                content: "console.log('Hello, Memori!');\nconst x = 42;",
              }}
              preview={false}
              showCopyButton={true}
            />
          </section>

          {/* CompletionProviderStatus */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>CompletionProviderStatus</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <CompletionProviderStatus provider="OpenAI" forceStatus="degraded_performance" />
              <CompletionProviderStatus provider="Anthropic" forceStatus="partial_outage" />
              <CompletionProviderStatus provider="Mistral" forceStatus="major_outage" />
            </div>
          </section>

          {/* KnownFacts */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>KnownFacts</h2>
            <div style={{ marginBottom: '1rem' }}>
              <Button variant="primary" onClick={() => setShowKnownFactsDrawer(true)}>
                Open Known Facts
              </Button>
            </div>
            <KnownFacts
              visible={showKnownFactsDrawer}
              memori={memori}
              sessionID={sessionID}
              closeDrawer={() => setShowKnownFactsDrawer(false)}
              apiClient={memoriApiClient()}
              initialKnownFacts={[knownFact, { ...knownFact, knownFactID: '2', text: 'Second known fact.' }]}
            />
          </section>

          {/* WhyThisAnswer */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>WhyThisAnswer</h2>
            <div style={{ marginBottom: '1rem' }}>
              <Button variant="primary" onClick={() => setShowWhyThisAnswerDrawer(true)}>
                Open Why This Answer
              </Button>
            </div>
            <WhyThisAnswer
              visible={showWhyThisAnswerDrawer}
              client={memoriApiClient()}
              sessionID={sessionID}
              message={{
                questionAnswered: 'What is the capital of France?',
                text: 'Paris is the capital of France.',
                date: '2024-01-01',
                placeName: 'Paris',
                placeLatitude: 48.8566,
                placeLongitude: 2.3522,
                placeUncertaintyKm: 1,
                contextVars: { COUNTRY: 'France' },
              }}
              closeDrawer={() => setShowWhyThisAnswerDrawer(false)}
              initialMatches={[
                {
                  confidence: 0.95,
                  confidenceLevel: 'HIGH',
                  memory: {
                    memoryID: '1',
                    memoryType: 'Question',
                    title: 'Capital of France',
                    titleVariants: ['France capital'],
                    answers: [{ text: 'Paris is the capital.', preformatted: false }],
                  },
                },
              ]}
            />
          </section>

          {/* Blob */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>Blob</h2>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Blob speaking={false} avatar="https://picsum.photos/100" />
              <Blob speaking={true} avatar="https://picsum.photos/101" />
            </div>
          </section>

          {/* MicrophoneButton */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>MicrophoneButton</h2>
            <div style={{ textAlign: 'right' }}>
              <MicrophoneButton
                listening={listening}
                startListening={() => setListening(true)}
                stopListening={() => setListening(false)}
                stopAudio={() => {}}
              />
            </div>
          </section>

          {/* Typing */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>Typing</h2>
            <Typing
              useDefaultSentences={true}
              lang="en"
              sentence="Custom loading message..."
            />
          </section>

          {/* ChangeMode */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>ChangeMode</h2>
            <ChangeMode
              canInstruct
              instruct={instruct}
              onChangeMode={(mode) => setInstruct(mode === 'instruct')}
            />
          </section>

          {/* DateSelector */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>DateSelector</h2>
            <DateSelector
              defaultDate={new Date()}
              onChange={(d) => console.log(d)}
              disabled={false}
            />
          </section>

          {/* VenueWidget */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>VenueWidget</h2>
            <VenueWidget
              venue={venueState}
              setVenue={setVenueState}
              showUncertainty={true}
              showGpsButton={true}
            />
          </section>

          {/* SendOnEnterMenu */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>SendOnEnterMenu</h2>
            <div style={{ minHeight: '120px', display: 'flex', alignItems: 'flex-end' }}>
              <SendOnEnterMenu
                sendOnEnter={sendOnEnter}
                setSendOnEnter={setSendOnEnter}
              />
            </div>
          </section>

          {/* ExpertsDrawer */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>ExpertsDrawer</h2>
            <div style={{ marginBottom: '1rem' }}>
              <Button variant="primary" onClick={() => setShowExpertsDrawer(true)}>
                Open Experts Drawer
              </Button>
            </div>
            <ExpertsDrawer
              open={showExpertsDrawer}
              onClose={() => setShowExpertsDrawer(false)}
              baseUrl="https://aisuru.com"
              apiUrl="https://backend.memori.ai"
              tenant={tenant}
              experts={[
                expertReference,
                { ...expertReference, expertID: '2', name: 'Second Expert', description: 'Another expert.' },
              ]}
            />
          </section>

          {/* SettingsDrawer */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>SettingsDrawer</h2>
            <div style={{ marginBottom: '1rem' }}>
              <Button variant="primary" onClick={() => setShowSettingsDrawer(true)}>
                Open Settings Drawer
              </Button>
            </div>
            <SettingsDrawer
              open={showSettingsDrawer}
              onClose={() => setShowSettingsDrawer(false)}
              microphoneMode="HOLD_TO_TALK"
              setMicrophoneMode={() => {}}
              continuousSpeechTimeout={2}
              setContinuousSpeechTimeout={() => {}}
              controlsPosition="bottom"
              setControlsPosition={() => {}}
              hideEmissions={false}
              setHideEmissions={() => {}}
              setAvatarType={() => {}}
              setEnablePositionControls={() => {}}
            />
          </section>

          {/* LoginDrawer */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>LoginDrawer</h2>
            <div style={{ marginBottom: '1rem' }}>
              <Button variant="primary" onClick={() => setShowLoginDrawer(true)}>
                Open Login Drawer
              </Button>
            </div>
            <LoginDrawer
              setUser={() => {}}
              tenant={tenant}
              open={showLoginDrawer}
              onClose={() => setShowLoginDrawer(false)}
              onLogin={(u, token) => { console.log(u, token); setShowLoginDrawer(false); }}
              onLogout={() => setShowLoginDrawer(false)}
              apiClient={memoriApiClient()}
            />
          </section>

          {/* FilePreview */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>FilePreview</h2>
            <div style={{ minHeight: '120px', display: 'flex', alignItems: 'flex-end' }}>
              <FilePreview
                previewFiles={previewFiles}
                removeFile={(id, mediumID) => setPreviewFiles((prev) => prev.filter((f) => f.id !== id))}
                allowRemove={true}
              />
            </div>
          </section>

          {/* MediaWidget */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>MediaWidget</h2>
            <MediaWidget
              media={[
                {
                  mediumID: '1',
                  mimeType: 'image/jpeg',
                  url: 'https://picsum.photos/300/200',
                  title: 'Sample image',
                },
                {
                  mediumID: '2',
                  mimeType: 'text/html',
                  url: 'https://memori.ai',
                  title: 'Link',
                },
              ]}
              apiUrl="https://backend.memori.ai"
            />
          </section>

          {/* MediaItemWidget */}
          <section style={sectionStyle}>
            <h2 style={titleStyle}>MediaItemWidget</h2>
            <MediaItemWidget
              items={[
                {
                  mediumID: '1',
                  mimeType: 'image/jpeg',
                  url: 'https://picsum.photos/200',
                  title: 'Single media item',
                },
              ]}
              apiURL="https://backend.memori.ai"
            />
          </section>
        </div>
      </ArtifactProvider>
      </AlertProvider>
    </I18nWrapper>
  );
};

AllComponentsWithAllPropsEnabled.parameters = {
  layout: 'fullscreen',
};
