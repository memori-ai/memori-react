// Typings
import {
  DialogState,
  Memori,
  Integration,
  Venue,
  Message,
  Medium,
  OpenSession,
  MemoriConfig,
  TranslatedHint,
  Tenant,
  MemoriSession,
  User,
  ExpertReference,
  ResponseSpec,
  ChatLog,
} from '@memori.ai/memori-api-client/src/types';
import { ArtifactData } from '../MemoriArtifactSystem/types/artifact.types';
import { ArtifactAPIBridge } from '../MemoriArtifactSystem/utils/ArtifactAPI';

// Libraries
import React, {
  useState,
  useEffect,
  useCallback,
  CSSProperties,
  useRef,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import { AudioContext, IAudioContext } from 'standardized-audio-context';
import cx from 'classnames';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';

// Components
import PositionDrawer from '../PositionDrawer/PositionDrawer';
import MemoriAuth from '../Auth/Auth';
import Chat, { Props as ChatProps } from '../Chat/Chat';
import StartPanel, { Props as StartPanelProps } from '../StartPanel/StartPanel';
import Avatar, { Props as AvatarProps } from '../Avatar/Avatar';
import Header, { Props as HeaderProps } from '../Header/Header';
import PoweredBy from '../PoweredBy/PoweredBy';
import AgeVerificationModal from '../AgeVerificationModal/AgeVerificationModal';
import SettingsDrawer from '../SettingsDrawer/SettingsDrawer';
import KnownFacts from '../KnownFacts/KnownFacts';
import ExpertsDrawer from '../ExpertsDrawer/ExpertsDrawer';
import LoginDrawer from '../LoginDrawer/LoginDrawer';
import Button from '../ui/Button';
import CloseIcon from '../icons/Close';

// Layout
import FullPageLayout from '../layouts/FullPage';
import TotemLayout from '../layouts/Totem';
import ChatLayout from '../layouts/Chat';
import WebsiteAssistantLayout from '../layouts/WebsiteAssistant';
import HiddenChatLayout from '../layouts/HiddenChat';
import ZoomedFullBodyLayout from '../layouts/ZoomedFullBody';

// Helpers / Utils
import { getTranslation } from '../../helpers/translations';
import {
  setLocalConfig,
  getLocalConfig,
  removeLocalConfig,
} from '../../helpers/configuration';
import {
  hasTouchscreen,
  stripDuplicates,
  installMathJax,
  stripReasoningTags,
} from '../../helpers/utils';
import { getTTSVoice } from '../../helpers/tts/ttsVoiceUtility';
import {
  allowedMediaTypes,
  anonTag,
  uiLanguages,
} from '../../helpers/constants';
import { getErrori18nKey } from '../../helpers/error';
import { getCredits } from '../../helpers/credits';
import { useViseme } from '../../context/visemeContext';
import { sanitizeText } from '../../helpers/sanitizer';
import { TTSConfig, useTTS } from '../../helpers/tts/useTTS';
import ChatHistoryDrawer from '../ChatHistoryDrawer/ChatHistory';
import { STTConfig, useSTT } from '../../helpers/stt/useSTT';

// Widget utilities and helpers
const getMemoriState = (integrationId?: string): object | null => {
  let widget = integrationId
    ? document.querySelector(
        `.memori-widget[data-memori-integration="${integrationId}"]`
      ) ||
      document
        .querySelector('memori-client')
        ?.shadowRoot?.querySelector(`.memori-widget[data-memori-integration]`)
    : document.querySelector('.memori-widget') ||
      document
        .querySelector('memori-client')
        ?.shadowRoot?.querySelector('.memori-widget');

  if (!widget) return null;

  let engineState = (widget as HTMLElement).dataset?.memoriEngineState;
  if (!engineState) return null;

  let dialogState = JSON.parse(engineState);

  let loginToken = getLocalConfig<string | undefined>('loginToken', undefined);

  return {
    ...dialogState,
    loginToken,
  };
};

type MemoriTextEnteredEvent = CustomEvent<{
  text: string;
  waitForPrevious?: boolean;
  hidden?: boolean;
  typingText?: string;
  useLoaderTextAsMsg?: boolean;
  hasBatchQueued?: boolean;
}>;

/**
 * Dispatches a MemoriTextEntered event to simulate a user typing a message
 * @param message The text message to send
 * @param waitForPrevious Whether to wait for previous message to finish before sending (default true)
 * @param hidden Whether to hide the message from chat history (default false)
 * @param typingText Optional custom typing indicator text
 * @param useLoaderTextAsMsg Whether to use the loader text as the message (default false)
 * @param hasBatchQueued Whether there are more messages queued to be sent (default false)
 */
const typeMessage = (
  message: string,
  waitForPrevious = true,
  hidden = false,
  typingText?: string,
  useLoaderTextAsMsg = false,
  hasBatchQueued = false
) => {
  const e: MemoriTextEnteredEvent = new CustomEvent('MemoriTextEntered', {
    detail: {
      text: message,
      waitForPrevious,
      hidden,
      typingText,
      useLoaderTextAsMsg,
      hasBatchQueued,
    },
  });
  document.dispatchEvent(e);

  // Special handling for Safari on iOS devices
  const isSafariIOS =
    window.navigator.userAgent.includes('Safari') &&
    !window.navigator.userAgent.includes('Chrome') &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isSafariIOS) {
    // Dispatch end speak event after short delay for iOS Safari
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('MemoriEndSpeak'));
    }, 300);
  }
};

/**
 * Helper function to send a hidden message
 * Wraps typeMessage with hidden=true and passes through other params
 */
const typeMessageHidden = (
  message: string,
  waitForPrevious = true,
  typingText?: string,
  useLoaderTextAsMsg = false,
  hasBatchQueued = false
) =>
  typeMessage(
    message,
    waitForPrevious,
    true,
    typingText,
    useLoaderTextAsMsg,
    hasBatchQueued
  );

const typeBatchMessages = (
  messages: {
    message: string;
    waitForPrevious?: boolean;
    hidden?: boolean;
    typingText?: string;
    useLoaderTextAsMsg?: boolean;
  }[]
) => {
  function disableInputs() {
    document
      .querySelector('fieldset#chat-fieldset')
      ?.setAttribute('disabled', '');

    const styles = `opacity: 0.5; touch-action: none; pointer-events: none;`;
    document
      .querySelector('textarea.memori-chat-textarea--input')
      ?.setAttribute('style', styles);
    document
      .querySelector('button.memori-chat-inputs--send')
      ?.setAttribute('style', styles);
    document
      .querySelector('button.memori-chat-inputs--mic')
      ?.setAttribute('style', styles);
  }

  function reEnableInputs() {
    document
      .querySelector('fieldset#chat-fieldset')
      ?.removeAttribute('disabled');

    document
      .querySelector('textarea.memori-chat-textarea--input')
      ?.removeAttribute('style');
    document
      .querySelector('button.memori-chat-inputs--send')
      ?.removeAttribute('style');
    document
      .querySelector('button.memori-chat-inputs--mic')
      ?.removeAttribute('style');
  }

  function areInputsDisabled() {
    return !!document
      .querySelector('fieldset#chat-fieldset')
      ?.hasAttribute('disabled');
  }

  const isSafariIOS =
    window.navigator.userAgent.includes('Safari') &&
    !window.navigator.userAgent.includes('Chrome') &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const stepsGenerator = (function* () {
    yield* messages;
  })();

  disableInputs();

  const submitNewMessage = () => {
    const next = stepsGenerator.next();
    const step = next.value;

    if (step) {
      if (!areInputsDisabled()) {
        disableInputs();
      }

      let waitForPrevious = step.waitForPrevious;
      if (isSafariIOS) waitForPrevious = false;

      typeMessage(
        step.message,
        waitForPrevious,
        step.hidden,
        step.typingText,
        step.useLoaderTextAsMsg,
        !next.done
      );

      if (isSafariIOS) {
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('MemoriEndSpeak'));
          reEnableInputs();
        }, 3000);
      }
    } else if (areInputsDisabled()) {
      reEnableInputs();
    }

    if (next.done) {
      document.removeEventListener('MemoriEndSpeak', submitNewMessage);
      if (areInputsDisabled()) reEnableInputs();
      return;
    }
  };

  document.addEventListener('MemoriEndSpeak', submitNewMessage);

  submitNewMessage();
};

type MemoriNewDialogStateEvent = CustomEvent<DialogState>;

type ArtifactCreatedEvent = CustomEvent<{
  artifact: ArtifactData;
  message: Message;
}>;

interface CustomEventMap {
  MemoriTextEntered: MemoriTextEnteredEvent;
  MemoriEndSpeak: CustomEvent;
  MemoriResetUIEffects: CustomEvent;
  MemoriNewDialogState: MemoriNewDialogStateEvent;
  artifactCreated: ArtifactCreatedEvent;
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }

  interface Window {
    getMemoriState: typeof getMemoriState;
    typeMessage: typeof typeMessage;
    typeMessageHidden: typeof typeMessageHidden;
    typeBatchMessages: typeof typeBatchMessages;
    MemoriArtifactAPI?: {
      openArtifact: (artifact: ArtifactData) => void;
      createAndOpenArtifact: (
        content: string,
        mimeType?: string,
        title?: string
      ) => void;
      createFromOutputElement: (outputElement: HTMLOutputElement) => string;
      closeArtifact: () => void;
      toggleFullscreen: () => void;
      getState: () => {
        currentArtifact: ArtifactData | null;
        isDrawerOpen: boolean;
        isFullscreen: boolean;
      };
    };
  }
}
window.getMemoriState = getMemoriState;
window.typeMessage = typeMessage;
window.typeMessageHidden = typeMessageHidden;
window.typeBatchMessages = typeBatchMessages;

let audioContext: IAudioContext;

let memoriPassword: string | undefined;
let userToken: string | undefined;

export interface LayoutProps {
  Header?: typeof Header;
  headerProps?: HeaderProps;
  Avatar: typeof Avatar;
  avatarProps?: AvatarProps;
  Chat?: typeof Chat;
  chatProps?: ChatProps;
  StartPanel: typeof StartPanel;
  startPanelProps?: StartPanelProps;
  integrationStyle?: JSX.Element | null;
  integrationBackground?: JSX.Element | null;
  poweredBy?: JSX.Element | null;
  sessionId?: string;
  hasUserActivatedSpeak?: boolean;
  showUpload?: boolean;
  loading?: boolean;
  autoStart?: boolean;
  onSidebarToggle?: (isOpen: boolean) => void;
}

export interface Props {
  memori: Memori;
  ownerUserName?: string | null;
  ownerUserID?: string | null;
  tenantID: string;
  memoriConfigs?: MemoriConfig[];
  memoriLang?: string;
  multilingual?: boolean;
  integration?: Integration;
  layout?:
    | 'DEFAULT'
    | 'FULLPAGE'
    | 'TOTEM'
    | 'CHAT'
    | 'WEBSITE_ASSISTANT'
    | 'HIDDEN_CHAT'
    | 'ZOOMED_FULL_BODY';
  customLayout?: React.FC<LayoutProps>;
  showShare?: boolean;
  showCopyButton?: boolean;
  showTranslationOriginal?: boolean;
  showInputs?: boolean;
  showDates?: boolean;
  showContextPerLine?: boolean;
  showSettings?: boolean;
  showClear?: boolean;
  showOnlyLastMessages?: boolean;
  showTypingText?: boolean;
  showLogin?: boolean;
  showUpload?: boolean;
  showChatHistory?: boolean;
  showReasoning?: boolean;
  preview?: boolean;
  embed?: boolean;
  height?: number | string;
  secret?: string;
  baseUrl?: string;
  apiURL?: string;
  engineURL?: string;
  initialContextVars?: { [key: string]: string };
  initialQuestion?: string;
  ogImage?: string;
  sessionID?: string;
  tenant?: Tenant;
  personification?: {
    name?: string;
    tag: string;
    pin: string;
  };
  ttsProvider?: 'azure' | 'openai';
  enableAudio?: boolean;
  defaultSpeakerActive?: boolean;
  disableTextEnteredEvents?: boolean;
  onStateChange?: (state?: DialogState) => void;
  additionalInfo?: OpenSession['additionalInfo'] & { [key: string]: string };
  customMediaRenderer?: ChatProps['customMediaRenderer'];
  additionalSettings?: JSX.Element | null;
  userAvatar?: string | JSX.Element;
  useMathFormatting?: boolean;
  autoStart?: boolean;
  applyVarsToRoot?: boolean;
  showFunctionCache?: boolean;
  authToken?: string;
  __WEBCOMPONENT__?: boolean;
}

const MemoriWidget = ({
  memori,
  memoriConfigs,
  ownerUserID,
  ownerUserName,
  tenantID,
  memoriLang,
  multilingual,
  integration,
  layout,
  customLayout,
  showShare,
  preview = false,
  embed = false,
  showCopyButton = true,
  showTranslationOriginal = false,
  showInputs = true,
  showDates = false,
  showContextPerLine = false,
  showSettings,
  showTypingText = false,
  showClear = false,
  showLogin = false,
  showUpload,
  showOnlyLastMessages,
  showChatHistory,
  showReasoning,
  height = '100vh',
  secret,
  baseUrl = 'https://aisuru-staging.aclambda.online',
  apiURL = 'https://backend-staging.memori.ai',
  engineURL = 'https://engine-staging.memori.ai',
  initialContextVars,
  initialQuestion,
  ttsProvider,
  ogImage,
  sessionID: initialSessionID,
  tenant,
  personification,
  authToken,
  enableAudio,
  defaultSpeakerActive = true,
  disableTextEnteredEvents = false,
  onStateChange,
  additionalInfo,
  additionalSettings,
  customMediaRenderer,
  userAvatar,
  __WEBCOMPONENT__ = false,
  useMathFormatting = false,
  autoStart = false,
  applyVarsToRoot = false,
  showFunctionCache = false,
}: Props) => {
  const { t, i18n } = useTranslation();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // API calls methods
  const client = memoriApiClient(apiURL, engineURL);
  const {
    initSession,
    deleteSession,
    postTextEnteredEvent,
    postPlaceChangedEvent,
    postDateChangedEvent,
    postTimeoutEvent,
    postTagChangedEvent,
    getSession,
    getExpertReferences,
    getSessionChatLogs,
  } = client;

  const [instruct, setInstruct] = useState(false);
  const [enableFocusChatInput, setEnableFocusChatInput] = useState(true);

  const [loginToken, setLoginToken] = useState<string | undefined>(
    additionalInfo?.loginToken ?? authToken
  );
  const [user, setUser] = useState<User | undefined>({
    avatarURL: typeof userAvatar === 'string' ? userAvatar : undefined,
  } as User);
  useEffect(() => {
    if (
      loginToken &&
      !user?.userID &&
      (showLogin || memori.requireLoginToken)
    ) {
      client.backend
        .pwlGetCurrentUser(loginToken)
        .then(({ user, resultCode }) => {
          if (user && resultCode === 0) {
            setUser(user);
            setLocalConfig('loginToken', loginToken);

            if (!birthDate && user.birthDate) {
              setBirthDate(user.birthDate);
              setLocalConfig('birthDate', user.birthDate);
            }
          } else {
            removeLocalConfig('loginToken');
          }
        });
    }
  }, [loginToken, user?.userID]);
  const [showLoginDrawer, setShowLoginDrawer] = useState(false);

  const [clickedStart, setClickedStart] = useState(false);
  const [gotErrorInOpening, setGotErrorInOpening] = useState(false);

  const language =
    memori.culture?.split('-')?.[0]?.toUpperCase()! ||
    memoriConfigs
      ?.find(c => c.memoriConfigID === memori.memoriConfigurationID)
      ?.culture?.split('-')?.[0]
      ?.toUpperCase()!;
  const integrationConfig = integration?.customData
    ? JSON.parse(integration.customData)
    : null;

  const isMultilanguageEnabled =
    multilingual !== undefined
      ? multilingual
      : !!integrationConfig?.multilanguage;
  const forcedTimeout = integrationConfig?.forcedTimeout as number | undefined;
  const [userLang, setUserLang] = useState(
    memoriLang ??
      integrationConfig?.lang ??
      language ??
      integrationConfig?.uiLang ??
      i18n.language ??
      'IT'
  );

  const applyMathFormatting =
    useMathFormatting !== undefined
      ? useMathFormatting
      : !!integrationConfig?.useMathFormatting;
  useEffect(() => {
    if (applyMathFormatting) installMathJax();
  }, [applyMathFormatting]);

  /**
   * Sets the language in the i18n instance
   */
  useEffect(() => {
    if (
      isMultilanguageEnabled &&
      userLang &&
      uiLanguages.includes(userLang.toLowerCase())
    ) {
      // @ts-ignore
      i18n.changeLanguage(userLang.toLowerCase());
    }
  }, [userLang]);

  const [loading, setLoading] = useState(false);
  const [memoriTyping, setMemoriTyping] = useState<boolean>(false);
  const [typingText, setTypingText] = useState<string>();

  const selectedLayout = layout || integrationConfig?.layout || 'DEFAULT';

  const defaultEnableAudio =
    enableAudio ?? integrationConfig?.enableAudio ?? true;

  const [hasUserActivatedListening, setHasUserActivatedListening] =
    useState(false);
  const [hasUserTypedMessage, setHasUserTypedMessage] = useState(false);
  const [showPositionDrawer, setShowPositionDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showChatHistoryDrawer, setShowChatHistoryDrawer] = useState(false);
  const [showKnownFactsDrawer, setShowKnownFactsDrawer] = useState(false);
  const [showExpertsDrawer, setShowExpertsDrawer] = useState(false);
  const [continuousSpeech, setContinuousSpeech] = useState(false);
  const [continuousSpeechTimeout, setContinuousSpeechTimeout] = useState(2);
  const [controlsPosition, setControlsPosition] = useState<'center' | 'bottom'>(
    'center'
  );

  const [enablePositionControls, setEnablePositionControls] = useState(false);
  const [avatarType, setAvatarType] = useState<'blob' | 'avatar3d' | null>(
    null
  );
  const [hideEmissions, setHideEmissions] = useState(false);

  const speechSynthesizerRef = useRef<any | null>(null);
  const [memoriSpeaking, setMemoriSpeaking] = useState(false);

  useEffect(() => {
    setMemoriSpeaking(!!speechSynthesizerRef.current);
  }, [speechSynthesizerRef.current]);

  useEffect(() => {
    let defaultControlsPosition: 'center' | 'bottom' = 'bottom';
    let microphoneMode = getLocalConfig<string>(
      'microphoneMode',
      'HOLD_TO_TALK'
    );

    if (window.innerWidth <= 768) {
      // on mobile, default position is bottom
      defaultControlsPosition = 'bottom';
      // on mobile, keep only HOLD_TO_TALK mode
      microphoneMode = 'HOLD_TO_TALK';
    } else if (
      window.matchMedia('(orientation: portrait)').matches ||
      window.innerHeight > window.innerWidth
    ) {
      // on portrait, default position is center
      defaultControlsPosition = 'center';
    } else {
      // on landscape, default position is bottom
      defaultControlsPosition = 'bottom';
    }

    setContinuousSpeech(speakerMuted ? false : microphoneMode === 'CONTINUOUS');
    setContinuousSpeechTimeout(getLocalConfig('continuousSpeechTimeout', 2));
    setControlsPosition(
      getLocalConfig('controlsPosition', defaultControlsPosition)
    );
    setAvatarType(getLocalConfig('avatarType', 'avatar3d'));
    setHideEmissions(getLocalConfig('hideEmissions', false));

    if (!additionalInfo?.loginToken && !authToken) {
      setLoginToken(getLocalConfig<typeof loginToken>('loginToken', undefined));
      userToken = getLocalConfig<typeof loginToken>('loginToken', undefined);

      setBirthDate(getLocalConfig<string | undefined>('birthDate', undefined));
    }

    // If audio is disabled, automatically mute the speaker
    if (!(enableAudio ?? integrationConfig?.enableAudio ?? true)) {
      setLocalConfig('muteSpeaker', true);
    }
  }, []);

  // Effect to handle enableAudio changes
  useEffect(() => {
    const isAudioEnabled =
      enableAudio ?? integrationConfig?.enableAudio ?? true;
    if (!isAudioEnabled) {
      // Force mute when audio is disabled
      setLocalConfig('muteSpeaker', true);
    }
  }, [enableAudio, integrationConfig?.enableAudio]);

  /**
   * Auth for private and secret memori
   */
  const [memoriPwd, setMemoriPwd] = useState<string | undefined>(secret);
  const [memoriTokens, setMemoriTokens] = useState<string[] | undefined>();
  const [authModalState, setAuthModalState] = useState<
    null | 'password' | 'tokens'
  >(null);

  /**
   * Position drawer
   */
  const [position, _setPosition] = useState<Venue>();
  const applyPosition = async (venue?: Venue, sessionID?: string) => {
    const session = sessionID ?? sessionId;
    // Only apply position if memori.needsPosition is true
    if (venue && session && memori.needsPosition) {
      const { currentState, ...response } = await postPlaceChangedEvent({
        sessionId: session,
        placeName: venue.placeName,
        latitude: venue.latitude,
        longitude: venue.longitude,
        uncertaintyKm: venue.uncertainty ?? 0,
      });

      if (currentState && response.resultCode === 0) {
        _setCurrentDialogState(cds => ({
          ...cds,
          ...currentState,
          hints: currentState.hints?.length ? currentState.hints : cds?.hints,
        }));
      }
    }
  };

  const setPosition = (venue?: Venue) => {
    _setPosition(venue);
    applyPosition(venue);

    // Only save position to local config if memori.needsPosition is true
    if (venue && memori.needsPosition) {
      setLocalConfig('position', JSON.stringify(venue));
    } else if (!venue) {
      removeLocalConfig('position');
    }
  };

  useEffect(() => {
    // Only load position from local config if memori.needsPosition is true
    if (memori.needsPosition) {
      const position = getLocalConfig<Venue | undefined>('position', undefined);
      if (position) {
        _setPosition(position);
      }
    }
  }, [memori.needsPosition]);

  /**
   * History e gestione invio messaggi
   */
  const [userMessage, setUserMessage] = useState<string>('');
  const onChangeUserMessage = (value: string) => {
    if (!value || value === '\n' || value.trim() === '') {
      setUserMessage('');
      // resetInteractionTimeout();
      return;
    }
    setUserMessage(value);
    clearInteractionTimeout();
  };
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const pushMessage = (message: Message) => {
    setHistory(history => [
      ...history,
      {
        ...message,
        media:
          message.media?.filter(
            m =>
              !(m.mimeType === 'text/javascript' && !!m.properties?.executable)
          ) ?? [],
      },
    ]);
  };

  // When a user resumes a chat, we need to set the chat reference link of the previous chat
  const [chatLogID, setChatLogID] = useState<string | undefined>(undefined);
  /**
   * Sends a message to the Memori and handles the response
   * @param text The text message to send
   * @param media Optional media attachments
   * @param newSessionId Optional new session ID to use
   * @param translate Whether to translate the message before sending (default true)
   * @param translatedText Optional pre-translated text
   * @param hidden Whether to hide the message from chat history (default false)
   * @param typingText Optional custom typing indicator text
   * @param useLoaderTextAsMsg Whether to use the loader text as the message (default false)
   * @param hasBatchQueued Whether there are more messages queued to be sent (default false)
   */
  const sendMessage = async (
    text: string,
    media?: Medium[],
    newSessionId?: string,
    translate: boolean = true,
    translatedText?: string,
    hidden: boolean = false,
    typingText?: string,
    useLoaderTextAsMsg = false,
    hasBatchQueued = false
  ) => {
    // Get the session ID from params or global state
    const sessionID =
      newSessionId ||
      sessionId ||
      (window.getMemoriState() as MemoriSession)?.sessionID;
    if (!sessionID || !text?.length) return;

    // Add user message to chat history if not hidden
    if (!hidden)
      pushMessage({
        text: text,
        translatedText,
        fromUser: true,
        media: media ?? [],
        initial: sessionId
          ? !!newSessionId && newSessionId !== sessionId
          : !!newSessionId,
      });

    // Show typing indicator
    setMemoriTyping(true);
    setTypingText(typingText);

    let msg = text;
    let gotError = false;

    try {
      // Translate message if needed
      if (
        !hidden &&
        translate &&
        isMultilanguageEnabled &&
        userLang.toUpperCase() !== language.toUpperCase()
      ) {
        const translation = await getTranslation(
          text,
          language,
          userLang,
          baseUrl
        );
        msg = translation.text;
      }

      // Handle document attachments
      const mediaDocuments = media?.filter(
        m => (m as any).type === 'document' && m.properties?.isAttachedFile
      );
      if (mediaDocuments && mediaDocuments.length > 0) {
        const documentContents = mediaDocuments
          .map(doc => doc.content)
          .join(' ');
        msg = msg + ' ' + documentContents;
      }

      // Add chat reference link to the message if it exists
      // if (chatLogID) {
      //   msg =
      //     msg +
      //     ' \n\n' +
      //     '<chat-reference session-id="' +
      //     sessionID +
      //     '" event-log-id="' +
      //     chatLogID +
      //     '"></chat-reference>';
      // }

      const { currentState, ...response } = await postTextEnteredEvent({
        sessionId: sessionID,
        text: msg,
      });
      if (response.resultCode === 0 && currentState) {
        setChatLogID(undefined);
        const emission =
          useLoaderTextAsMsg && typingText
            ? typingText
            : currentState.emission ?? currentDialogState?.emission;

        if (
          userLang.toLowerCase() !== language.toLowerCase() &&
          emission &&
          isMultilanguageEnabled
        ) {
          currentState.emission = emission;

          translateDialogState(currentState, userLang, msg).then(ts => {
            let text = ts.translatedEmission || ts.emission;
            if (text && shouldPlayAudio(text)) {
              handleSpeak(text);
            }
          });
        } else {
          setCurrentDialogState({
            ...currentState,
            emission,
          });

          if (emission) {
            pushMessage({
              text: emission,
              emitter: currentState.emitter,
              media: currentState.emittedMedia ?? currentState.media,
              fromUser: false,
              questionAnswered: msg,
              generatedByAI: !!currentState.completion,
              contextVars: currentState.contextVars,
              date: currentState.currentDate,
              placeName: currentState.currentPlaceName,
              placeLatitude: currentState.currentLatitude,
              placeLongitude: currentState.currentLongitude,
              placeUncertaintyKm: currentState.currentUncertaintyKm,
              tag: currentState.currentTag,
              memoryTags: currentState.memoryTags,
            });
            if (emission && shouldPlayAudio(emission)) {
              handleSpeak(emission);
            }
          }
        }
      } else if (response.resultCode === 404) {
        // Handle expired session
        // remove last sent message, will set it as initial
        setHistory(h => [...h.slice(0, h.length - 1)]);

        reopenSession(
          true,
          memoriPwd || memori.secretToken,
          memoriTokens,
          undefined,
          undefined,
          {
            LANG: userLang,
            PATHNAME: window.location.pathname,
            ROUTE: window.location.pathname?.split('/')?.pop() || '',
            ...(initialContextVars || {}),
          },
          initialQuestion,
          undefined,
          undefined,
          undefined,
          undefined,
          true // isSessionExpired
        ).then(state => {
          console.info('session timeout');
          if (state?.sessionID) {
            setTimeout(() => {
              sendMessage(text, media, state?.sessionID);
            }, 500);
          }
        });
      }
    } catch (error) {
      console.error(error);
      gotError = true;

      setTypingText(undefined);
      setMemoriTyping(false);
    }

    if (!hasBatchQueued) {
      setTypingText(undefined);
      setMemoriTyping(false);
    }
  };

  /**
   * An enhanced version of translateDialogState that integrates smooth speaking
   * This preserves all your existing logic while improving speech reliability
   */
  const translateDialogState = async (
    state: DialogState,
    userLang: string,
    msg?: string,
    avoidPushingMessage: boolean = false
  ) => {
    // console.log('[TRANSLATE] Starting translation with params:', {
    //   state,
    //   userLang,
    //   msg
    // });

    const emission = state?.emission ?? currentDialogState?.emission;

    let translatedState = { ...state };
    let translatedMsg = null;

    // Skip translation if not needed
    if (
      !emission ||
      language.toUpperCase() === userLang.toUpperCase() ||
      !isMultilanguageEnabled ||
      avoidPushingMessage
    ) {
      // console.log('[TRANSLATE] Skipping translation - using original emission');
      translatedState = { ...state, emission };
      if (emission) {
        translatedMsg = {
          text: emission,
          emitter: state.emitter,
          media: state.emittedMedia ?? state.media,
          fromUser: false,
          questionAnswered: msg,
          contextVars: state.contextVars,
          date: state.currentDate,
          placeName: state.currentPlaceName,
          placeLatitude: state.currentLatitude,
          placeLongitude: state.currentLongitude,
          placeUncertaintyKm: state.currentUncertaintyKm,
          tag: state.currentTag,
          memoryTags: state.memoryTags,
        };
      }
    } else {
      try {
        // console.log('[TRANSLATE] Translating emission');
        const t = await getTranslation(emission, userLang, language, baseUrl);

        // Handle hints translation if present
        if (state.hints && state.hints.length > 0) {
          // console.log('[TRANSLATE] Translating hints');
          const translatedHints = await Promise.all(
            (state.hints ?? []).map(async hint => {
              const tHint = await getTranslation(
                hint,
                userLang,
                language,
                baseUrl
              );
              return {
                text: tHint?.text ?? hint,
                originalText: hint,
              } as TranslatedHint;
            })
          );
          translatedState = {
            ...state,
            emission: t.text,
            translatedHints,
          };
        } else {
          translatedState = {
            ...state,
            emission: emission,
            translatedEmission: t.text,
            hints:
              state.hints ??
              (state.state === 'G1' ? currentDialogState?.hints : []),
          };
        }

        if (t.text.length > 0) {
          // console.log('[TRANSLATE] Creating translated message');
          translatedMsg = {
            text: emission,
            translatedText: t.text,
            emitter: state.emitter,
            media: state.emittedMedia ?? state.media,
            fromUser: false,
            questionAnswered: msg,
            generatedByAI: !!state.completion,
            contextVars: state.contextVars,
            date: state.currentDate,
            placeName: state.currentPlaceName,
            placeLatitude: state.currentLatitude,
            placeLongitude: state.currentLongitude,
            placeUncertaintyKm: state.currentUncertaintyKm,
            tag: state.currentTag,
            memoryTags: state.memoryTags,
          };
        }
      } catch (error) {
        console.error('[TRANSLATE] Error during translation:', error);
        translatedState = { ...state, emission };
        translatedMsg = {
          text: emission,
          emitter: state.emitter,
          media: state.emittedMedia ?? state.media,
          fromUser: false,
          questionAnswered: msg,
          contextVars: state.contextVars,
          date: state.currentDate,
          placeName: state.currentPlaceName,
          placeLatitude: state.currentLatitude,
          placeLongitude: state.currentLongitude,
          placeUncertaintyKm: state.currentUncertaintyKm,
          tag: state.currentTag,
          memoryTags: state.memoryTags,
        };
      }
    }

    // console.log('[TRANSLATE] Setting translated state and message');
    setCurrentDialogState(translatedState);
    if (!avoidPushingMessage && translatedMsg) {
      // console.log('[TRANSLATE] Pushing translated message', translatedMsg);
      pushMessage(translatedMsg);
    }

    return translatedState;
  };

  /**
   * Age verification
   */
  const minAge =
    memori.ageRestriction !== undefined
      ? memori.ageRestriction
      : memori.nsfw
      ? 18
      : memori.enableCompletions
      ? 14
      : 0;
  const [birthDate, setBirthDate] = useState<string | undefined>();
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  const getCultureCodeByLanguage = (lang?: string): string => {
    let voice = '';
    let voiceLang = (
      lang ||
      memori.culture?.split('-')?.[0] ||
      i18n.language ||
      'IT'
    ).toUpperCase();
    switch (voiceLang) {
      case 'IT':
        voice = 'it-IT';
        break;
      case 'DE':
        voice = 'de-DE';
        break;
      case 'EN':
        voice = 'en-GB';
        break;
      case 'ES':
        voice = 'es-ES';
        break;
      case 'FR':
        voice = 'fr-FR';
        break;
      case 'PT':
        voice = 'pt-PT';
        break;
      case 'UK':
        voice = 'uk-UK';
        break;
      case 'RU':
        voice = 'ru-RU';
        break;
      case 'PL':
        voice = 'pl-PL';
        break;
      case 'FI':
        voice = 'fi-FI';
        break;
      case 'EL':
        voice = 'el-GR';
        break;
      case 'AR':
        voice = 'ar-SA';
        break;
      case 'ZH':
        voice = 'zh-CN';
        break;
      case 'JA':
        voice = 'ja-JP';
        break;
      default:
        voice = 'it-IT';
        break;
    }
    return voice;
  };

  /**
   * Sessione
   */
  const [sessionId, setSessionId] = useState<string | undefined>(
    initialSessionID
  );
  const [currentDialogState, _setCurrentDialogState] = useState<DialogState>();
  const setCurrentDialogState = (state?: DialogState) => {
    _setCurrentDialogState(state);
    if (onStateChange) {
      onStateChange(state);
    }

    const e: MemoriNewDialogStateEvent = new CustomEvent(
      'MemoriNewDialogState',
      {
        detail: state,
      }
    );
    document.dispatchEvent(e);

    const executableSnippets = (state?.emittedMedia ?? state?.media)?.filter(
      m => m.mimeType === 'text/javascript' && !!m.properties?.executable
    );
    executableSnippets?.forEach(s => {
      try {
        setTimeout(() => {
          console.log('snippet', s);
          // eslint-disable-next-line no-new-func
          new Function(s.content ?? '')();

          setTimeout(() => {
            document
              .querySelector('.memori-chat--content')
              ?.scrollTo(
                0,
                document.querySelector('.memori-chat--content')?.scrollHeight ??
                  0
              );
          }, 400);
        }, 1000);
      } catch (e) {
        console.warn(e);
      }
    });
  };

  useEffect(() => {
    if (initialSessionID) {
      setSessionId(initialSessionID);
      onClickStart(undefined, false, undefined, initialSessionID);
    }
  }, [initialSessionID]);

  /**
   * Opening Session
   */
  /**
   * Fetches a new session with the given parameters
   * @param params OpenSession parameters
   * @returns Promise resolving to dialog state and session ID if successful, void otherwise
   */
  const fetchSession = async (
    params: OpenSession
  ): Promise<
    | (ResponseSpec & {
        dialogState?: DialogState;
        sessionID: string;
      })
    | undefined
    | void
  > => {
    let storageBirthDate = getLocalConfig<string | undefined>(
      'birthDate',
      undefined
    );
    let userBirthDate = birthDate ?? params.birthDate ?? storageBirthDate;
    if (!userBirthDate && !!minAge) {
      setShowAgeVerification(true);
      return;
    }

    // Check if authentication is needed for private Memori
    if (
      memori.privacyType !== 'PUBLIC' &&
      !memori.secretToken &&
      !memoriPwd &&
      !memoriTokens
    ) {
      setAuthModalState('password');
      return;
    }

    setLoading(true);

    try {
      // Check for and set giver invitation if available
      // if (!memori.giverTag && !!memori.receivedInvitations?.length) {
      //   let giverInvitation = memori.receivedInvitations.find(
      //     (i: Invitation) => i.type === 'GIVER' && i.state === 'ACCEPTED'
      //   );

      //   if (giverInvitation) {x
      //     memori.giverTag = giverInvitation.tag;
      //     memori.giverPIN = giverInvitation.pin;
      //   }
      // }

      // Get referral URL
      let referral;
      try {
        referral = (() => {
          return window.location.href;
        })();
      } catch (err) {
        console.debug(err);
      }

      // Initialize session with parameters
      const session = await initSession({
        ...params,
        birthDate: userBirthDate,
        tag: params.tag ?? personification?.tag,
        pin: params.pin ?? personification?.pin,
        additionalInfo: {
          ...(params.additionalInfo || additionalInfo || {}),
          loginToken:
            userToken ??
            loginToken ??
            params.additionalInfo?.loginToken ??
            additionalInfo?.loginToken ??
            authToken,
          language: getCultureCodeByLanguage(userLang),
          referral: referral,
          timeZoneOffset: new Date().getTimezoneOffset().toString(),
        },
      });

      // Handle successful session creation
      if (
        session?.sessionID &&
        session?.currentState &&
        session.resultCode === 0
      ) {
        setSessionId(session.sessionID);

        // save giver state
        if (currentDialogState?.currentTag && memori.giverTag) {
          setInstruct(currentDialogState?.currentTag === memori.giverTag);
        } else {
          setInstruct(false);
        }

        if (position && memori.needsPosition)
          applyPosition(position, session.sessionID);

        setLoading(false);
        return {
          dialogState: session.currentState,
          sessionID: session.sessionID,
        } as any;
      }
      // Handle age restriction error
      else if (
        session?.resultMessage.startsWith('This Memori is aged restricted')
      ) {
        console.warn(session);
        toast.error(t('underageTwinSession', { age: minAge }));
        setGotErrorInOpening(true);
      }
      // Handle authentication error
      else if (session?.resultCode === 403) {
        setMemoriPwd(undefined);
        setAuthModalState('password');
        return session;
      }
      // Handle other errors
      else {
        console.warn(session);
        toast.error(
          tst => (
            <div>
              <p>{t(getErrori18nKey(session?.resultCode))}</p>
              <Button
                outlined
                padded={false}
                onClick={() => toast.dismiss(tst.id)}
                icon={<CloseIcon />}
              >
                {t('close')}
              </Button>
            </div>
          ),
          {
            duration: Infinity,
          }
        );
        setGotErrorInOpening(true);
        return session;
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Reopens an existing session with optional parameters
   * @param updateDialogState Whether to update dialog state
   * @param password Optional password for authentication
   * @param recoveryTokens Optional recovery tokens
   * @param tag Optional tag
   * @param pin Optional PIN
   * @param initialContextVars Optional initial context variables
   * @param initialQuestion Optional initial question
   * @param birthDate Optional birth date for age verification
   * @returns Promise resolving to dialog state and session ID if successful, null otherwise
   */
  const reopenSession = async (
    updateDialogState: boolean = false,
    password?: string,
    recoveryTokens?: string[],
    tag?: string,
    pin?: string,
    initialContextVars?: { [key: string]: string },
    initialQuestion?: string,
    birthDate?: string,
    additionalInfoProp?: { [key: string]: string | undefined },
    continueFromChatLogID?: string,
    continueFromSessionID?: string,
    isSessionExpired?: boolean
  ) => {

    // Set loading state while reopening session
    setLoading(true);

    // Get birth date from local storage if not provided
    let storageBirthDate = getLocalConfig<string | undefined>(
      'birthDate',
      undefined
    );
    let userBirthDate = birthDate ?? storageBirthDate;
    // console.log('[REOPEN_SESSION] Using birth date:', userBirthDate);

    try {
      // Show age verification if required and birth date not provided
      if (!userBirthDate && !!minAge) {
        // console.log('[REOPEN_SESSION] Age verification required, showing modal');
        setShowAgeVerification(true);
        return;
      }

      // Check if authentication is needed based on privacy type and credentials
      if (
        memori.privacyType !== 'PUBLIC' &&
        !password &&
        !memori.secretToken &&
        !memoriPwd &&
        !recoveryTokens &&
        !memoriTokens
      ) {
        // console.log('[REOPEN_SESSION] Authentication required, showing modal');
        setAuthModalState('password');
        return;
      }

      // Get current URL as referral
      let referral;
      try {
        referral = (() => {
          return window.location.href;
        })();
        // console.log('[REOPEN_SESSION] Got referral:', referral);
      } catch (err) {
        console.debug('[REOPEN_SESSION] Error getting referral:', err);
      }

      // Initialize session with provided parameters
      // console.log('[REOPEN_SESSION] Initializing session...');
      const { sessionID, currentState, ...response } = await initSession({
        memoriID: memori.engineMemoriID ?? '',
        password: password || memoriPwd || memori.secretToken,
        recoveryTokens: recoveryTokens || memoriTokens,
        tag: tag ?? personification?.tag,
        pin: pin ?? personification?.pin,
        continueFromChatLogID: continueFromChatLogID,
        continueFromSessionID: continueFromSessionID,
        initialContextVars: {
          LANG: userLang,
          PATHNAME: window.location.pathname,
          ROUTE: window.location.pathname?.split('/')?.pop() || '',
          ...(initialContextVars || {}),
        },
        initialQuestion,
        birthDate: userBirthDate,
        additionalInfo: {
          ...(additionalInfoProp || additionalInfo || {}),
          loginToken:
            userToken ??
            loginToken ??
            additionalInfoProp?.loginToken ??
            additionalInfo?.loginToken ??
            authToken,
          language: getCultureCodeByLanguage(userLang),
          referral: referral,
          timeZoneOffset: new Date().getTimezoneOffset().toString(),
        },
      });

      // Handle successful session initialization
      if (sessionID && currentState && response.resultCode === 0) {
        console.log('[REOPEN_SESSION] Session initialized successfully:', sessionID);
        setSessionId(sessionID);

        // Update dialog state and history if requested
        if (updateDialogState) {
          // console.log('[REOPEN_SESSION] Updating dialog state');
          setCurrentDialogState(currentState);

          if (currentState.emission) {
            console.log('[REOPEN_SESSION] Processing emission:', currentState.emission);
            // Determine initial status message based on context
            // Show status message only if session expired and there's existing history
            const initialStatus = isSessionExpired && history.length > 1
              ? 'Session Expired, reopening session'
              : (history.length <= 1 ? true : undefined);
            
            // Set initial message or append to existing history
            history.length <= 1
              ? setHistory([
                  {
                    text: currentState.emission,
                    emitter: currentState.emitter,
                    media: currentState.emittedMedia ?? currentState.media,
                    fromUser: false,
                    initial: (initialStatus === true ? true : (initialStatus || undefined)) as any,
                    contextVars: currentState.contextVars,
                    date: currentState.currentDate,
                    placeName: currentState.currentPlaceName,
                    placeLatitude: currentState.currentLatitude,
                    placeLongitude: currentState.currentLongitude,
                    placeUncertaintyKm: currentState.currentUncertaintyKm,
                    tag: currentState.currentTag,
                    memoryTags: currentState.memoryTags,
                  },
                ])
              : pushMessage({
                  text: currentState.emission,
                  emitter: currentState.emitter,
                  media: currentState.emittedMedia ?? currentState.media,
                  fromUser: false,
                  initial: (initialStatus === true ? true : (initialStatus || undefined)) as any,
                  contextVars: currentState.contextVars,
                  date: currentState.currentDate,
                  placeName: currentState.currentPlaceName,
                  placeLatitude: currentState.currentLatitude,
                  placeLongitude: currentState.currentLongitude,
                  placeUncertaintyKm: currentState.currentUncertaintyKm,
                  tag: currentState.currentTag,
                  memoryTags: currentState.memoryTags,
                });
          }
        }

        // Apply position and date settings if needed
        if (position && memori.needsPosition) {
          // console.log('[REOPEN_SESSION] Applying position');
          applyPosition(position, sessionID);
        }
        if (memori.needsDateTime) {
          // console.log('[REOPEN_SESSION] Sending date changed event');
          sendDateChangedEvent({ sessionID: sessionID, state: currentState });
        }

        setLoading(false);
        return {
          dialogState: currentState,
          sessionID,
        };
      }
      // Handle age restriction error
      else if (
        response?.resultMessage.startsWith('This Memori is aged restricted')
      ) {
        console.error('[REOPEN_SESSION] Age restriction error:', response);
        toast.error(t('underageTwinSession', { age: minAge }));
        setGotErrorInOpening(true);
      }
      // Handle authentication error
      else if (response?.resultCode === 403) {
        console.error('[REOPEN_SESSION] Authentication error');
        setMemoriPwd(undefined);
        setAuthModalState('password');
      }
      // Handle other errors
      else {
        console.error('[REOPEN_SESSION] Other error:', response);
        toast.error(t(getErrori18nKey(response.resultCode)));
        setGotErrorInOpening(true);
      }
    } catch (err) {
      console.error('[REOPEN_SESSION] Caught error:', err);
    }
    // Reset loading state
    setLoading(false);

    return null;
  };

  const changeTag = async (
    memoriId: string,
    sessionId: string,
    tag?: string,
    pin?: string
  ) => {
    if (!memoriId || !sessionId) {
      console.error('CHANGETAG/Session not found');
      return Promise.reject('Session not found');
    }

    try {
      const { currentState, resultCode } = await postTagChangedEvent(
        sessionId,
        tag ?? anonTag
      );

      if (resultCode === 0) {
        let textResult = 0;
        if (
          tag !== anonTag &&
          pin &&
          (currentState.state === 'X1a' || currentState.state === 'X1b')
        ) {
          const { resultCode: textResultCode } = await postTextEnteredEvent({
            sessionId,
            text: pin ?? '',
          });
          textResult = textResultCode;
        }

        if (textResult === 0) {
          const { currentState, ...response } = await getSession(sessionId);

          if (response.resultCode === 0 && !!currentState) {
            return {
              currentState,
              sessionId,
              ...response,
            };
          }
        } else if ([400, 401, 403, 404, 500].includes(resultCode)) {
          console.warn('[APPCONTEXT/CHANGETAG]', resultCode);
          let storageBirthDate = getLocalConfig<string | undefined>(
            'birthDate',
            undefined
          );

          let referral;
          try {
            referral = (() => {
              return window.location.href;
            })();
          } catch (err) {
            console.debug(err);
          }

          fetchSession({
            memoriID: memori.engineMemoriID ?? '',
            password: secret || memoriPwd || memori.secretToken,
            tag: tag ?? personification?.tag,
            pin: pin ?? personification?.pin,
            initialContextVars: {
              LANG: userLang,
              PATHNAME: window.location.pathname,
              ROUTE: window.location.pathname?.split('/')?.pop() || '',
              ...(initialContextVars || {}),
            },
            initialQuestion,
            birthDate: birthDate || storageBirthDate || undefined,
            additionalInfo: {
              ...(additionalInfo || {}),
              loginToken:
                userToken ??
                loginToken ??
                additionalInfo?.loginToken ??
                authToken,
              language: getCultureCodeByLanguage(userLang),
              referral: referral,
              timeZoneOffset: new Date().getTimezoneOffset().toString(),
            },
          });
        } else if (!!currentState) {
          return {
            currentState,
            sessionId,
            resultCode,
          };
        }
      }
    } catch (_e) {
      let err = _e as Error;
      console.warn('[APPCONTEXT/CHANGETAG]', err);
      return Promise.reject(err);
    }

    return null;
  };

  /**
   * Polling dates
   */
  const sendDateChangedEvent = useCallback(
    async ({
      sessionID,
      date,
      state,
    }: {
      sessionID?: string;
      date?: string;
      state?: DialogState;
    }) => {
      const session = sessionID ?? sessionId;
      const dialogState = state ?? currentDialogState;

      if (!session || !memori.needsDateTime || dialogState?.hints?.length) {
        return;
      }

      const now = (date ? DateTime.fromISO(date) : DateTime.now())
        .toUTC()
        .toFormat('yyyy/MM/dd HH:mm:ss ZZ')
        .split(':')
        .slice(0, -1)
        .join(':');

      const { currentState, ...response } = await postDateChangedEvent(
        session,
        now
      );

      if (response.resultCode === 0 && currentState) {
        _setCurrentDialogState(cds => ({
          ...cds,
          ...currentState,
          hints: currentState.hints?.length ? currentState.hints : cds?.hints,
        }));
      }
    },
    [currentDialogState, memori.needsDateTime, sessionId]
  );
  useEffect(() => {
    if (sessionId && memori.needsDateTime) {
      sendDateChangedEvent({ sessionID: sessionId, state: currentDialogState });

      let datePolling: NodeJS.Timeout | null = null;
      let isTabVisible = !document.hidden;

      const startDatePolling = () => {
        // stop the polling if it is already running
        if (datePolling) {
          clearInterval(datePolling);
        }
        // start the polling
        datePolling = setInterval(() => {
          if (!document.hidden) {
            sendDateChangedEvent({
              sessionID: sessionId,
            });
          }
        }, 60 * 1000); // 1 minute
      };

      const stopDatePolling = () => {
        if (datePolling) {
          clearInterval(datePolling);
          datePolling = null;
        }
      };

      const handleVisibilityChange = () => {
        const isVisible = !document.hidden;

        if (isVisible && !isTabVisible) {
          // Tab became visible - start polling and send immediate date event
          sendDateChangedEvent({
            sessionID: sessionId,
            state: currentDialogState,
          });
          startDatePolling();
        } else if (!isVisible && isTabVisible) {
          // Tab became hidden - stop polling
          stopDatePolling();
        }

        isTabVisible = isVisible;
      };

      // Start polling if tab is initially visible
      if (isTabVisible) {
        startDatePolling();
      }

      // Add visibility change listener
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        stopDatePolling();
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }
  }, [memori.needsDateTime, sessionId]);

  /**
   * Timeout conversazione
   */
  const [userInteractionTimeout, setUserInteractionTimeout] =
    useState<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const clearInteractionTimeout = () => {
    if (userInteractionTimeout) {
      clearTimeout(userInteractionTimeout);
      setUserInteractionTimeout(undefined);
    }
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };
  useEffect(() => {
    return () => {
      setHasUserActivatedSpeak(false);
      setClickedStart(false);
      clearInteractionTimeout();
      timeoutRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Speech recognition event handlers
   */
  const [requestedListening, setRequestedListening] = useState(false);
  const startListeningRef = useRef<(() => Promise<void>) | null>(null);

  // console.log('tenantID', tenantID);

  // Define TTS configuration
  const ttsConfig = useMemo(
    () => ({
      provider: ttsProvider,
      voice: getTTSVoice(
        userLang || memori.culture?.split('-')?.[0] || 'EN',
        ttsProvider,
        memori.voiceType as 'MALE' | 'FEMALE' | 'NEUTRAL'
      ),
      tenant: tenantID,
      region: 'westeurope',
      voiceType: memori.voiceType,
      layout: selectedLayout,
    }),
    [ttsProvider, userLang, memori.culture, memori.voiceType, selectedLayout]
  );

  const sttConfig = useMemo(
    () => ({
      provider: ttsProvider,
      language: getCultureCodeByLanguage(userLang),
      tenant: tenantID,
    }),
    [ttsProvider, userLang]
  );

  // Initialize TTS hook with basic options first
  const {
    speak: ttsSpeak,
    stop: ttsStop,
    isPlaying: isPlayingAudio,
    speakerMuted,
    toggleMute,
    hasUserActivatedSpeak,
    setHasUserActivatedSpeak,
  } = useTTS(
    ttsConfig as TTSConfig,
    {
      apiUrl: `${baseUrl}/api/tts`,
      continuousSpeech: continuousSpeech,
      preview: preview,
    },
    autoStart,
    defaultEnableAudio,
    defaultSpeakerActive ?? integrationConfig?.defaultSpeakerActive ?? true
  );

  // Helper function to check if audio should be played
  const shouldPlayAudio = (text?: string) => {
    const currentSpeakerMuted = getLocalConfig('muteSpeaker', false);
    console.log('[MemoriWidget] shouldPlayAudio', currentSpeakerMuted);
    return (
      text &&
      text.trim() &&
      !preview &&
      !currentSpeakerMuted &&
      defaultEnableAudio
    );
  };

  // Create a single, centralized function to process and send messages
  const processSpeechAndSendMessage = (text: string) => {
    // console.log('processSpeechAndSendMessage', text);
    // Skip if already processing or no text
    if (!text || text.trim().length === 0) {
      return;
    }

    try {
      // Process the text
      const message = stripDuplicates(text);
      console.debug('Processing speech message:', message);

      if (message.length > 0) {
        setUserMessage('');

        // Send the message
        console.debug('Sending message:', message);
        sendMessage(message);
      }
    } catch (error) {
      console.error('Error in processSpeechAndSendMessage:', error);
    }
  };

  const {
    isListening,

    // Actions
    startRecording,
    stopRecording,
  } = useSTT(
    sttConfig as STTConfig,
    processSpeechAndSendMessage,
    {
      apiUrl: `${baseUrl}/api/stt`,
      // continuousRecording: continuousSpeech,
      // silenceTimeout: continuousSpeechTimeout,
      // autoStart: autoStart,
    },
    defaultEnableAudio
  );

  /**
   * Enhanced handleSpeak that integrates with the improved useTTS hook
   * Uses promise-based approach for better reliability
   */
  const handleSpeak = async (text: string) => {
    if (!shouldPlayAudio(text)) {
      const e = new CustomEvent('MemoriEndSpeak');
      document.dispatchEvent(e);
      return Promise.resolve();
    }

    if (typeof stopRecording === 'function') {
      stopRecording();
    }

    // Reset the typing flag when Memori starts speaking
    setHasUserTypedMessage(false);

    const processedText = sanitizeText(text);
    return ttsSpeak(processedText);
  };
  /**
   * Integrated solution for translating dialog state and speaking
   * This uses promise chaining for reliable sequencing without timeouts
   */
  const translateAndSpeak = useCallback(
    async (
      dialogState: DialogState,
      language: string,
      msg?: string,
      skipEmission: boolean = false
    ) => {
      try {
        // First ensure we have a valid dialog state
        if (!dialogState) {
          return null;
        }

        // Then translate the dialog state
        const translatedState = await translateDialogState(
          dialogState,
          language,
          msg,
          skipEmission
        );

        // If we're not skipping emission and there's something to speak, speak it
        const textToSpeak =
          translatedState.translatedEmission || translatedState.emission;

        // Always set hasUserActivatedSpeak to true when we have a valid dialog state,
        // regardless of audio settings, so the chat can start properly
        if (!hasUserActivatedSpeak) {
          setHasUserActivatedSpeak(true);
        }

        if (textToSpeak && !skipEmission && shouldPlayAudio(textToSpeak)) {
          await handleSpeak(textToSpeak);
        }

        return translatedState;
      } catch (error) {
        console.error('Error in translateAndSpeak:', error);
        // Still update activation state even if there's an error
        if (!hasUserActivatedSpeak) {
          setHasUserActivatedSpeak(true);
        }
        return dialogState;
      }
    },
    [
      translateDialogState,
      handleSpeak,
      hasUserActivatedSpeak,
      setHasUserActivatedSpeak,
      speakerMuted,
    ]
  );

  const focusChatInput = () => {
    let textarea = document.querySelector(
      '#chat-fieldset textarea'
    ) as HTMLTextAreaElement | null;
    if (textarea && enableFocusChatInput) {
      textarea.focus();
    } else {
      textarea?.blur();
    }
  };

  /**
   * Focus on the chat input on mount
   */
  useEffect(() => {
    // focus on chat input disabled for totem layout
    if (selectedLayout !== 'TOTEM') {
      focusChatInput();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDialogState?.emission]);

  const resetUIEffects = () => {
    try {
      clearInteractionTimeout();
      setClickedStart(false);
      timeoutRef.current = undefined;
      ttsStop();
    } catch (e) {
      // console.log('Error: resetUIEffects', e);
    }
  };
  useEffect(() => {
    return () => {
      resetUIEffects();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    document.addEventListener('MemoriResetUIEffects', resetUIEffects);

    return () => {
      document.removeEventListener('MemoriResetUIEffects', resetUIEffects);
    };
  }, []);

  useEffect(() => {
    // if memori is speaking, don't start listening
    if (
      !isPlayingAudio &&
      continuousSpeech &&
      (hasUserActivatedListening || !requestedListening) &&
      sessionId &&
      !hasUserTypedMessage // Don't start recording if user has typed a message
    ) {
      startRecording();
    } else if (isPlayingAudio && isListening) {
      stopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayingAudio, hasUserActivatedListening, hasUserTypedMessage]);

  useEffect(() => {
    stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  /**
   * Textarea send mode handlers
   */
  const [sendOnEnter, setSendOnEnter] = useState<'keypress' | 'click'>(
    'keypress'
  );
  useEffect(() => {
    if (window.innerWidth <= 768 && hasTouchscreen()) setSendOnEnter('click');
    else setSendOnEnter('keypress');
  }, []);

  /**
   * Attachments
   */
  const [attachmentsMenuOpen, setAttachmentsMenuOpen] = useState<
    'link' | 'media'
  >();

  const globalBackground = integrationConfig?.globalBackground;
  const globalBackgroundUrl = globalBackground
    ? `url(${globalBackground})`
    : null;

  const integrationProperties = (
    integration
      ? {
          '--memori-chat-bubble-bg': '#fff',
          ...(integrationConfig && !instruct
            ? { '--memori-text-color': integrationConfig.textColor ?? '#000' }
            : {}),
          ...(integrationConfig?.buttonBgColor
            ? {
                '--memori-button-bg': integrationConfig.buttonBgColor,
                '--memori-primary': integrationConfig.buttonBgColor,
              }
            : {}),
          ...(integrationConfig?.buttonTextColor
            ? {
                '--memori-button-text': integrationConfig.buttonTextColor,
              }
            : {}),
          ...(integrationConfig?.blurBackground
            ? {
                '--memori-blur-background': '5px',
              }
            : {
                '--memori-blur-background': '0px',
              }),
          ...(integrationConfig?.innerBgColor
            ? {
                '--memori-inner-bg': `rgba(${
                  integrationConfig.innerBgColor === 'dark'
                    ? '0, 0, 0'
                    : '255, 255, 255'
                }, ${integrationConfig.innerBgAlpha ?? 0.4})`,
                '--memori-inner-content-pad': '1.5rem',
                '--memori-nav-bg-image': 'none',
                '--memori-nav-bg': `rgba(${
                  integrationConfig.innerBgColor === 'dark'
                    ? '0, 0, 0'
                    : '255, 255, 255'
                }, ${integrationConfig?.innerBgAlpha ?? 0.4})`,
              }
            : {
                '--memori-inner-content-pad': '0px',
              }),
        }
      : {}
  ) as CSSProperties;

  const integrationStylesheet = `
    ${
      preview ? '#preview, ' : applyVarsToRoot ? ':root, ' : ''
    }memori-client, .memori-widget, .memori-drawer, .memori-modal {
      ${Object.entries(integrationProperties)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
  `;

  const showAIicon =
    integrationConfig?.showAIicon === undefined
      ? true
      : integrationConfig?.showAIicon;

  const enableUpload = !!(showUpload ?? integrationConfig?.showUpload);

  const enableReasoning = !!(showReasoning ?? integrationConfig?.showReasoning);

  const showWhyThisAnswer =
    integrationConfig?.showWhyThisAnswer === undefined
      ? true
      : integrationConfig?.showWhyThisAnswer;

  // eslint-disable-next-line
  const [avatar3dVisible, setAvatar3dVisible] = useState(false);
  useEffect(() => {
    if (
      (window.innerWidth >= 768 && selectedLayout === 'FULLPAGE') ||
      selectedLayout !== 'FULLPAGE'
    ) {
      setAvatar3dVisible(true);
    }
  }, []);

  // Put SEO tags in head
  useEffect(() => {
    if (integrationConfig?.seoTitle) {
      let meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.setAttribute('content', integrationConfig.seoTitle);
      document.head.append(meta);
    }
    if (integrationConfig?.seoDescription) {
      let meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.setAttribute('content', integrationConfig.seoDescription);
      document.head.append(meta);
    }
    if (integrationConfig?.seoUrl) {
      let meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.setAttribute('content', integrationConfig.seoUrl);
      document.head.append(meta);
    }
    let image = ogImage || memori.avatarURL;
    if (integrationConfig?.seoImageShowAvatar && image) {
      let meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', image);
      document.head.append(meta);
    }
  }, [integrationConfig, memori.avatarURL, ogImage]);

  const simulateUserPrompt = (text: string, translatedText?: string) => {
    ttsStop();
    sendMessage(text, undefined, undefined, false, translatedText);
  };

  // listen to events from browser
  // to use in integrations or snippets
  const memoriTextEnteredHandler = useCallback(
    (e: MemoriTextEnteredEvent) => {
      if (disableTextEnteredEvents) {
        return;
      }

      const {
        text,
        waitForPrevious,
        hidden,
        typingText,
        useLoaderTextAsMsg,
        hasBatchQueued,
      } = e.detail;

      if (text) {
        // wait to finish reading previous emission
        if (
          waitForPrevious &&
          !speakerMuted &&
          (memoriSpeaking || !!memoriTyping)
        ) {
          setTimeout(() => {
            memoriTextEnteredHandler(e);
          }, 1000);
        } else {
          ttsStop();
          sendMessage(
            text,
            undefined,
            undefined,
            undefined,
            undefined,
            hidden,
            typingText,
            useLoaderTextAsMsg,
            hasBatchQueued
          );
        }
      }
    },
    [
      sessionId,
      isPlayingAudio,
      memoriTyping,
      userLang,
      disableTextEnteredEvents,
      speakerMuted,
    ]
  );
  useEffect(() => {
    if (!disableTextEnteredEvents) {
      document.addEventListener('MemoriTextEntered', memoriTextEnteredHandler);
    } else {
      document.removeEventListener(
        'MemoriTextEntered',
        memoriTextEnteredHandler
      );
    }

    return () => {
      document.removeEventListener(
        'MemoriTextEntered',
        memoriTextEnteredHandler
      );
    };
  }, [sessionId, userLang, disableTextEnteredEvents]);

  /**
   * Handles clicking the start button to begin or resume a session
   * @param session Optional existing session with dialog state and ID
   * @param initialSessionExpired Whether the initial session has expired
   /**
    * Handles clicking the start button to begin or resume a session
    * @param session Optional existing session with dialog state and ID
    * @param initialSessionExpired Whether the initial session has expired
    */
  const onClickStart = useCallback(
    async (
      session?: { dialogState: DialogState; sessionID: string },
      initialSessionExpired = false,
      chatLog?: ChatLog,
      targetSessionID?: string
    ) => {
      // console.log('[onClickStart] Starting with params:', {
      //   session,
      //   initialSessionExpired,
      //   chatLog
      // });

      const sessionID = chatLog ? undefined : session?.sessionID || sessionId;
      const dialogState = chatLog
        ? undefined
        : session?.dialogState || currentDialogState;
      setClickedStart(true);
      setHasUserTypedMessage(false); // Reset typing flag when starting a new session

      let translatedMessages: Message[] = [];

      // Get birth date from storage or props
      let storageBirthDate = getLocalConfig<string | undefined>(
        'birthDate',
        undefined
      );
      let birth = birthDate || storageBirthDate || user?.birthDate;
      if (!birth && autoStart && (initialSessionID || targetSessionID))
        birth = '1970-01-01T10:24:03.845Z';

      const localPosition = getLocalConfig<Venue | undefined>(
        'position',
        undefined
      );
      // Only check for position requirement if memori.needsPosition is true
      if (autoStart && !localPosition && memori.needsPosition) {
        setShowPositionDrawer(true);
        return;
      }

      // Handle age verification
      if (!sessionID && !!minAge && !birth) {
        setShowAgeVerification(true);
        setClickedStart(false);
      }
      // Handle authentication
      else if (
        (!sessionID &&
          memori.privacyType !== 'PUBLIC' &&
          !memori.secretToken &&
          !memoriPwd &&
          !memoriTokens) ||
        (!sessionID && gotErrorInOpening)
      ) {
        setAuthModalState('password');
        setClickedStart(false);
        return;
      }
      // Create new session if needed
      else if (!sessionID || initialSessionExpired) {
        setClickedStart(false);
        setGotErrorInOpening(false);
        const session = await fetchSession({
          memoriID: memori.engineMemoriID!,
          password: secret || memoriPwd || memori.secretToken,
          tag: personification?.tag,
          pin: personification?.pin,
          continueFromChatLogID: chatLog?.chatLogID,
          initialContextVars: {
            LANG: userLang,
            PATHNAME: window.location.pathname?.toUpperCase(),
            ROUTE:
              window.location.pathname?.split('/')?.pop()?.toUpperCase() || '',
            ...((!chatLog
              ? initialContextVars
              : chatLog.lines[chatLog.lines.length - 1].contextVars) || {}),
          },
          initialQuestion: chatLog ? undefined : initialQuestion,
          birthDate: birth,
          additionalInfo: {
            ...(additionalInfo || {}),
            loginToken:
              userToken ??
              loginToken ??
              additionalInfo?.loginToken ??
              authToken,
            language: getCultureCodeByLanguage(userLang),
            timeZoneOffset: new Date().getTimezoneOffset().toString(),
          },
        });

        if (session?.dialogState) {
          // reset history
          if (!chatLog) {
            setHistory([]);

            // Use translateAndSpeak which already handles the speaking
            await translateAndSpeak(session.dialogState, userLang);
            // No need for additional handleSpeak call since translateAndSpeak already handles it
            setHasUserActivatedSpeak(true);
          } else {
            const messages = chatLog.lines.map(
              (l, i) =>
                ({
                  text: l.text,
                  media: l.media
                    ?.filter(m => allowedMediaTypes.includes(m.mimeType))
                    ?.map(m => ({
                      mediumID: `${i}-${m.mimeType}`,
                      ...m,
                    })),
                  fromUser: l.inbound,
                  timestamp: l.timestamp,
                  emitter: l.emitter,
                  initial: i === 0,
                } as Message)
            );

            // we dont remove the last one as it is the current state
            translatedMessages = messages ?? [];
            if (
              language.toUpperCase() !== userLang.toUpperCase() &&
              isMultilanguageEnabled
            ) {
              try {
                translatedMessages = await Promise.all(
                  messages.map(async m => {
                    // If original text is present, the message is already translated
                    if ('originalText' in m && m.originalText) {
                      return m;
                    }
                    // Otherwise translate the message
                    return {
                      ...m,
                      originalText: m.text,
                      text: (
                        await getTranslation(
                          m.text,
                          userLang,
                          language,
                          baseUrl
                        )
                      ).text,
                    };
                  })
                );
              } catch (e) {
                console.error('[onClickStart] Error translating messages:', e);
              }
            }

            setHistory(translatedMessages);

            translateDialogState(
              session.dialogState,
              userLang,
              undefined,
              true
            ).finally(() => {
              setHasUserActivatedSpeak(true);
            });
          }
        } else if (session?.resultCode === 0) {
          await onClickStart((session as any) || undefined);
        } else {
          setLoading(false);
        }

        return;
      }
      // Handle initial session
      else if (initialSessionID || targetSessionID) {
        const sessionID = targetSessionID ?? initialSessionID;
        // check if session is valid and not expired
        const { currentState, ...response } = await getSession(sessionID!);

        if (response.resultCode !== 0 || !currentState) {
          const { chatLogs } = await getSessionChatLogs(sessionID!, sessionID!);
          setGotErrorInOpening(true);
          setSessionId(undefined);
          setClickedStart(false);
          await onClickStart(undefined, true, chatLogs?.[0]);
          return;
        }

        // reset history
        setHistory([]);

        // date and place events
        if (position && memori.needsPosition) {
          applyPosition(position, sessionID);
        }
        if (memori.needsDateTime) {
          sendDateChangedEvent({ sessionID: sessionID, state: currentState });
        }

        // Handle personification tag changes
        if (
          personification &&
          currentState.currentTag !== personification.tag
        ) {
          try {
            // reset tag
            await changeTag(memori.engineMemoriID!, sessionID!, '-');
            // change tag to receiver
            const session = await changeTag(
              memori.engineMemoriID!,
              sessionID!,
              personification.tag,
              personification.pin
            );

            if (session && session.resultCode === 0) {
              await translateAndSpeak(session.currentState, userLang);
            } else {
              throw new Error('No session');
            }
          } catch (e) {
            console.error('[onClickStart] Error changing tag:', e);
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              personification.tag,
              personification.pin,
              {
                LANG: userLang,
                PATHNAME: window.location.pathname?.toUpperCase(),
                ROUTE:
                  window.location.pathname?.split('/')?.pop()?.toUpperCase() ||
                  '',
                ...(initialContextVars || {}),
              },
              initialQuestion,
              birth
            ).then(() => {
              setHasUserActivatedSpeak(true);
            });
          }
        }
        // Handle anonymous tag changes
        else if (
          !personification &&
          currentState?.currentTag &&
          currentState?.currentTag !== anonTag &&
          currentState?.currentTag !== '-'
        ) {
          try {
            // reset tag
            await changeTag(memori.engineMemoriID!, sessionID!, '-');
            // change tag to anonymous
            const session = await changeTag(
              memori.engineMemoriID!,
              sessionID!,
              anonTag
            );

            if (session && session.resultCode === 0) {
              await translateAndSpeak(session.currentState, userLang);
            } else {
              throw new Error('No session');
            }
          } catch (e) {
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              undefined,
              undefined,
              {
                LANG: userLang,
                PATHNAME: window.location.pathname?.toUpperCase(),
                ROUTE:
                  window.location.pathname?.split('/')?.pop()?.toUpperCase() ||
                  '',
                ...(initialContextVars || {}),
              },
              initialQuestion,
              birth
            ).then(() => {
              setHasUserActivatedSpeak(true);
            });
          }
        }
        // No tag changes needed
        else {
          try {
            //This is the session id of the session that was opened before the current session
            const { chatLogs } = await getSessionChatLogs(
              sessionID!,
              sessionID!
            );

            const messages = chatLogs?.[0]?.lines.map(
              (l, i) =>
                ({
                  text: l.text,
                  media: l.media
                    ?.filter(m => allowedMediaTypes.includes(m.mimeType))
                    ?.map(m => ({
                      mediumID: `${i}-${m.mimeType}`,
                      ...m,
                    })),
                  fromUser: l.inbound,
                  timestamp: l.timestamp,
                  emitter: l.emitter,
                  initial: i === 0,
                } as Message)
            );

            // we dont remove the last one as it is the current state
            translatedMessages = messages ?? [];
            if (
              language.toUpperCase() !== userLang.toUpperCase() &&
              isMultilanguageEnabled
            ) {
              try {
                translatedMessages = await Promise.all(
                  messages.map(async m => ({
                    ...m,
                    originalText: m.text,
                    text: (
                      await getTranslation(m.text, userLang, language, baseUrl)
                    ).text,
                  }))
                );
              } catch (e) {
                console.error('[onClickStart] Error translating messages:', e);
              }
            }

            setHistory(translatedMessages);
          } catch (e) {
            console.error('[onClickStart] Error retrieving chat logs:', e);
          }

          if (
            (!!translatedMessages?.length && translatedMessages.length > 1) ||
            !initialQuestion
          ) {
            // we have a history, don't push message
            setHasUserActivatedSpeak(true);
            await translateAndSpeak(
              currentState,
              userLang,
              undefined,
              // if empty history, pick current state emission
              // otherwise, don't push message
              !!translatedMessages?.length
            );
          } else {
            console.log('[onClickStart] Starting with initial question');
            // remove default initial message
            translatedMessages = [];
            setHistory([]);

            setMemoriTyping(true);

            // we have no chat history, we start by initial question
            const response = await postTextEnteredEvent({
              sessionId: sessionID!,
              text: initialQuestion,
            });

            await translateAndSpeak(
              response.currentState ?? currentState,
              userLang,
              undefined,
              false
            );
          }
        }

        // date and place events
        if (position && memori.needsPosition) {
          applyPosition(position, sessionID);
        }
        if (memori.needsDateTime) {
          sendDateChangedEvent({ sessionID: sessionID, state: currentState });
        }
      }
      // Default case - just translate and activate
      else {
        // reset history
        setHistory([]);

        // everything is fine, just translate dialog state and activate chat
        await translateAndSpeak(dialogState!, userLang);
      }
    },
    [memoriPwd, memori, memoriTokens, birthDate, sessionId, userLang, position]
  );

  useEffect(() => {
    if (!clickedStart && autoStart && selectedLayout !== 'HIDDEN_CHAT') {
      onClickStart();
    }
  }, [clickedStart, autoStart, selectedLayout]);

  useEffect(() => {
    const targetNode =
      document.querySelector(`memori-client[memoriname="${memori.name}"]`) ||
      document.querySelector(`memori-client[memoriid="${memori.memoriID}"]`) ||
      document.querySelector('memori-client');
    if (!targetNode) {
      return;
    }

    const config = { attributes: true, childList: false, subtree: false };
    const callback: MutationCallback = (mutationList, _observer) => {
      for (const mutation of mutationList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName?.toLowerCase() === 'authtoken'
        ) {
          if (mutation.target.nodeName === 'MEMORI-CLIENT') {
            setLoginToken(
              // @ts-ignore
              mutation.target.getAttribute('authtoken') || undefined
            );
            // @ts-ignore
            userToken = mutation.target.getAttribute('authtoken') || undefined;
          } else {
            // @ts-ignore
            setLoginToken(
              mutation.target?.parentElement?.getAttribute('authtoken') ||
                undefined
            );
            // @ts-ignore
            userToken = mutation.target.getAttribute('authtoken') || undefined;
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    return () => {
      observer.disconnect();
    };
  }, []);

  /**
   * Experts references
   */
  const [experts, setExperts] = useState<ExpertReference[]>();
  const fetchExperts = useCallback(async () => {
    if (!sessionId || !memori?.enableBoardOfExperts) return;

    try {
      const { experts, count, ...resp } = await getExpertReferences(sessionId);

      if (resp.resultCode === 0) {
        setExperts(experts);
      } else {
        console.warn('Error fetching experts', resp);
      }
    } catch (err) {
      console.warn(err);
    }
  }, [sessionId, memori?.enableBoardOfExperts]);
  useEffect(() => {
    fetchExperts();
  }, [sessionId, fetchExperts]);

  const deepThoughtEnabled =
    memori.enableDeepThought &&
    !!loginToken &&
    !!user?.userID &&
    user?.pAndCUAccepted;

  // check if owner has enough credits
  const needsCredits = tenant?.billingDelegation;
  const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(true);
  const checkCredits = useCallback(async () => {
    if (!tenant?.billingDelegation) return;

    try {
      const resp = await getCredits({
        operation: deepThoughtEnabled
          ? 'dt_session_creation'
          : 'session_creation',
        baseUrl: baseUrl,
        userID: ownerUserID,
        userName: ownerUserName,
        tenant: tenantID,
      });

      if (resp.enough) {
        setHasEnoughCredits(true);
      } else {
        setHasEnoughCredits(false);
        console.warn('Not enough credits. Required:', resp.required);
      }
    } catch (e) {
      let err = e as Error;
      console.debug(err);
    }
  }, [tenant?.billingDelegation, deepThoughtEnabled]);
  useEffect(() => {
    if (tenant?.billingDelegation) {
      checkCredits();
    }
  }, [tenant?.billingDelegation, deepThoughtEnabled]);

  useEffect(() => {
    if (__WEBCOMPONENT__) return;

    const closeSession = () => {
      if (sessionId) {
        deleteSession(sessionId);
      }
    };

    // delete session when the user closes the browser tab
    window.addEventListener('beforeunload', closeSession);

    return () => {
      window.removeEventListener('beforeunload', closeSession);
      closeSession();
    };
  }, [sessionId]);

  const showFullHistory =
    showOnlyLastMessages === undefined
      ? selectedLayout !== 'TOTEM' && selectedLayout !== 'WEBSITE_ASSISTANT'
      : !showOnlyLastMessages;

  const headerProps: HeaderProps = {
    memori: {
      ...memori,
      ownerUserID: memori.ownerUserID ?? ownerUserID ?? undefined,
    },
    apiClient: client,
    tenant,
    history,
    showShare: showShare ?? integrationConfig?.showShare ?? true,
    position,
    layout: selectedLayout,
    additionalSettings,
    setShowPositionDrawer,
    setShowSettingsDrawer,
    setShowKnownFactsDrawer,
    setShowExpertsDrawer,
    enableAudio: defaultEnableAudio,
    speakerMuted: speakerMuted ?? false,
    setSpeakerMuted: (mute: boolean) => {
      toggleMute(mute);
    },
    setShowChatHistoryDrawer,
    showSettings: showSettings ?? integrationConfig?.showSettings ?? true,
    showChatHistory:
      showChatHistory ?? integrationConfig?.showChatHistory ?? true,
    hasUserActivatedSpeak,
    showReload: selectedLayout === 'TOTEM',
    showClear: showClear ?? integrationConfig?.showClear ?? false,
    clearHistory: () => setHistory(h => h.slice(-1)),
    showLogin:
      showLogin ?? integrationConfig?.showLogin ?? memori.requireLoginToken,
    setShowLoginDrawer,
    loginToken,
    user,
    sessionID: sessionId,
    baseUrl,
    onLogout: () => {
      if (!loginToken) return;

      client.backend.pwlUserLogout(loginToken).then(() => {
        setShowLoginDrawer(false);
        setUser(undefined);
        setLoginToken(undefined);
        userToken = undefined;
        removeLocalConfig('loginToken');
      });
    },
  };

  const avatarProps: AvatarProps = {
    memori,
    integration,
    integrationConfig,
    tenant,
    instruct,
    avatar3dVisible,
    setAvatar3dVisible,
    hasUserActivatedSpeak,
    isPlayingAudio:
      isPlayingAudio &&
      !speakerMuted &&
      (enableAudio ?? integrationConfig?.enableAudio ?? true),
    loading: !!memoriTyping,
    baseUrl,
    apiUrl: client.constants.BACKEND_URL,
    enablePositionControls,
    setEnablePositionControls,
    avatarType,
  };

  const startPanelProps: StartPanelProps = {
    memori,
    tenant: tenant,
    language: language,
    userLang: userLang,
    setUserLang: setUserLang,
    baseUrl: baseUrl,
    apiUrl: client.constants.BACKEND_URL,
    position: position,
    openPositionDrawer: () => setShowPositionDrawer(true),
    integrationConfig: integrationConfig,
    instruct: instruct,
    sessionId: sessionId,
    clickedStart: clickedStart,
    isMultilanguageEnabled: isMultilanguageEnabled,
    onClickStart: onClickStart,
    isUserLoggedIn: !!loginToken && !!user?.userID,
    hasInitialSession: !!initialSessionID,
    notEnoughCredits: needsCredits && !hasEnoughCredits,
    showLogin: showLogin ?? memori.requireLoginToken,
    setShowLoginDrawer,
    user,
  };

  const chatProps: ChatProps = {
    memori,
    sessionID: sessionId || '',
    tenant,
    translateTo:
      isMultilanguageEnabled &&
      userLang.toUpperCase() !==
        (
          memori.culture?.split('-')?.[0] ??
          i18n.language ??
          'IT'
        )?.toUpperCase()
        ? userLang
        : undefined,
    baseUrl,
    apiUrl: client.constants.BACKEND_URL,
    layout,
    memoriTyping,
    typingText,
    showTypingText:
      showTypingText ?? integrationConfig?.showTypingText ?? false,
    history: showFullHistory ? history : history.slice(-2),
    authToken:
      loginToken ?? userToken ?? additionalInfo?.loginToken ?? authToken,
    dialogState: currentDialogState,
    pushMessage,
    simulateUserPrompt,
    showDates,
    showContextPerLine,
    showAIicon,
    showUpload: enableUpload,
    showReasoning: enableReasoning,
    showWhyThisAnswer,
    showCopyButton: showCopyButton ?? integrationConfig?.showCopyButton ?? true,
    showTranslationOriginal:
      showTranslationOriginal ??
      integrationConfig?.showTranslationOriginal ??
      false,
    client,
    instruct,
    preview,
    sendOnEnter,
    setSendOnEnter,
    microphoneMode: continuousSpeech ? 'CONTINUOUS' : 'HOLD_TO_TALK',
    attachmentsMenuOpen,
    setAttachmentsMenuOpen,
    showInputs,
    showMicrophone:
      !!ttsProvider && (enableAudio ?? integrationConfig?.enableAudio ?? true),
    showFunctionCache,
    userMessage,
    onChangeUserMessage,
    sendMessage: (msg: string, media?: (Medium & { type: string })[]) => {
      ttsStop();
      stopRecording();
      setHasUserTypedMessage(true); // Mark that user has typed a message
      sendMessage(msg, media);
      setUserMessage('');
    },
    stopListening: stopRecording,
    startListening: () => {
      setHasUserTypedMessage(false); // Reset typing flag when user starts listening
      startRecording();
    },
    stopAudio: ttsStop,
    listening: isListening,
    setEnableFocusChatInput,
    isPlayingAudio,
    customMediaRenderer,
    user,
    userAvatar,
    experts,
    useMathFormatting: applyMathFormatting,
  };

  const integrationBackground =
    integration && globalBackgroundUrl ? (
      <div className="memori--global-background">
        <div
          className="memori--global-background-image"
          style={{ backgroundImage: globalBackgroundUrl }}
        />
      </div>
    ) : (
      <div className="memori--global-background no-background-image" />
    );

  const integrationStyle = integration ? (
    <style dangerouslySetInnerHTML={{ __html: integrationStylesheet }} />
  ) : null;

  const poweredBy = (
    <PoweredBy
      tenant={tenant}
      userLang={userLang}
      integrationID={integration?.integrationID}
      memoriHash={`${memori.ownerTenantName}-${memori.ownerUserName}-${memori.name}`}
    />
  );

  const Layout = customLayout
    ? customLayout
    : selectedLayout === 'TOTEM'
    ? TotemLayout
    : selectedLayout === 'CHAT'
    ? ChatLayout
    : selectedLayout === 'FULLPAGE'
    ? FullPageLayout
    : selectedLayout === 'WEBSITE_ASSISTANT'
    ? WebsiteAssistantLayout
    : selectedLayout === 'HIDDEN_CHAT'
    ? HiddenChatLayout
    : selectedLayout === 'ZOOMED_FULL_BODY'
    ? ZoomedFullBodyLayout
    : FullPageLayout;

  return (
    <div
      className={cx(
        'memori',
        'memori-widget',
        `memori-layout-${selectedLayout.toLowerCase()}`,
        `memori-controls-${controlsPosition.toLowerCase()}`,
        `memori--avatar-${integrationConfig?.avatar || 'default'}`,
        {
          'memori--auto-start': autoStart,
          'memori--preview': preview,
          'memori--embed': embed,
          'memori--with-integration': integration,
          'memori--with-speechkey': !!ttsProvider,
          'memori--active': hasUserActivatedSpeak,
          'memori--hide-emissions': hideEmissions,
          'memori--has-active-session': !!sessionId,
        }
      )}
      data-memori-name={memori?.name}
      data-memori-id={memori?.engineMemoriID}
      data-memori-secondary-id={memori?.memoriID}
      data-memori-session-id={sessionId}
      data-memori-integration={integration?.integrationID}
      data-memori-engine-state={JSON.stringify({
        ...currentDialogState,
        sessionID: sessionId,
      })}
      style={{ height }}
    >
      <Layout
        Header={Header}
        headerProps={headerProps}
        Avatar={Avatar}
        avatarProps={avatarProps}
        Chat={Chat}
        chatProps={chatProps}
        StartPanel={StartPanel}
        startPanelProps={startPanelProps}
        integrationStyle={integrationStyle}
        integrationBackground={integrationBackground}
        poweredBy={poweredBy}
        autoStart={autoStart}
        sessionId={sessionId}
        hasUserActivatedSpeak={hasUserActivatedSpeak}
        loading={loading}
      />

      <ArtifactAPIBridge
        pushMessage={(message: Message) => {
          setHistory(history => {
            if (!history.length) return history;
            const lastMessage = history[history.length - 1];
            if (!lastMessage || lastMessage.fromUser) return history;
            // Create a new message object with the updated text
            const updatedLastMessage = {
              ...lastMessage,
              text: lastMessage.text + message.text,
            };
            return [...history.slice(0, -1), updatedLastMessage];
          });
        }}
      />

      <audio
        id="memori-audio"
        style={{ display: 'none' }}
        src="https://aisuru.com/intro.mp3"
      />

      {isClient && (
        <MemoriAuth
          withModal
          pwdOrTokens={authModalState}
          openModal={!!authModalState}
          setPwdOrTokens={setAuthModalState}
          showTokens={memori.privacyType === 'SECRET'}
          onFinish={(values: any) => {
            if (values['password']) setMemoriPwd(values['password']);
            if (values['password']) memoriPassword = values['password'];
            if (values['tokens']) setMemoriTokens(values['tokens']);

            return reopenSession(
              !sessionId,
              values['password'],
              values['tokens'],
              personification?.tag,
              personification?.pin,
              {
                LANG: userLang,
                PATHNAME: window.location.pathname?.toUpperCase(),
                ROUTE:
                  window.location.pathname?.split('/')?.pop()?.toUpperCase() ||
                  '',
                ...(initialContextVars || {}),
              },
              initialQuestion,
              birthDate
            )
              .then(state => {
                if (!state?.sessionID) {
                  throw new Error('AUTH_FAILED');
                }

                setAuthModalState(null);
                // If we got a valid state from reopenSession, don't call onClickStart again
                // to avoid duplicate snippet execution
                if (state?.dialogState) {
                  setHasUserActivatedSpeak(true);
                } else {
                  // Only call onClickStart if reopenSession didn't return a valid state
                  onClickStart(state);
                }
              })
              .catch(error => {
                if (!(error instanceof Error) || error.message !== 'AUTH_FAILED') {
                  setGotErrorInOpening(true);
                }
                throw error;
              });
          }}
          minimumNumberOfRecoveryTokens={
            memori?.minimumNumberOfRecoveryTokens ?? 1
          }
        />
      )}

      {isClient && (
        <AgeVerificationModal
          visible={showAgeVerification}
          minAge={minAge}
          onClose={birthDate => {
            if (birthDate) {
              setBirthDate(birthDate);

              setLocalConfig('birthDate', birthDate);

              reopenSession(
                !sessionId,
                memoriPassword || memoriPwd || memori?.secretToken,
                memoriTokens,
                personification?.tag,
                personification?.pin,
                {
                  LANG: userLang,
                  PATHNAME: window.location.pathname?.toUpperCase(),
                  ROUTE:
                    window.location.pathname
                      ?.split('/')
                      ?.pop()
                      ?.toUpperCase() || '',
                  ...(initialContextVars || {}),
                },
                initialQuestion,
                birthDate
              )
                .then(state => {
                  setShowAgeVerification(false);
                  setAuthModalState(null);
                  onClickStart(state || undefined);
                })
                .catch(() => {
                  setShowAgeVerification(false);
                  setGotErrorInOpening(true);
                });
            } else {
              setShowAgeVerification(false);
              setClickedStart(false);
            }
          }}
        />
      )}

      {showSettingsDrawer && (
        <SettingsDrawer
          layout={selectedLayout}
          open={!!showSettingsDrawer}
          onClose={() => setShowSettingsDrawer(false)}
          microphoneMode={continuousSpeech ? 'CONTINUOUS' : 'HOLD_TO_TALK'}
          continuousSpeechTimeout={continuousSpeechTimeout}
          setMicrophoneMode={mode => setContinuousSpeech(mode === 'CONTINUOUS')}
          setContinuousSpeechTimeout={setContinuousSpeechTimeout}
          controlsPosition={controlsPosition}
          setControlsPosition={setControlsPosition}
          hideEmissions={hideEmissions}
          setHideEmissions={setHideEmissions}
          avatarType={avatarType}
          setAvatarType={setAvatarType}
          enablePositionControls={enablePositionControls}
          setEnablePositionControls={setEnablePositionControls}
          isAvatar3d={!!integrationConfig?.avatarURL}
          additionalSettings={additionalSettings}
          speakerMuted={speakerMuted}
        />
      )}

      {showChatHistoryDrawer && (
        <ChatHistoryDrawer
          open={!!showChatHistoryDrawer}
          onClose={() => setShowChatHistoryDrawer(false)}
          resumeSession={chatLog => {
            setChatLogID(chatLog.chatLogID);
            onClickStart(undefined, false, chatLog);
            setShowChatHistoryDrawer(false);
          }}
          apiClient={client}
          sessionId={sessionId || ''}
          memori={memori}
          baseUrl={baseUrl}
          history={history}
          apiUrl={client.constants.BACKEND_URL}
          loginToken={loginToken}
          language={language}
          userLang={userLang}
          isMultilanguageEnabled={isMultilanguageEnabled}
        />
      )}

      {showPositionDrawer && (
        <PositionDrawer
          memori={memori}
          open={!!showPositionDrawer}
          venue={position}
          setVenue={setPosition}
          onClose={position => {
            if (position) applyPosition(position);
            setShowPositionDrawer(false);
            if (autoStart) {
              onClickStart();
            }
          }}
        />
      )}

      {showKnownFactsDrawer && sessionId && (
        <KnownFacts
          apiClient={client}
          memori={memori}
          sessionID={sessionId}
          visible={showKnownFactsDrawer}
          closeDrawer={() => setShowKnownFactsDrawer(false)}
        />
      )}

      {showExpertsDrawer && !!experts && (
        <ExpertsDrawer
          apiUrl={client.constants.BACKEND_URL}
          baseUrl={baseUrl}
          tenant={tenant}
          experts={experts}
          open={showExpertsDrawer}
          onClose={() => setShowExpertsDrawer(false)}
        />
      )}

      {showLoginDrawer && tenant?.name && (
        <LoginDrawer
          tenant={tenant}
          apiClient={client}
          open={!!showLoginDrawer}
          user={user}
          loginToken={loginToken}
          onClose={() => setShowLoginDrawer(false)}
          onLogin={(user, token) => {
            console.log('current session id', sessionId);
            //The user is logged in, so we need to set open a new session with the new token
            reopenSession(
              false,
              memoriPassword || memoriPwd || memori?.secretToken,
              [],
              personification?.tag,
              personification?.pin,
              {
                LANG: userLang,
                PATHNAME: window.location.pathname?.toUpperCase(),
                ROUTE:
                  window.location.pathname?.split('/')?.pop()?.toUpperCase() ||
                  '',
                ...(initialContextVars || {}),
              },
              initialQuestion,
              birthDate,
              { loginToken: token } as any,
              undefined,
              sessionId
            ).then(state => {
              setShowLoginDrawer(false);
              setUser(user);
              setLoginToken(token);
              userToken = token;
              setLocalConfig('loginToken', token);
              // Push a message with initial status to show status message when a new session is created after login
              if (state?.sessionID && state.sessionID !== sessionId && state?.dialogState) {
                // Push a message with initial status message showing successful login
                const username = user?.userName || 'User';
                pushMessage({
                  text: state.dialogState.emission || '',
                  emitter: state.dialogState.emitter,
                  media: state.dialogState.emittedMedia ?? state.dialogState.media ?? [],
                  fromUser: false,
                  initial: `${username} has successfully logged in` as any,
                  contextVars: state.dialogState.contextVars,
                  date: state.dialogState.currentDate,
                  placeName: state.dialogState.currentPlaceName,
                  placeLatitude: state.dialogState.currentLatitude,
                  placeLongitude: state.dialogState.currentLongitude,
                  placeUncertaintyKm: state.dialogState.currentUncertaintyKm,
                  tag: state.dialogState.currentTag,
                  memoryTags: state.dialogState.memoryTags,
                });
                // Update the dialog state so the UI reflects the new session
                setCurrentDialogState(state.dialogState);
              }
            });
          }}
          setUser={setUser}
          onLogout={() => {
            if (!loginToken) return;
            client.backend.pwlUserLogout(loginToken).then(() => {
              setShowLoginDrawer(false);
              setUser(undefined);
              setLoginToken(undefined);
              userToken = undefined;
              removeLocalConfig('loginToken');
            });
          }}
        />
      )}
    </div>
  );
};

export default MemoriWidget;
