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
} from '@memori.ai/memori-api-client/src/types';
import {
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechSynthesizer,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';

// Libraries
import React, {
  useState,
  useEffect,
  useCallback,
  CSSProperties,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import {
  AudioContext,
  IAudioBufferSourceNode,
  IAudioContext,
} from 'standardized-audio-context';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';
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

// Layout
import FullPageLayout from '../layouts/FullPage';
import TotemLayout from '../layouts/Totem';
import ChatLayout from '../layouts/Chat';
import WebsiteAssistantLayout from '../layouts/WebsiteAssistant';

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
  stripEmojis,
  escapeHTML,
  stripMarkdown,
  stripOutputTags,
  stripHTML,
  installMathJax,
} from '../../helpers/utils';
import {
  allowedMediaTypes,
  anonTag,
  uiLanguages,
} from '../../helpers/constants';
import { getErrori18nKey } from '../../helpers/error';
import { getCredits } from '../../helpers/credits';
import HiddenChatLayout from '../layouts/HiddenChat';
import ZoomedFullBodyLayout from '../layouts/ZoomedFullBody';
import { useViseme } from '../../context/visemeContext';

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
  return dialogState;
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

interface CustomEventMap {
  MemoriTextEntered: MemoriTextEnteredEvent;
  MemoriEndSpeak: CustomEvent;
  MemoriResetUIEffects: CustomEvent;
  MemoriNewDialogState: MemoriNewDialogStateEvent;
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
  }
}
window.getMemoriState = getMemoriState;
window.typeMessage = typeMessage;
window.typeMessageHidden = typeMessageHidden;
window.typeBatchMessages = typeBatchMessages;

// Global variables
let recognizer: SpeechRecognizer | null;
let speechConfig: SpeechConfig;
let speechSynthesizer: SpeechSynthesizer | null;
let audioDestination: SpeakerAudioDestination;
let audioContext: IAudioContext;

let memoriPassword: string | undefined;
let speakerMuted: boolean = false;
let memoriSpeaking: boolean = false;
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
  authToken?: string;
  AZURE_COGNITIVE_SERVICES_TTS_KEY?: string;
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
  showSettings = true,
  showTypingText = false,
  showClear = false,
  showLogin = false,
  showUpload,
  showOnlyLastMessages,
  height = '100vh',
  secret,
  baseUrl = 'https://aisuru.com',
  apiURL = 'https://backend.memori.ai',
  engineURL = 'https://engine.memori.ai',
  initialContextVars,
  initialQuestion,
  ogImage,
  sessionID: initialSessionID,
  tenant,
  personification,
  authToken,
  AZURE_COGNITIVE_SERVICES_TTS_KEY,
  enableAudio,
  defaultSpeakerActive = true,
  disableTextEnteredEvents = false,
  onStateChange,
  additionalInfo,
  additionalSettings,
  customMediaRenderer,
  userAvatar,
  useMathFormatting = false,
  autoStart = false,
  applyVarsToRoot = false,
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
    if (loginToken && !user?.userID && showLogin) {
      client.backend.getCurrentUser(loginToken).then(({ user, resultCode }) => {
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
    enableAudio ?? integrationConfig?.enableAudio ?? false;

  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);
  const [hasUserActivatedListening, setHasUserActivatedListening] =
    useState(false);
  const [showPositionDrawer, setShowPositionDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showKnownFactsDrawer, setShowKnownFactsDrawer] = useState(false);
  const [showExpertsDrawer, setShowExpertsDrawer] = useState(false);
  const [muteSpeaker, setMuteSpeaker] = useState(
    !defaultEnableAudio || !defaultSpeakerActive || autoStart
  );
  const [continuousSpeech, setContinuousSpeech] = useState(false);
  const [continuousSpeechTimeout, setContinuousSpeechTimeout] = useState(2);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [controlsPosition, setControlsPosition] = useState<'center' | 'bottom'>(
    'center'
  );

  const [enablePositionControls, setEnablePositionControls] = useState(false);
  const [avatarType, setAvatarType] = useState<'blob' | 'avatar3d' | null>(
    null
  );
  const [hideEmissions, setHideEmissions] = useState(false);

  const {
    startProcessing,
    setAudioContext,
    addViseme,
    stopProcessing,
    resetVisemeQueue,
  } = useViseme();

  useEffect(() => {
    memoriSpeaking = !!speechSynthesizer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechSynthesizer]);

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

    const muteSpeaker =
      autoStart ||
      getLocalConfig(
        'muteSpeaker',
        !defaultEnableAudio || !defaultSpeakerActive || autoStart
      );

    setMuteSpeaker(muteSpeaker);
    speakerMuted =
      autoStart ||
      getLocalConfig(
        'muteSpeaker',
        !defaultEnableAudio || !defaultSpeakerActive || autoStart
      );
    setContinuousSpeech(muteSpeaker ? false : microphoneMode === 'CONTINUOUS');
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
  }, []);

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
    if (venue && session) {
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

    if (venue) {
      setLocalConfig('position', JSON.stringify(venue));
    } else {
      removeLocalConfig('position');
    }
  };

  useEffect(() => {
    const position = getLocalConfig<Venue | undefined>('position', undefined);
    if (position) {
      _setPosition(position);
    }
  }, []);

  /**
   * History e gestione invio messaggi
   */
  const [userMessage, setUserMessage] = useState<string>('');
  const onChangeUserMessage = (value: string) => {
    if (!value || value === '\n' || value.trim() === '') {
      setUserMessage('');
      resetInteractionTimeout();
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

      if (media?.length && media[0]?.properties?.isAttachedFile) {
        msg = msg + ' ' + media[0].content;
      }

      const { currentState, ...response } = await postTextEnteredEvent({
        sessionId: sessionID,
        text: msg,
      });
      if (response.resultCode === 0 && currentState) {
        const emission =
          useLoaderTextAsMsg && typingText
            ? typingText
            : currentState.emission ?? currentDialogState?.emission;

        if (
          userLang.toLowerCase() !== language.toLowerCase() &&
          emission &&
          isMultilanguageEnabled
        ) {
          translateDialogState(currentState, userLang, msg).then(ts => {
            let text = ts.translatedEmission || ts.emission;
            if (text) {
              speak(text);
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
              media: currentState.media,
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
            speak(emission);
          }
        }
      } else if (response.resultCode === 404) {
        // Handle expired session
        // remove last sent message, will set it as initial
        setHistory(h => [...h.slice(0, h.length - 1)]);

        reopenSession(
          false,
          memoriPwd || memori.secretToken,
          memoriTokens,
          undefined,
          undefined,
          {
            PATHNAME: window.location.pathname,
            ROUTE: window.location.pathname?.split('/')?.pop() || '',
            ...(initialContextVars || {}),
          },
          initialQuestion
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
   * Traduzioni istantanee
   */
  /**
   * Translates the dialog state and message into the user's language if needed
   * @param state The current dialog state to translate
   * @param userLang The target language to translate to
   * @param msg Optional message that was answered
   * @returns The translated dialog state
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
          media: state.media,
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
            media: state.media,
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
          media: state.media,
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

    const executableSnippets = state?.media?.filter(
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
  ): Promise<{
    dialogState: DialogState;
    sessionID: string;
  } | void> => {
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

      //   if (giverInvitation) {
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
          ...(additionalInfo || {}),
          loginToken:
            userToken ?? loginToken ?? additionalInfo?.loginToken ?? authToken,
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
        setInstruct(currentDialogState?.currentTag === memori.giverTag);

        if (position) applyPosition(position, session.sessionID);

        setLoading(false);
        return {
          dialogState: session.currentState,
          sessionID: session.sessionID,
        } as { dialogState: DialogState; sessionID: string };
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
      }
      // Handle other errors
      else {
        console.warn(session);
        toast.error(t(getErrori18nKey(session?.resultCode)));
        setGotErrorInOpening(true);
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
    birthDate?: string
  ) => {
    // console.log('[REOPEN_SESSION] Starting reopenSession with params:', {
    //   updateDialogState,
    //   hasPassword: !!password,
    //   hasRecoveryTokens: !!recoveryTokens,
    //   tag,
    //   hasPin: !!pin,
    //   initialContextVars,
    //   initialQuestion,
    //   hasBirthDate: !!birthDate
    // });

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
        console.log('[REOPEN_SESSION] Got referral:', referral);
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
        initialContextVars: {
          PATHNAME: window.location.pathname,
          ROUTE: window.location.pathname?.split('/')?.pop() || '',
          ...(initialContextVars || {}),
        },
        initialQuestion,
        birthDate: userBirthDate,
        additionalInfo: {
          ...(additionalInfo || {}),
          loginToken:
            userToken ?? loginToken ?? additionalInfo?.loginToken ?? authToken,
          language: getCultureCodeByLanguage(userLang),
          referral: referral,
          timeZoneOffset: new Date().getTimezoneOffset().toString(),
        },
      });

      // Handle successful session initialization
      if (sessionID && currentState && response.resultCode === 0) {
        // console.log('[REOPEN_SESSION] Session initialized successfully:', sessionID);
        setSessionId(sessionID);

        // Update dialog state and history if requested
        if (updateDialogState) {
          // console.log('[REOPEN_SESSION] Updating dialog state');
          setCurrentDialogState(currentState);

          if (currentState.emission) {
            // console.log('[REOPEN_SESSION] Processing emission:', currentState.emission);
            // Set initial message or append to existing history
            history.length <= 1
              ? setHistory([
                  {
                    text: currentState.emission,
                    emitter: currentState.emitter,
                    media: currentState.media,
                    fromUser: false,
                    initial: true,
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
                  media: currentState.media,
                  fromUser: false,
                  initial: true,
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
        if (position) {
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

      let datePolling = setInterval(() => {
        sendDateChangedEvent({
          sessionID: sessionId,
        });
      }, 60 * 1000); // 1 minute

      return () => {
        clearInterval(datePolling);
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
  const resetInteractionTimeout = () => {
    clearInteractionTimeout();
    if (!isPlayingAudio && !userMessage.length && !memoriTyping && !listening)
      setInteractionTimeout();
  };
  const handleTimeout = async () => {
    if (
      !hasUserActivatedSpeak ||
      isPlayingAudio ||
      !!userMessage.length ||
      !!memoriTyping ||
      listening
    ) {
      resetInteractionTimeout();
      return;
    } else if (
      sessionId &&
      hasUserActivatedSpeak &&
      currentDialogState?.acceptsTimeout
    ) {
      const { currentState, ...response } = await postTimeoutEvent(sessionId);
      if (response.resultCode === 0 && currentState) {
        const emission = currentState.emission;
        if (
          isMultilanguageEnabled &&
          userLang !== i18n?.language &&
          emission &&
          emission.length > 0
        ) {
          translateDialogState(
            { ...currentState, emission: emission },
            userLang
          ).then(ts => {
            let text = ts.translatedEmission || ts.emission;
            if (text) {
              speak(text);
            }
          });
        } else if (emission && emission.length > 0) {
          pushMessage({
            text: emission,
            emitter: currentState.emitter,
            media: currentState.media,
            fromUser: false,
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
          speak(emission);
          setCurrentDialogState({
            ...currentState,
            hints:
              currentState.hints ??
              (currentState.state === 'G1' ? currentDialogState?.hints : []),
          });
        } else {
          resetInteractionTimeout();
          return;
        }
      }
    }
  };
  const setInteractionTimeout = () => {
    let timeout = currentDialogState?.timeout;
    if (!timeout) {
      let timeoutLimit = 40;
      let timeoutMinLimit = 25;
      timeout =
        Math.floor(Math.random() * (timeoutLimit - timeoutMinLimit)) +
        timeoutMinLimit;

      if (currentDialogState?.emission) {
        let readTime = currentDialogState.emission.length / 26.5;
        timeout = timeout + readTime;
      }
    }
    if (forcedTimeout) {
      timeout = forcedTimeout;

      if (currentDialogState?.emission) {
        let readTime = currentDialogState.emission.length / 26.5;
        timeout = timeout + readTime;
      }
    }

    let uiTimeout = setTimeout(handleTimeout, timeout * 1000);
    setUserInteractionTimeout(uiTimeout);
    timeoutRef.current = uiTimeout;
  };
  useEffect(() => {
    if (!!userMessage.length || isPlayingAudio || !!memoriTyping)
      clearInteractionTimeout();
    if (sessionId && !!!userMessage.length) resetInteractionTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentDialogState?.acceptsTimeout,
    currentDialogState?.timeout,
    currentDialogState?.state,
    isPlayingAudio,
    sessionId,
    history,
    userMessage,
    memoriTyping,
    hasUserActivatedSpeak,
  ]);
  useEffect(() => {
    return () => {
      setHasUserActivatedSpeak(false);
      setClickedStart(false);
      clearInteractionTimeout();
      timeoutRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeTTS = () => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) return;

    speechConfig = speechSdk.SpeechConfig.fromSubscription(
      AZURE_COGNITIVE_SERVICES_TTS_KEY,
      'westeurope'
    );

    speechConfig.speechSynthesisLanguage = getCultureCodeByLanguage(userLang);
    speechConfig.speechSynthesisVoiceName = getTTSVoice(userLang); // https://docs.microsoft.com/it-it/azure/cognitive-services/speech-service/language-support#text-to-speech
    speechConfig.speechRecognitionLanguage = getCultureCodeByLanguage(userLang);
    speechConfig.setProperty('speechSynthesis.outputFormat', 'viseme');

    if (hasTouchscreen())
      speechConfig.speechSynthesisOutputFormat =
        speechSdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    audioContext = new AudioContext();
    let buffer = audioContext.createBuffer(1, 10000, 22050);
    let source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    audioDestination = new speechSdk.SpeakerAudioDestination();
    let audioConfig = speechSdk.AudioConfig.fromSpeakerOutput(audioDestination);
    speechSynthesizer = new speechSdk.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );
  };

  const getTTSVoice = useCallback(
    (lang?: string): string => {
      let voice = '';
      let voiceLang = (
        lang ??
        memori.culture?.split('-')?.[0] ??
        i18n.language ??
        'IT'
      ).toUpperCase();

      let voiceType = memori.voiceType;
      if (memori.enableBoardOfExperts && currentDialogState?.emitter) {
        let expert = experts?.find(e => e.name === currentDialogState?.emitter);

        // TODO: once got info from backend, select voice from expert
        // if (expert?.voiceType) {
        //   voiceType = expert.voiceType;
        // }
      }

      // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
      switch (voiceLang) {
        case 'IT':
          voice = `${
            voiceType === 'MALE' ? 'it-IT-DiegoNeural' : 'it-IT-ElsaNeural'
          }`;
          break;
        case 'DE':
          voice = `${
            voiceType === 'MALE' ? 'de-DE-ConradNeural' : 'de-DE-KatjaNeural'
          }`;
          break;
        case 'EN':
          voice = `${
            voiceType === 'MALE' ? 'en-GB-RyanNeural' : 'en-GB-SoniaNeural'
          }`;
          break;
        case 'ES':
          voice = `${
            voiceType === 'MALE' ? 'es-ES-AlvaroNeural' : 'es-ES-ElviraNeural'
          }`;
          break;
        case 'FR':
          voice = `${
            voiceType === 'MALE' ? 'fr-FR-HenriNeural' : 'fr-FR-DeniseNeural'
          }`;
          break;
        case 'PT':
          voice = `${
            voiceType === 'MALE' ? 'pt-PT-DuarteNeural' : 'pt-PT-RaquelNeural'
          }`;
          break;
        case 'UK':
          voice = `${
            voiceType === 'MALE' ? 'uk-UA-OstapNeural' : 'uk-UA-PolinaNeural'
          }`;
          break;
        case 'RU':
          voice = `${
            voiceType === 'MALE' ? 'ru-RU-DmitryNeural' : 'ru-RU-SvetlanaNeural'
          }`;
          break;
        case 'PL':
          voice = `${
            voiceType === 'MALE' ? 'pl-PL-MarekNeural' : 'pl-PL-AgnieszkaNeural'
          }`;
          break;
        case 'FI':
          voice = `${
            voiceType === 'MALE' ? 'fi-FI-HarriNeural' : 'fi-FI-SelmaNeural'
          }`;
          break;
        case 'EL':
          voice = `${
            voiceType === 'MALE' ? 'el-GR-NestorasNeural' : 'el-GR-AthinaNeural'
          }`;
          break;
        case 'AR':
          voice = `${
            voiceType === 'MALE' ? 'ar-SA-HamedNeural' : 'ar-SA-ZariyahNeural'
          }`;
          break;
        case 'ZH':
          voice = `${
            voiceType === 'MALE' ? 'zh-CN-YunxiNeural' : 'zh-CN-XiaoxiaoNeural'
          }`;
          break;
        case 'JA':
          voice = `${
            voiceType === 'MALE' ? 'ja-JP-KeitaNeural' : 'ja-JP-NanamiNeural'
          }`;
          break;
        default:
          voice = `${
            voiceType === 'MALE' ? 'it-IT-DiegoNeural' : 'it-IT-IsabellaNeural'
          }`;
          break;
      }
      return voice;
    },
    [
      memori.voiceType,
      memori.enableBoardOfExperts,
      currentDialogState?.emitter,
      i18n.language,
      memori.culture,
    ]
  );

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

  const [phonemesMap, setPhonemesMap] = useState<{
    [ns: 'common' | string]: {
      [word: string]: {
        caseSensitive: boolean;
        default: string;
        it?: string;
        en?: string;
        fr?: string;
      };
    };
  }>();
  const fetchLexiconJSON = async () => {
    try {
      const lexiconReq = await fetch(
        `${baseUrl || 'https://aisuru.com'}/api/lexiconmap`
      );
      const lexicon = await lexiconReq.json();
      return lexicon;
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchLexiconJSON().then(lexicon => {
      setPhonemesMap(lexicon);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceTextWithPhonemes = (text: string, lang: string) => {
    if (!phonemesMap) return text;

    const phonemes = {
      ...(phonemesMap.common ?? {}),
      ...(tenant?.id && phonemesMap[tenant.id] ? phonemesMap[tenant.id] : {}),
    };
    const phonemesPairs = Object.keys(phonemes).map(word => {
      const phoneme =
        phonemes[word][lang.toLowerCase() as 'it' | 'en' | 'fr'] ??
        phonemes[word].default;
      return { word, phoneme, caseSensitive: phonemes[word].caseSensitive };
    });
    const ssmlText = phonemesPairs.reduce(
      (acc, { word, phoneme, caseSensitive }) => {
        return acc.replace(
          new RegExp(`\\b${word}\\b`, caseSensitive ? 'g' : 'gi'),
          `<phoneme alphabet="ipa" ph="${phoneme}">${word}</phoneme>`
        );
      },
      text
    );

    return ssmlText;

    // E.g.:
    // return text.replace(
    //   /martius/gi,
    //   `<phoneme alphabet="ipa" ph="ˈmaːrːtzius">Martius</phoneme>`,
    // )
    // .replace(
    //   /rawmaterial/gi,
    //   `<phoneme alphabet="ipa" ph="ˈpippo">RawMaterial</phoneme>`,
    // )
    // .replace(/qfe/gi, `<sub alias="Quota Filo Erba">QFE</sub>`)
  };

  const emitEndSpeakEvent = () => {
    const e = new CustomEvent('MemoriEndSpeak');
    document.dispatchEvent(e);
  };

  const speak = (text: string): void => {
    console.debug('speak called with text:', text);

    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY || preview) {
      console.debug('No TTS key or preview mode, emitting end speak event');
      emitEndSpeakEvent();
      return;
    }

    stopListening();

    if (preview) return;

    if (speakerMuted) {
      memoriSpeaking = false;
      setMemoriTyping(false);

      emitEndSpeakEvent();

      // trigger start continuous listening if set, see MemoriChat
      if (continuousSpeech) {
        setListeningTimeout();
      }
      return;
    }

    if (audioDestination) audioDestination.pause();

    let isSafari =
      window.navigator.userAgent.includes('Safari') &&
      !window.navigator.userAgent.includes('Chrome');
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if ((audioContext.state as string) === 'interrupted') {
      audioContext.resume().then(() => speak(text));
      return;
    }
    if (audioContext.state === 'closed') {
      audioContext = new AudioContext();
      let buffer = audioContext.createBuffer(1, 10000, 22050);
      let source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
    } else if (audioContext.state === 'suspended') {
      stopAudio();

      audioContext = new AudioContext();
      let buffer = audioContext.createBuffer(1, 10000, 22050);
      let source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
    }

    if (!speechSynthesizer) {
      if (!isIOS) {
        audioDestination = new speechSdk.SpeakerAudioDestination();
      }
      let audioConfig =
        speechSdk.AudioConfig.fromSpeakerOutput(audioDestination);
      speechSynthesizer = new speechSdk.SpeechSynthesizer(
        speechConfig,
        audioConfig
      );
    }

    const source = audioContext.createBufferSource();
    source.addEventListener('ended', () => {
      setIsPlayingAudio(false);
      memoriSpeaking = false;
    });
    audioDestination.onAudioEnd = () => {
      setIsPlayingAudio(false);
      memoriSpeaking = false;
      source.disconnect();

      emitEndSpeakEvent();

      // trigger start continuous listening if set
      onEndSpeakStartListen();
    };

    // Clear any existing visemes before starting new speech
    resetVisemeQueue();

    // Set up the viseme event handler
    speechSynthesizer.visemeReceived = function (_, e) {
      addViseme(e.visemeId, e.audioOffset);
    };

    // Set up viseme handling
    const textToSpeak = escapeHTML(
      stripMarkdown(stripEmojis(stripHTML(stripOutputTags(text))))
    );
    setTimeout(() => {
      if (speechSynthesizer) {
        speechSynthesizer.speakSsmlAsync(
          `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" xml:lang="${getCultureCodeByLanguage(
            userLang
          )}"><voice name="${getTTSVoice(
            userLang
          )}"><s>${replaceTextWithPhonemes(
            textToSpeak,
            userLang.toLowerCase()
          )}</s></voice></speak>`,
          result => {
            if (result) {
              setIsPlayingAudio(true);
              memoriSpeaking = true;

              // Process the viseme data
              startProcessing(audioContext);

              try {
                // Decode the audio data
                audioContext.decodeAudioData(
                  result.audioData,
                  function (buffer) {
                    source.buffer = buffer;
                    source.connect(audioContext.destination);

                    if (history.length < 1 || (isSafari && isIOS)) {
                      source.start(0);
                    }
                  }
                );

                // Handle the audio context state changes
                audioContext.onstatechange = () => {
                  if (
                    audioContext.state === 'suspended' ||
                    audioContext.state === 'closed'
                  ) {
                    source.disconnect();
                    setIsPlayingAudio(false);
                    stopProcessing();
                    resetVisemeQueue();
                    memoriSpeaking = false;
                  } else if ((audioContext.state as string) === 'interrupted') {
                    audioContext.resume();
                  }
                };

                audioContext.resume();

                if (speechSynthesizer) {
                  speechSynthesizer.close();
                  speechSynthesizer = null;
                }
              } catch (error) {
                console.error('Error processing audio data:', error);
                handleFallback(text);
              }
            } else {
              console.debug('No result from speech synthesis, using fallback');
              handleFallback(text);
            }
          },
          error => {
            console.error('Speak error:', error);
            handleFallback(text);
          }
        );
      }
    }, 100);
    setMemoriTyping(false);
  };

  // Helper function for fallback behavior
  const handleFallback = (text: string) => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    cleanup();
  };

  const cleanup = (): void => {
    setIsPlayingAudio(false);
    stopProcessing();
    resetVisemeQueue();
    memoriSpeaking = false;

    try {
      if (speechSynthesizer) {
        const currentSynthesizer = speechSynthesizer;
        speechSynthesizer = null; // Clear reference first
        console.debug('Closing speech synthesizer');
        currentSynthesizer.close();
      }
    } catch (error) {
      console.debug('Error during synthesizer cleanup:', error);
      // Even if close fails, ensure synthesizer is nullified
      speechSynthesizer = null;
    }

    emitEndSpeakEvent();
  };

  // Modify stopAudio to include speech state reset
  const stopAudio = async (): Promise<void> => {
    setIsPlayingAudio(false);
    memoriSpeaking = false;

    try {
      if (speechSynthesizer) {
        const currentSynthesizer = speechSynthesizer;
        speechSynthesizer = null;
        try {
          currentSynthesizer.close();
        } catch (e) {
          console.debug('Error closing speech synthesizer:', e);
        }
      }

      if (audioContext?.state !== 'closed') {
        audioContext.close();
      }

      if (audioDestination) {
        audioDestination.pause();
        audioDestination.close();
      }
    } catch (e) {
      console.debug('stopAudio error: ', e);
    }
  };
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

  const [transcript, setTranscript] = useState('');
  const [transcriptTimeout, setTranscriptTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // const [isProcessingSTT, setIsProcessingSTT] = useState(false);

  const resetTranscript = () => {
    setTranscript('');
    // setIsProcessingSTT(false);
  };

  const setListeningTimeout = () => {
    clearListeningTimeout();
      const timeout = setTimeout(
        handleTranscriptProcessing,
        (continuousSpeechTimeout * 1000) + 300
      );
      setTranscriptTimeout(timeout as unknown as NodeJS.Timeout);
  };

  const clearListeningTimeout = () => {
    if (transcriptTimeout) {
      clearTimeout(transcriptTimeout);
      setTranscriptTimeout(null);
    }
  };

  const resetListeningTimeout = () => {
    clearListeningTimeout();
    if (continuousSpeech) {
      setListeningTimeout();
    }
  };
  // Modified useEffect to handle transcript changes
  useEffect(() => {
    if (!isSpeaking) {
      resetListeningTimeout();
      resetInteractionTimeout();
    }
  }, [transcript, isSpeaking]);

  // Clean up function for component unmount
  useEffect(() => {
    return () => {
      clearListeningTimeout();
    };
  }, []);

  /**
   * Listening methods
   */
  /**
   * Starts speech recognition using Azure Cognitive Services
   * Sets up recognizer and begins continuous recognition
   */
  const startListening = async (): Promise<void> => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) {
      throw new Error('No TTS key available');
    }

    // Ensure complete cleanup before starting
    cleanup();
    resetTranscript();

    try {
      // Add delay to ensure previous instance is fully cleaned up
      // await new Promise(resolve => setTimeout(resolve, 300));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasUserActivatedListening(true);

      // Recreate speech config each time
      speechConfig = setupSpeechConfig(AZURE_COGNITIVE_SERVICES_TTS_KEY);

      const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new speechSdk.SpeechRecognizer(speechConfig, audioConfig);

      // Set up recognizer event handlers
      setupRecognizerHandlers(recognizer);

      // Start recognition
      setListening(true);
      recognizer.startContinuousRecognitionAsync();

      recognizer.canceled = (_s, e) => {
        if (e.reason === speechSdk.CancellationReason.Error) {
          console.debug(`"CANCELED: ErrorCode=${e.errorCode}`);
          console.debug(`"CANCELED: ErrorDetails=${e.errorDetails}`);
          console.debug(
            'CANCELED: Did you set the speech resource key and region values?'
          );
        }

        stopListening();
      };

      recognizer.sessionStopped = (_s, _e) => {
        stopListening();
        resetTranscript();
      };
    } catch (error) {
      console.error('Error in startListening:', error);
      stopListening();
      throw error;
    }
  };

  const setupSpeechConfig = (AZURE_COGNITIVE_SERVICES_TTS_KEY: string) => {
    speechConfig = speechSdk.SpeechConfig.fromSubscription(
      AZURE_COGNITIVE_SERVICES_TTS_KEY,
      'westeurope'
    );
    speechConfig.speechRecognitionLanguage = getCultureCodeByLanguage(userLang);
    speechConfig.speechSynthesisLanguage = getCultureCodeByLanguage(userLang);
    speechConfig.speechSynthesisVoiceName = getTTSVoice(userLang); // https://docs.microsoft.com/it-it/azure/cognitive-services/speech-service/language-support#text-to-speech
    return speechConfig;
  };

  const setupRecognizerHandlers = (recognizer: speechSdk.SpeechRecognizer) => {
    if (recognizer) {
      recognizer.recognized = (_, event) => {
        handleRecognizedSpeech(event.result.text);
      };
    }
  };

  const handleRecognizedSpeech = (text: string) => {
    console.debug('Handling recognized speech:', text);

    if (!text) {
      console.debug('No text received from speech recognition');
      return;
    }

    setTranscript(text || '');
    setIsSpeaking(false);

    // Add delay before processing the transcript
      const message = stripDuplicates(text);
      console.debug('Stripped message:', message);
      if (message.length > 0) {
        setUserMessage(message);
      }
  };

  // Helper function to handle transcript processing
  const handleTranscriptProcessing = () => {
      const message = stripDuplicates(transcript);
      if (message.length > 0 && listening) {
        sendMessage(message);
        resetTranscript();
        setUserMessage('');
        clearListening();
      } else if (listening) {
        resetInteractionTimeout();
      }
  };

  /**
   * Stops the speech recognition process
   * Closes recognizer and cleans up resources
   */
  const stopListening = () => {
    console.debug('Stopping speech recognition');
    if (recognizer) {
      // Stop continuous recognition and close the recognizer
      recognizer.stopContinuousRecognitionAsync();
      recognizer.close();
      recognizer = null;
    }
    setListening(false);
  };

  /**
   * Clears all listening state and stops recognition
   */
  const clearListening = () => {
    setHasUserActivatedListening(false);
    stopListening();
    clearListeningTimeout();
    setIsSpeaking(false);
  };

  /**
   * Resets listening state and restarts recognition if currently listening
   */
  const resetListening = () => {
    if (listening) {
      clearListening();
      resetTranscript();
      setUserMessage('');
      startListening();
    }
  };
  const resetUIEffects = () => {
    try {
      clearListening();
      clearInteractionTimeout();
      setClickedStart(false);
      timeoutRef.current = undefined;
      stopAudio();
    } catch (e) {
      console.log('Error: resetUIEffects', e);
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
    if (currentDialogState?.state === 'Z0') clearListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDialogState?.state]);

  /**
   * Speech recognition event handlers
   */
  const [requestedListening, setRequestedListening] = useState(false);
  const onEndSpeakStartListen = useCallback(
    (_e?: Event) => {
      if (isPlayingAudio && speechSynthesizer) {
        speechSynthesizer.close();
        speechSynthesizer = null;
      }
      if (
        continuousSpeech &&
        (hasUserActivatedListening || !requestedListening)
      ) {
        setRequestedListening(true);
        startListening();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [continuousSpeech, hasUserActivatedListening]
  );
  // This useEffect manages the listening state based on audio playback:
  // 1. If audio is NOT playing (isPlayingAudio is false) AND:
  //    - continuousSpeech is enabled AND
  //    - either the user has activated listening OR listening hasn't been requested yet
  //    Then start listening for user speech
  //
  // 2. If audio IS playing (isPlayingAudio is true) AND:
  //    - we are currently listening AND
  //    - the Memori isn't actually speaking (memoriSpeaking is false)
  //    Then stop listening
  //
  // This prevents listening while audio is playing and ensures proper
  // turn-taking between the user and Memori
  useEffect(() => {
    // if memori is speaking, don't start listening
    console.debug(
      'isPlayingAudio',
      !isPlayingAudio,
      continuousSpeech,
      hasUserActivatedListening || !requestedListening
    );
    if (
      !isPlayingAudio &&
      continuousSpeech &&
      (hasUserActivatedListening || !requestedListening)
    ) {
      startListening();
    } else if (isPlayingAudio && listening) {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayingAudio, hasUserActivatedListening]);

  useEffect(() => {
    resetListening();
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
    stopListening();
    stopAudio();
    sendMessage(text, undefined, undefined, false, translatedText);
  };

  // listen to events from browser
  // to use in integrations or snippets
  const memoriTextEnteredHandler = useCallback(
    (e: MemoriTextEnteredEvent) => {
      if (disableTextEnteredEvents) return;

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
          stopListening();
          stopAudio();
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
   */
  const onClickStart = useCallback(
    async (
      session?: { dialogState: DialogState; sessionID: string },
      initialSessionExpired = false
    ) => {
      // console.log('[CLICK_START] Starting onClickStart with params:', {
      //   hasSession: !!session,
      //   initialSessionExpired
      // });

      const sessionID = session?.sessionID || sessionId;
      const dialogState = session?.dialogState || currentDialogState;
      setClickedStart(true);

      let translatedMessages: Message[] = [];

      // Handle Safari audio autoplay
      let memoriAudioElement = document.getElementById(
        'memori-audio'
      ) as HTMLAudioElement;
      let isSafari =
        window.navigator.userAgent.includes('Safari') &&
        !window.navigator.userAgent.includes('Chrome');
      if (memoriAudioElement && isSafari) {
        // console.log('[CLICK_START] Enabling audio for Safari');
        memoriAudioElement.muted = false;
        memoriAudioElement.play().catch((e: any) => {
          console.warn('error playing intro audio', e);
        });
      }

      // Get birth date from storage or props
      let storageBirthDate = getLocalConfig<string | undefined>(
        'birthDate',
        undefined
      );
      let birth = birthDate || storageBirthDate || undefined;
      // console.log('[CLICK_START] Using birth date:', birth);

      // Handle age verification
      if (!sessionID && !!minAge && !birth) {
        // console.log('[CLICK_START] Age verification required');
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
        // console.log('[CLICK_START] Authentication required');
        setAuthModalState('password');
        setClickedStart(false);
        return;
      }
      // Create new session if needed
      else if (!sessionID || initialSessionExpired) {
        // console.log('[CLICK_START] Creating new session');
        setClickedStart(false);
        setGotErrorInOpening(false);
        const session = await fetchSession({
          memoriID: memori.engineMemoriID!,
          password: secret || memoriPwd || memori.secretToken,
          tag: personification?.tag,
          pin: personification?.pin,
          initialContextVars: {
            PATHNAME: window.location.pathname?.toUpperCase(),
            ROUTE:
              window.location.pathname?.split('/')?.pop()?.toUpperCase() || '',
            ...(initialContextVars || {}),
          },
          initialQuestion,
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
          // console.log('[CLICK_START] Got new session with dialog state');
          // reset history
          setHistory([]);

          translateDialogState(session.dialogState, userLang)
            .then(ts => {
              let text = ts.translatedEmission || ts.emission;
              if (text) {
                speak(text);
              }
            })
            .finally(() => {
              setHasUserActivatedSpeak(true);
            });
        } else {
          // console.log('[CLICK_START] Retrying with session:', session);
          await onClickStart(session || undefined);
        }

        return;
      }
      // Handle initial session
      else if (initialSessionID) {
        console.debug('[CLICK_START] Handling initial session');
        // check if session is valid and not expired
        const { currentState, ...response } = await getSession(sessionID);
        if (response.resultCode !== 0 || !currentState) {
          console.debug('[CLICK_START] Session expired, opening new session');
          setGotErrorInOpening(true);
          setSessionId(undefined);
          setClickedStart(false);
          await onClickStart(undefined, true);
          return;
        }

        // reset history
        setHistory([]);

        // date and place events
        if (position) applyPosition(position, sessionID);
        if (memori.needsDateTime)
          sendDateChangedEvent({ sessionID: sessionID, state: currentState });

        // Handle personification tag changes
        if (
          personification &&
          currentState.currentTag !== personification.tag
        ) {
          try {
            console.debug(
              '[CLICK_START] Changing tag for personification',
              personification,
              currentState
            );
            // reset tag
            await changeTag(memori.engineMemoriID!, sessionID, '-');
            // change tag to receiver
            const session = await changeTag(
              memori.engineMemoriID!,
              sessionID,
              personification.tag,
              personification.pin
            );

            if (session && session.resultCode === 0) {
              translateDialogState(session.currentState, userLang)
                .then(ts => {
                  let text = ts.translatedEmission || ts.emission;
                  if (text) {
                    speak(text);
                  }
                })
                .finally(() => {
                  setHasUserActivatedSpeak(true);
                });
            } else {
              console.error('[CLICK_START] Session error:', session);
              throw new Error('No session');
            }
          } catch (e) {
            console.error('[CLICK_START] Error changing tag:', e);
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              personification.tag,
              personification.pin,
              {
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
            console.debug('[CLICK_START] Changing to anonymous tag');
            // reset tag
            await changeTag(memori.engineMemoriID!, sessionID, '-');
            // change tag to anonymous
            const session = await changeTag(
              memori.engineMemoriID!,
              sessionID,
              anonTag
            );

            if (session && session.resultCode === 0) {
              translateDialogState(session.currentState, userLang)
                .then(ts => {
                  let text = ts.translatedEmission || ts.emission;
                  if (text) {
                    speak(text);
                  }
                })
                .finally(() => {
                  setHasUserActivatedSpeak(true);
                });
            } else {
              console.error('[CLICK_START] Session error:', session);
              throw new Error('No session');
            }
          } catch (e) {
            console.error('[CLICK_START] Error changing tag:', e);
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              undefined,
              undefined,
              {
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
            console.debug('[CLICK_START] Getting chat history');
            const { chatLogs, ...resp } = await getSessionChatLogs(
              sessionID,
              sessionID
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
                console.debug('[CLICK_START] Translating messages');
                translatedMessages = await Promise.all(
                  messages.map(async m => ({
                    ...m,
                    originalText: m.text,
                    text: (
                      await getTranslation(m.text, userLang, language, baseUrl)
                    ).text,
                  }))
                );
                // console.log('[CLICK_START] Translated messages:', translatedMessages);
              } catch (e) {
                // console.log('[CLICK_START] Error translating messages:', e);
              }
            }

            setHistory(translatedMessages);
            console.debug(
              '[CLICK_START] props currentState:',
              currentState,
              'userLang:',
              userLang,
              'translatedMessages:',
              translatedMessages,
              'history:',
              history
            );
          } catch (e) {
            console.log('[CLICK_START] Error retrieving chat logs:', e);
          }

          translateDialogState(
            currentState,
            userLang,
            undefined,
            // if empty history, pick current state emission
            // otherwise, don't push message
            !!translatedMessages?.length
          )
            .then(ts => {
              let text = ts.translatedEmission || ts.emission;
              if (text) {
                speak(text);
              }
            })
            .finally(() => {
              setHasUserActivatedSpeak(true);
            });
        }

        // date and place events
        if (position) applyPosition(position, sessionID);
        if (memori.needsDateTime)
          sendDateChangedEvent({ sessionID: sessionID, state: currentState });
      }
      // Default case - just translate and activate
      else {
        console.debug('[CLICK_START] Using existing session');
        // reset history
        setHistory([]);

        // everything is fine, just translate dialog state and activate chat
        translateDialogState(dialogState!, userLang)
          .then(ts => {
            let text = ts.translatedEmission || ts.emission;
            if (text) {
              speak(text);
            }
          })
          .finally(() => {
            setHasUserActivatedSpeak(true);
          });
      }
    },
    [memoriPwd, memori, memoriTokens, birthDate, sessionId, userLang, position]
  );

  useEffect(() => {
    if (!clickedStart && autoStart) {
      onClickStart();
    }
  }, [clickedStart, autoStart]);

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

  const showFullHistory =
    showOnlyLastMessages === undefined
      ? selectedLayout !== 'TOTEM' &&
        selectedLayout !== 'WEBSITE_ASSISTANT' &&
        selectedLayout !== 'HIDDEN_CHAT'
      : !showOnlyLastMessages;

  const headerProps: HeaderProps = {
    memori,
    tenant,
    history,
    showShare: showShare ?? integrationConfig?.showShare ?? true,
    position,
    setShowPositionDrawer,
    setShowSettingsDrawer,
    setShowKnownFactsDrawer,
    setShowExpertsDrawer,
    enableAudio: enableAudio ?? integrationConfig?.enableAudio ?? true,
    showSpeaker: !!AZURE_COGNITIVE_SERVICES_TTS_KEY,
    speakerMuted: muteSpeaker || speakerMuted,
    setSpeakerMuted: mute => {
      speakerMuted = !!mute;
      setMuteSpeaker(mute);
      let microphoneMode = getLocalConfig<string>(
        'microphoneMode',
        'HOLD_TO_TALK'
      );
      if (microphoneMode === 'CONTINUOUS' && mute) {
        setContinuousSpeech(false);
        setLocalConfig('microphoneMode', 'HOLD_TO_TALK');
      }
      setLocalConfig('muteSpeaker', !!mute);
      if (mute) {
        stopAudio();
      } else {
        audioContext = new AudioContext();
        let buffer = audioContext.createBuffer(1, 10000, 22050);
        let source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
      }
    },
    showSettings,
    hasUserActivatedSpeak,
    showReload: selectedLayout === 'TOTEM',
    showClear,
    clearHistory: () => setHistory(h => h.slice(-1)),
    showLogin,
    setShowLoginDrawer,
    loginToken,
    user,
    sessionID: sessionId,
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
    isPlayingAudio: isPlayingAudio && !muteSpeaker,
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
    initializeTTS: initializeTTS,
    isUserLoggedIn: !!loginToken && !!user?.userID,
    hasInitialSession: !!initialSessionID,
    notEnoughCredits: needsCredits && !hasEnoughCredits,
    showLogin,
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
    showTypingText,
    history: showFullHistory ? history : history.slice(-2),
    authToken:
      loginToken ?? userToken ?? additionalInfo?.loginToken ?? authToken,
    dialogState: currentDialogState,
    setDialogState: setCurrentDialogState,
    pushMessage,
    simulateUserPrompt,
    showDates,
    showContextPerLine,
    showAIicon,
    showUpload: enableUpload,
    showWhyThisAnswer,
    showCopyButton,
    showTranslationOriginal,
    client,
    instruct,
    preview,
    sendOnEnter,
    setSendOnEnter,
    microphoneMode: continuousSpeech ? 'CONTINUOUS' : 'HOLD_TO_TALK',
    attachmentsMenuOpen,
    setAttachmentsMenuOpen,
    showInputs,
    showMicrophone: !!AZURE_COGNITIVE_SERVICES_TTS_KEY,
    userMessage,
    onChangeUserMessage,
    sendMessage: (
      msg: string,
      media?: {
        mediumID: string;
        mimeType: string;
        content: string;
        title?: string;
        properties?: { [key: string]: any };
      }
    ) => {
      stopAudio();
      stopListening();
      sendMessage(
        msg,
        media
          ? [
              {
                mediumID: media.mediumID,
                mimeType: media.mimeType,
                content: media.content,
                title: media.title,
                properties: media.properties,
              },
            ]
          : undefined
      );
      setUserMessage('');
      resetTranscript();
    },
    stopListening: clearListening,
    startListening,
    stopAudio,
    resetTranscript,
    listening,
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
          'memori--with-speechkey': !!AZURE_COGNITIVE_SERVICES_TTS_KEY,
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
        sessionId={sessionId}
        hasUserActivatedSpeak={hasUserActivatedSpeak}
        loading={loading}
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
          onFinish={async (values: any) => {
            if (values['password']) setMemoriPwd(values['password']);
            if (values['password']) memoriPassword = values['password'];
            if (values['tokens']) setMemoriTokens(values['tokens']);

            reopenSession(
              !sessionId,
              values['password'],
              values['tokens'],
              personification?.tag,
              personification?.pin,
              {
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
                setAuthModalState(null);
                onClickStart(state || undefined);
              })
              .catch(() => {
                setAuthModalState(null);
                setGotErrorInOpening(true);
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

      {showPositionDrawer && (
        <PositionDrawer
          memori={memori}
          open={!!showPositionDrawer}
          venue={position}
          setVenue={setPosition}
          onClose={position => {
            if (position) applyPosition(position);
            setShowPositionDrawer(false);
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

      {showLoginDrawer && tenant?.id && (
        <LoginDrawer
          tenant={tenant}
          apiClient={client}
          open={!!showLoginDrawer}
          user={user}
          loginToken={loginToken}
          onClose={() => setShowLoginDrawer(false)}
          onLogin={(user, token) => {
            setUser(user);
            setLoginToken(token);
            userToken = token;
            setShowLoginDrawer(false);
            setLocalConfig('loginToken', token);
          }}
          onLogout={() => {
            if (!loginToken) return;

            client.backend.userLogout(loginToken).then(() => {
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
