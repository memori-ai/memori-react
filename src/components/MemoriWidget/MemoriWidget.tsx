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
  Invitation,
  GamificationLevel,
  Tenant,
  Asset,
  MemoriSession,
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
import { AudioContext, IAudioContext } from 'standardized-audio-context';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';
import cx from 'classnames';

// UI
// TODO: Implement this
import message from '../ui/Message';

// Components
import PositionDrawer from '../PositionDrawer/PositionDrawer';
import MemoriAuth from '../Auth/Auth';
import Chat, { Props as ChatProps } from '../Chat/Chat';
import StartPanel, { Props as StartPanelProps } from '../StartPanel/StartPanel';
import Avatar, { Props as AvatarProps } from '../Avatar/Avatar';
import ChangeMode, { Props as ChangeModeProps } from '../ChangeMode/ChangeMode';
import Header, { Props as HeaderProps } from '../Header/Header';
import AttachmentMediaModal from '../AttachmentMediaModal/AttachmentMediaModal';
import AttachmentLinkModal from '../AttachmentLinkModal/AttachmentLinkModal';
import PoweredBy from '../PoweredBy/PoweredBy';

// Layout
import FullPageLayout from '../layouts/FullPage';
import TotemLayout from '../layouts/Totem';
import ChatLayout from '../layouts/Chat';

// Helpers / Utils
import { getTranslation } from '../../helpers/translations';
import { setLocalConfig, getLocalConfig } from '../../helpers/configuration';
import {
  hasTouchscreen,
  stripDuplicates,
  stripEmojis,
} from '../../helpers/utils';
import { anonTag } from '../../helpers/constants';
import { getErrori18nKey } from '../../helpers/error';
import { getGamificationLevel } from '../../helpers/statistics';
import AgeVerificationModal from '../AgeVerificationModal/AgeVerificationModal';
import SettingsDrawer from '../SettingsDrawer/SettingsDrawer';

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
}>;

const typeMessage = (
  message: string,
  waitForPrevious = true,
  hidden = false,
  typingText?: string
) => {
  const e: MemoriTextEnteredEvent = new CustomEvent('MemoriTextEntered', {
    detail: {
      text: message,
      waitForPrevious,
      hidden,
      typingText,
    },
  });

  document.dispatchEvent(e);
};
const typeMessageHidden = (
  message: string,
  waitForPrevious = true,
  typingText?: string
) => typeMessage(message, waitForPrevious, true, typingText);

interface CustomEventMap {
  MemoriTextEntered: MemoriTextEnteredEvent;
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
  }
}
window.getMemoriState = getMemoriState;
window.typeMessage = typeMessage;
window.typeMessageHidden = typeMessageHidden;

// Global variables
let recognizer: SpeechRecognizer | null;
let speechConfig: SpeechConfig;
let speechSynthesizer: SpeechSynthesizer | null;
let audioDestination: SpeakerAudioDestination;
let audioContext: IAudioContext;

let memoriPassword: string | undefined;
let speakerMuted: boolean = false;
let memoriSpeaking: boolean = false;

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
  ChangeMode?: typeof ChangeMode;
  changeModeProps?: ChangeModeProps;
  poweredBy?: JSX.Element | null;
  sessionId?: string;
  hasUserActivatedSpeak?: boolean;
  showInstruct?: boolean;
  loading?: boolean;
}

export interface Props {
  memori: Memori;
  memoriConfigs?: MemoriConfig[];
  memoriLang?: string;
  multilingual?: boolean;
  integration?: Integration;
  layout?: 'DEFAULT' | 'FULLPAGE' | 'TOTEM' | 'CHAT';
  customLayout?: React.FC<LayoutProps>;
  showShare?: boolean;
  showInstruct?: boolean;
  showInputs?: boolean;
  showDates?: boolean;
  showContextPerLine?: boolean;
  showSettings?: boolean;
  showTypingText?: boolean;
  preview?: boolean;
  embed?: boolean;
  height?: number | string;
  secret?: string;
  baseUrl?: string;
  apiUrl?: string;
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
  onStateChange?: (state?: DialogState) => void;
  additionalInfo?: OpenSession['additionalInfo'] & { [key: string]: string };
  customMediaRenderer?: ChatProps['customMediaRenderer'];
  additionalSettings?: JSX.Element | null;
}

const MemoriWidget = ({
  memori,
  memoriConfigs,
  memoriLang,
  multilingual,
  integration,
  layout = 'DEFAULT',
  customLayout,
  showInstruct = false,
  showShare,
  preview = false,
  embed = false,
  showInputs = true,
  showDates = false,
  showContextPerLine = false,
  showSettings = true,
  showTypingText = false,
  height = '100vh',
  secret,
  baseUrl = 'https://app.twincreator.com',
  apiUrl = 'https://backend.memori.ai',
  initialContextVars,
  initialQuestion,
  ogImage,
  sessionID: initialSessionID,
  tenant,
  personification,
  authToken,
  AZURE_COGNITIVE_SERVICES_TTS_KEY,
  onStateChange,
  additionalInfo,
  additionalSettings,
  customMediaRenderer,
}: Props) => {
  const { t, i18n } = useTranslation();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // API calls methods
  const client = memoriApiClient(apiUrl);
  const {
    initSession,
    postTextEnteredEvent,
    postPlaceChangedEvent,
    postTimeoutEvent,
    postTagChangedEvent,
    getSession,
    getContentQualityIndexes,
  } = client;

  const [instruct, setInstruct] = useState(false);

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
  const [userLang, setUserLang] = useState(
    memoriLang ??
      integrationConfig?.lang ??
      language ??
      integrationConfig?.uiLang ??
      i18n.language ??
      'IT'
  );

  const [loading, setLoading] = useState(false);
  const [memoriTyping, setMemoriTyping] = useState<boolean | string>(false);

  const selectedLayout = layout || integrationConfig?.layout || 'DEFAULT';

  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);
  const [hasUserActivatedListening, setHasUserActivatedListening] =
    useState(false);
  const [showPositionDrawer, setShowPositionDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [muteSpeaker, setMuteSpeaker] = useState(false);
  const [continuousSpeech, setContinuousSpeech] = useState(false);
  const [continuousSpeechTimeout, setContinuousSpeechTimeout] = useState(2);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [controlsPosition, setControlsPosition] = useState<'center' | 'bottom'>(
    'center'
  );
  const [hideEmissions, setHideEmissions] = useState(false);
  useEffect(() => {
    setIsPlayingAudio(!!speechSynthesizer);
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

    setMuteSpeaker(getLocalConfig('muteSpeaker', false));
    speakerMuted = getLocalConfig('muteSpeaker', false);
    setContinuousSpeech(microphoneMode === 'CONTINUOUS');
    setContinuousSpeechTimeout(getLocalConfig('continuousSpeechTimeout', 2));
    setControlsPosition(
      getLocalConfig('controlsPosition', defaultControlsPosition)
    );
    setHideEmissions(getLocalConfig('hideEmissions', false));
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
        setCurrentDialogState({ ...currentDialogState, ...currentState });
      }
    }
  };

  const setPosition = (venue?: Venue) => {
    _setPosition(venue);
    applyPosition(venue);
  };

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
  const sendMessage = async (
    text: string,
    media?: Medium[],
    newSessionId?: string,
    translate: boolean = true,
    translatedText?: string,
    hidden: boolean = false,
    typingText?: string
  ) => {
    const sessionID =
      newSessionId ||
      sessionId ||
      (window.getMemoriState() as MemoriSession)?.sessionID;
    if (!sessionID || !text?.length) return;

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

    setMemoriTyping(typingText ?? true);

    let msg = text;

    if (
      translate &&
      !instruct &&
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

    const { currentState, ...response } = await postTextEnteredEvent({
      sessionId: sessionID,
      text: msg,
    });
    if (response.resultCode === 0 && currentState) {
      const emission = currentState.emission ?? currentDialogState?.emission;
      if (currentState.state === 'X4' && memori.giverTag) {
        const { currentState, ...resp } = await postTagChangedEvent(
          sessionID,
          memori.giverTag
        );

        if (resp.resultCode === 0) {
          setCurrentDialogState(currentState);

          if (currentState.emission) {
            pushMessage({
              text: currentState.emission,
              media: currentState.media,
              fromUser: false,
            });
            speak(currentState.emission);
          }
        } else {
          console.error(response, resp);
          message.error(t(getErrori18nKey(resp.resultCode)));
        }
      } else if (currentState.state === 'X2d' && memori.giverTag) {
        const { currentState, ...resp } = await postTextEnteredEvent({
          sessionId: sessionID,
          text: Math.random().toString().substring(2, 8),
        });

        if (resp.resultCode === 0) {
          const { currentState, ...resp } = await postTagChangedEvent(
            sessionID,
            memori.giverTag
          );

          if (resp.resultCode === 0) {
            setCurrentDialogState(currentState);

            if (currentState.emission) {
              pushMessage({
                text: currentState.emission,
                media: currentState.media,
                fromUser: false,
              });
              speak(currentState.emission);
            }
          } else {
            console.error(response, resp);
            message.error(t(getErrori18nKey(resp.resultCode)));
          }
        } else {
          console.error(response, resp);
          message.error(t(getErrori18nKey(resp.resultCode)));
        }
      } else if (
        userLang.toLowerCase() !== language.toLowerCase() &&
        emission &&
        !instruct &&
        isMultilanguageEnabled
      ) {
        translateDialogState(currentState, userLang).then(ts => {
          if (ts.emission) {
            speak(ts.emission);
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
            media: currentState.media,
            fromUser: false,
            generatedByAI: !!currentState.completion,
          });
          speak(emission);
        }
      }
    } else if (response.resultCode === 404) {
      // remove last sent message, will set it as initial
      setHistory(h => [...h.slice(0, h.length - 1)]);

      // post session timeout -> Z0/A0 -> restart session and re-send msg
      reopenSession(
        false,
        memoriPwd || memori.secretToken,
        memoriTokens,
        instruct && memori.giverTag ? memori.giverTag : undefined,
        instruct && memori.giverPIN ? memori.giverPIN : undefined,
        initialContextVars,
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

    setMemoriTyping(false);
  };

  /**
   * Traduzioni istantanee
   */
  const translateDialogState = async (state: DialogState, userLang: string) => {
    const emission = state.emission ?? currentDialogState?.emission;

    let translatedState = { ...state };
    let translatedMsg = null;

    if (
      !emission ||
      instruct ||
      language.toUpperCase() === userLang.toUpperCase() ||
      !isMultilanguageEnabled
    ) {
      translatedState = { ...state, emission };
      if (emission) {
        translatedMsg = {
          text: emission,
          media: state.media,
          fromUser: false,
        };
      }
    } else {
      const t = await getTranslation(emission, userLang, language, baseUrl);
      if (state.hints && state.hints.length > 0) {
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
          emission: t.text,
          hints:
            state.hints ??
            (state.state === 'G1' ? currentDialogState?.hints : []),
        };
      }

      if (t.text.length > 0)
        translatedMsg = {
          text: t.text,
          media: state.media,
          fromUser: false,
          generatedByAI: !!state.completion,
        };
    }

    setCurrentDialogState(translatedState);
    if (translatedMsg) {
      pushMessage(translatedMsg);
    }

    return translatedState;
  };

  /**
   * Age verification
   */
  const minAge = memori.ageRestriction
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
            if (document.body.classList.contains('chat-focused')) {
              document.querySelector('.ant-tabs-nav')?.scrollIntoView();
              document
                .querySelector('.memori-chat--content')
                ?.scrollTo(
                  0,
                  document.querySelector('.memori-chat--content')
                    ?.scrollHeight ?? 0
                );
            } else {
              document.querySelector('#end-messages-ref')?.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }, 400);
        }, 1000);
      } catch (e) {
        console.error(e);
      }
    });
  };
  const fetchSession = async (
    params: OpenSession
  ): Promise<{
    dialogState: DialogState;
    sessionID: string;
  } | void> => {
    if (
      memori.privacyType !== 'PUBLIC' &&
      !memori.secretToken &&
      !memoriPwd &&
      !memoriTokens
    ) {
      setAuthModalState('password');
      return;
    }
    let storageBirthDate = getLocalConfig<string | undefined>(
      'birthDate',
      undefined
    );
    if (!(birthDate || storageBirthDate) && !!minAge) {
      setShowAgeVerification(true);
      return;
    }

    setLoading(true);
    try {
      if (!memori.giverTag && !!memori.receivedInvitations?.length) {
        let giverInvitation = memori.receivedInvitations.find(
          (i: Invitation) => i.type === 'GIVER' && i.state === 'ACCEPTED'
        );

        if (giverInvitation) {
          memori.giverTag = giverInvitation.tag;
          memori.giverPIN = giverInvitation.pin;
        }
      }

      let referral;
      try {
        referral = (() => {
          return window.location.href;
        })();
      } catch (err) {
        console.error(err);
      }

      const session = await initSession({
        ...params,
        additionalInfo: {
          ...(additionalInfo || {}),
          loginToken: additionalInfo?.loginToken ?? authToken,
          language: getCultureCodeByLanguage(userLang),
          referral: referral,
        },
      });
      if (
        session?.sessionID &&
        session?.currentState &&
        session.resultCode === 0
      ) {
        setSessionId(session.sessionID);

        if (position) applyPosition(position, session.sessionID);

        setLoading(false);
        return {
          dialogState: session.currentState,
          sessionID: session.sessionID,
        } as { dialogState: DialogState; sessionID: string };
      } else if (
        session?.resultMessage.startsWith('This Memori is aged restricted')
      ) {
        console.error(session);
        message.error(t('underageTwinSession', { age: minAge }));
        setGotErrorInOpening(true);
      } else {
        console.error(session);
        message.error(t(getErrori18nKey(session?.resultCode)));
        setGotErrorInOpening(true);
      }
    } catch (err) {
      console.error(err);
      new Error('Error fetching session');
    }
  };
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
    setLoading(true);
    try {
      if (
        memori.privacyType !== 'PUBLIC' &&
        !password &&
        !memori.secretToken &&
        !memoriPwd &&
        !recoveryTokens &&
        !memoriTokens
      ) {
        setAuthModalState('password');
        return;
      }

      let storageBirthDate = getLocalConfig<string | undefined>(
        'birthDate',
        undefined
      );
      if (!(birthDate || storageBirthDate) && !!minAge) {
        setShowAgeVerification(true);
        return;
      }

      let referral;
      try {
        referral = (() => {
          return window.location.href;
        })();
      } catch (err) {
        console.error(err);
      }

      const { sessionID, currentState, ...response } = await initSession({
        memoriID: memori.engineMemoriID ?? '',
        password: password || memoriPwd || memori.secretToken,
        recoveryTokens: recoveryTokens || memoriTokens,
        tag,
        pin,
        initialContextVars,
        initialQuestion,
        birthDate: birthDate || storageBirthDate || undefined,
        additionalInfo: {
          ...(additionalInfo || {}),
          loginToken: additionalInfo?.loginToken ?? authToken,
          language: getCultureCodeByLanguage(userLang),
          referral: referral,
        },
      });

      if (sessionID && currentState && response.resultCode === 0) {
        setSessionId(sessionID);

        if (updateDialogState) {
          setCurrentDialogState(currentState);
          if (currentState.emission) {
            history.length <= 1
              ? setHistory([
                  {
                    text: currentState.emission,
                    media: currentState.media,
                    fromUser: false,
                  },
                ])
              : pushMessage({
                  text: currentState.emission,
                  media: currentState.media,
                  fromUser: false,
                });
          }
        }

        if (position) applyPosition(position, sessionID);

        setLoading(false);
        return {
          dialogState: currentState,
          sessionID,
        };
      } else if (
        response?.resultMessage.startsWith('This Memori is aged restricted')
      ) {
        console.error(response);
        message.error(t('underageTwinSession', { age: minAge }));
        setGotErrorInOpening(true);
      } else {
        console.error(response);
        message.error(t(getErrori18nKey(response.resultCode)));
        setGotErrorInOpening(true);
      }
    } catch (err) {
      console.error(err);
    }
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
            console.error(err);
          }

          fetchSession({
            memoriID: memori.engineMemoriID ?? '',
            password: secret || memoriPwd || memori.secretToken,
            tag: memori.giverTag,
            pin: memori.giverPIN,
            initialContextVars,
            initialQuestion,
            birthDate: birthDate || storageBirthDate || undefined,
            additionalInfo: {
              ...(additionalInfo || {}),
              loginToken: additionalInfo?.loginToken ?? authToken,
              language: getCultureCodeByLanguage(userLang),
              referral: referral,
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
      console.error('[APPCONTEXT/CHANGETAG]', err);
      return Promise.reject(err);
    }

    return null;
  };
  const restoreGiverTag = async () => {
    if (sessionId && memori.giverTag && memori.giverPIN) {
      setHistory([]);
      await changeTag(
        memori.engineMemoriID!,
        sessionId,
        memori.giverTag,
        memori.giverPIN
      );
    }
  };
  useEffect(() => {
    return () => {
      if (
        !currentDialogState ||
        currentDialogState?.currentTag !== memori.giverTag
      )
        restoreGiverTag();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (
      currentDialogState?.acceptsTimeout &&
      !speechSynthesizer &&
      !isPlayingAudio &&
      !userMessage.length &&
      !memoriTyping &&
      !listening
    )
      setInteractionTimeout();
  };
  const handleTimeout = async () => {
    if (
      !!speechSynthesizer ||
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
          !instruct &&
          isMultilanguageEnabled &&
          userLang !== i18n?.language &&
          emission &&
          emission.length > 0
        ) {
          translateDialogState(
            { ...currentState, emission: emission },
            userLang
          ).then(ts => {
            if (ts.emission) {
              speak(ts.emission);
            }
          });
        } else if (emission && emission.length > 0) {
          pushMessage({
            text: emission,
            media: currentState.media,
            fromUser: false,
            generatedByAI: !!currentState.completion,
          });
          speak(emission);
          setCurrentDialogState({
            ...currentState,
            hints:
              currentState.hints ??
              (currentState.state === 'G1' ? currentDialogState?.hints : []),
          });
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
      'eastus'
    );

    speechConfig.speechSynthesisLanguage = getCultureCodeByLanguage(userLang);
    speechConfig.speechSynthesisVoiceName = getTTSVoice(userLang); // https://docs.microsoft.com/it-it/azure/cognitive-services/speech-service/language-support#text-to-speech
    speechConfig.speechRecognitionLanguage = getCultureCodeByLanguage(userLang);

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
      switch (voiceLang) {
        case 'IT':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'it-IT-DiegoNeural'
              : 'it-IT-ElsaNeural'
          }`;
          break;
        case 'DE':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'de-DE-ConradNeural'
              : 'de-DE-KatjaNeural'
          }`;
          break;
        case 'EN':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'en-GB-RyanNeural'
              : 'en-GB-SoniaNeural'
          }`;
          break;
        case 'ES':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'es-ES-AlvaroNeural'
              : 'es-ES-ElviraNeural'
          }`;
          break;
        case 'FR':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'fr-FR-HenriNeural'
              : 'fr-FR-DeniseNeural'
          }`;
          break;
        case 'PT':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'pt-PT-DuarteNeural'
              : 'pt-PT-RaquelNeural'
          }`;
          break;
        case 'UK':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'uk-UA-OstapNeural'
              : 'uk-UA-PolinaNeural'
          }`;
          break;
        case 'RU':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'ru-RU-DmitryNeural'
              : 'ru-RU-SvetlanaNeural'
          }`;
          break;
        case 'PL':
          voice = `${
            memori.voiceType === 'MALE'
              ? 'pl-PL-MarekNeural'
              : 'pl-PL-AgnieszkaNeural'
          }`;
          break;
        default:
          voice = `${
            memori.voiceType === 'MALE'
              ? 'it-IT-DiegoNeural'
              : 'it-IT-IsabellaNeural'
          }`;
          break;
      }
      return voice;
    },
    [memori.voiceType, i18n.language, memori.culture]
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
        `${baseUrl || 'https://app.twincreator.com'}/api/lexiconmap`
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

  const escapeHTML = (text: string) => {
    const el = document.createElement('textarea');
    el.textContent = text;
    return el.innerHTML;
  };

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

  const speak = (text: string): void => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) return;
    stopListening();
    // stopAudio();

    if (preview) return;

    if (muteSpeaker || speakerMuted) {
      memoriSpeaking = false;

      // trigger start continuous listening if set, see MemoriChat
      if (continuousSpeech) {
        setListeningTimeout();
      }
      return;
    }

    if (audioDestination) audioDestination.pause();

    // if (audioContext?.state === 'running') {
    //   //   audioContext.suspend();
    //   // }
    //   // if (audioContext) {
    //   audioContext.close().then(() => {
    //     audioContext = new AudioContext();
    //     let buffer = audioContext.createBuffer(1, 10000, 22050);
    //     let source = audioContext.createBufferSource();
    //     source.buffer = buffer;
    //     source.connect(audioContext.destination);
    //   });
    // }

    let isSafari =
      window.navigator.userAgent.includes('Safari') &&
      !window.navigator.userAgent.includes('Chrome');
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if ((audioContext.state as string) === 'interrupted') {
      audioContext.resume().then(() => speak(text));
      return;
    }
    if (isIOS && isSafari) {
      audioContext.suspend();

      if (isPlayingAudio) {
        try {
          memoriSpeaking = false;
          if (speechSynthesizer) {
            speechSynthesizer.close();
            speechSynthesizer = null;
          }
          if (audioDestination) {
            audioDestination.pause();
            audioDestination.close();
          }
          if (audioContext) {
            // audioContext.close().then(() => {
            //   audioContext = new AudioContext();
            //   let buffer = audioContext.createBuffer(1, 10000, 22050);
            //   let source = audioContext.createBufferSource();
            //   source.buffer = buffer;
            //   source.connect(audioContext.destination);
            // });
            audioContext.destination.disconnect();
          }
        } catch (e) {
          console.error('stopAudio error: ', e);
        }
      }
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
      audioDestination = new speechSdk.SpeakerAudioDestination();
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

      // trigger start continuous listening if set
      // document.dispatchEvent(new Event('endSpeakStartListen'));
      onEndSpeakStartListen();
    };

    speechSynthesizer.speakSsmlAsync(
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" xml:lang="${getCultureCodeByLanguage(
        userLang
      )}"><voice name="${getTTSVoice(userLang)}"><s>${replaceTextWithPhonemes(
        escapeHTML(stripEmojis(text)),
        userLang.toLowerCase()
      )}</s></voice></speak>`,
      result => {
        if (result) {
          setIsPlayingAudio(true);
          memoriSpeaking = true;

          try {
            // if (audioContext.destination.context.state === 'running') {
            //   audioContext.destination.disconnect();
            // }
            audioContext.decodeAudioData(result.audioData, function (buffer) {
              source.buffer = buffer;
              source.connect(audioContext.destination);

              if (history.length < 1 || (isSafari && isIOS)) {
                source.start(0);
              }
            });

            audioContext.onstatechange = () => {
              if (
                audioContext.state === 'suspended' ||
                audioContext.state === 'closed'
              ) {
                source.disconnect();
                setIsPlayingAudio(false);
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
          } catch (e) {
            console.error('speak error: ', e);
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
            setIsPlayingAudio(false);
            memoriSpeaking = false;

            if (speechSynthesizer) {
              speechSynthesizer.close();
              speechSynthesizer = null;
            }
          }
        } else {
          audioContext.resume();
          setIsPlayingAudio(false);
          memoriSpeaking = false;
        }
      },
      error => {
        console.error('speak:', error);
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        setIsPlayingAudio(false);
        memoriSpeaking = false;
      }
    );

    setMemoriTyping(false);
  };
  const stopAudio = () => {
    setIsPlayingAudio(false);
    memoriSpeaking = false;
    try {
      if (speechSynthesizer) {
        speechSynthesizer.close();
        speechSynthesizer = null;
      }
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
      if (audioDestination) {
        audioDestination.pause();
        audioDestination.close();
      }
    } catch (e) {
      console.error('stopAudio error: ', e);
    }
  };

  /**
   * Focus on the chat input on mount
   */
  useEffect(() => {
    let textarea = document.querySelector(
      '#chat-fieldset textarea'
    ) as HTMLTextAreaElement | null;
    if (textarea) textarea.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDialogState?.emission]);

  /**
   * Speech recognition and transcript management
   */
  const [transcript, setTranscript] = useState('');
  const resetTranscript = () => setTranscript('');

  /**
   * Listening transcript timeout
   */
  const [transcriptTimeout, setTranscriptTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const setListeningTimeout = () => {
    let timeout = setTimeout(async () => {
      clearListening();
      const message = stripDuplicates(transcript);
      if (message.length > 0 && listening) {
        sendMessage(message);
        resetTranscript();
        setUserMessage('');
      } else if (listening) {
        resetInteractionTimeout();
      }
    }, continuousSpeechTimeout * 1000);
    setTranscriptTimeout(timeout);
  };
  const clearListeningTimeout = () => {
    if (transcriptTimeout) {
      clearTimeout(transcriptTimeout);
      setTranscriptTimeout(null);
    }
  };
  const resetListeningTimeout = () => {
    clearListeningTimeout();
    if (continuousSpeech) setListeningTimeout();
  };
  useEffect(() => {
    resetListeningTimeout();
    resetInteractionTimeout();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  /**
   * Listening methods
   */
  const startListening = () => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) return;

    clearListening();
    setTranscript('');
    resetTranscript();

    try {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (_stream) {
          setHasUserActivatedListening(true);

          if (!speechConfig) {
            speechConfig = speechSdk.SpeechConfig.fromSubscription(
              AZURE_COGNITIVE_SERVICES_TTS_KEY,
              'eastus'
            );
            speechConfig.speechRecognitionLanguage =
              getCultureCodeByLanguage(userLang);
            speechConfig.speechSynthesisLanguage =
              getCultureCodeByLanguage(userLang);
            speechConfig.speechSynthesisVoiceName = getTTSVoice(userLang); // https://docs.microsoft.com/it-it/azure/cognitive-services/speech-service/language-support#text-to-speech
          }

          const audioConfig =
            speechSdk.AudioConfig.fromDefaultMicrophoneInput();
          recognizer = new speechSdk.SpeechRecognizer(
            speechConfig,
            audioConfig
          );

          setListening(true);
          recognizer.recognized = (_s, e) => {
            if (!e.result.text) return;
            if (e.result.reason === speechSdk.ResultReason.RecognizedSpeech) {
              let transcript = e.result.text;
              setTranscript(transcript || '');
              if (transcript?.length > 0) {
                const transcriptMessage = stripDuplicates(transcript);
                if (transcriptMessage.length > 0)
                  setUserMessage(msg => `${msg} ${transcriptMessage}`);
              }
            } else if (e.result.reason === speechSdk.ResultReason.NoMatch) {
              console.debug('NOMATCH: Speech could not be recognized.');
            }
          };
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
          };

          resetTranscript();
          recognizer.startContinuousRecognitionAsync();
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };
  const stopListening = () => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync();
      recognizer.close();
      recognizer = null;
    }
    setListening(false);
  };
  const clearListening = () => {
    setHasUserActivatedListening(false);
    stopListening();
    clearListeningTimeout();
  };
  const resetListening = () => {
    if (listening) {
      clearListening();
      resetTranscript();
      setUserMessage('');
      startListening();
    }
  };
  useEffect(() => {
    return () => clearListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  useEffect(() => {
    if (
      history.length > 1 &&
      !isPlayingAudio &&
      continuousSpeech &&
      (hasUserActivatedListening || !requestedListening)
    )
      startListening();
    else if (isPlayingAudio && listening) {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayingAudio]);
  useEffect(() => {
    document.addEventListener('endSpeakStartListen', onEndSpeakStartListen);

    return () => {
      document.removeEventListener(
        'endSpeakStartListen',
        onEndSpeakStartListen
      );
    };
  }, [onEndSpeakStartListen]);
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
    const stored = getLocalConfig<'keypress' | 'click'>(
      'sendOnEnter',
      'keypress'
    );
    if (window.innerWidth <= 768) setSendOnEnter('click');
    else setSendOnEnter(stored);
  }, []);
  useEffect(() => {
    setLocalConfig('sendOnEnter', sendOnEnter);
  }, [sendOnEnter]);

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
          ...(integrationConfig && !showInstruct
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
    ${preview ? '#preview' : ':root'}, .memori-widget {
      ${Object.entries(integrationProperties)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
  `;

  const showAIicon =
    integrationConfig?.showAIicon === undefined
      ? true
      : integrationConfig?.showAIicon;

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

  const [gamificationLevel, setGamificationLevel] =
    useState<GamificationLevel>();
  const getGamificationPoints = async (
    memoriID: string
  ): Promise<{
    points: number;
    unansweredQuestions: number;
  }> => {
    let gamificationPoints: number | undefined;
    let unansQuestions: number | undefined;
    try {
      const {
        contentQualityIndex,
        answerQualityIndex,
        unansweredQuestions,
        ...cqResp
      } = await getContentQualityIndexes(memoriID);
      if (cqResp.resultCode === 0) {
        gamificationPoints = contentQualityIndex;
        unansQuestions = unansweredQuestions;
      }
    } catch (_e) {
      let err = _e as Error;
      console.error('[APPCONTEXT/QUERYGAMIFICATIONPOINTS]', err);
    }

    return {
      points: gamificationPoints ?? 0,
      unansweredQuestions: unansQuestions ?? 0,
    };
  };
  useEffect(() => {
    if (memori.engineMemoriID) {
      getGamificationPoints(memori.engineMemoriID)
        .then(value => {
          setGamificationLevel(getGamificationLevel(value.points));
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memori.engineMemoriID]);

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

  // X3 state - tag change
  const selectReceiverTag = async (tag: string) => {
    if (!sessionId) return;

    try {
      const { currentState, ...resp } = await postTagChangedEvent(
        sessionId,
        tag
      );

      if (resp.resultCode === 0) {
        pushMessage({
          text: tag,
          fromUser: true,
        });

        if (currentState.state === 'X4' && memori.giverTag) {
          const { currentState, ...resp } = await client.postTagChangedEvent(
            sessionId,
            memori.giverTag
          );

          if (resp.resultCode === 0) {
            setCurrentDialogState(currentState);

            if (currentState.emission) {
              pushMessage({
                text: currentState.emission,
                media: currentState.media,
                fromUser: false,
              });
            }
          } else {
            console.error(resp);
            message.error(t(getErrori18nKey(resp.resultCode)));
          }
        } else {
          setCurrentDialogState(currentState);
          if (currentState.emission) {
            pushMessage({
              text: currentState.emission,
              media: currentState.media,
              fromUser: false,
            });
          }
        }
      } else {
        console.error(resp, tag, currentDialogState?.knownTags?.[tag]);
        message.error(t(getErrori18nKey(resp.resultCode)));
      }
    } catch (e) {
      let err = e as Error;
      console.error(err);
      message.error(err.message);
    }
  };

  const simulateUserPrompt = (text: string, translatedText?: string) => {
    stopListening();
    stopAudio();
    sendMessage(text, undefined, undefined, false, translatedText);
  };

  // listen to events from browser
  // to use in integrations or snippets
  const memoriTextEnteredHandler = useCallback(
    (e: MemoriTextEnteredEvent) => {
      const { text, waitForPrevious, hidden, typingText } = e.detail;

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
            typingText
          );
        }
      }
    },
    [sessionId, isPlayingAudio, memoriTyping, userLang]
  );
  useEffect(() => {
    document.addEventListener('MemoriTextEntered', memoriTextEnteredHandler);

    return () => {
      document.removeEventListener(
        'MemoriTextEntered',
        memoriTextEnteredHandler
      );
    };
  }, [sessionId, userLang]);

  const onClickStart = useCallback(
    async (session?: { dialogState: DialogState; sessionID: string }) => {
      const sessionID = session?.sessionID || sessionId;
      const dialogState = session?.dialogState || currentDialogState;
      setClickedStart(true);

      let memoriAudioElement = document.getElementById(
        'memori-audio'
      ) as HTMLAudioElement;
      let isSafari =
        window.navigator.userAgent.includes('Safari') &&
        !window.navigator.userAgent.includes('Chrome');
      if (memoriAudioElement && isSafari) {
        memoriAudioElement.muted = false;
        memoriAudioElement.play().catch((e: any) => {
          console.error('error playing intro audio', e);
        });
      }

      let storageBirthDate = getLocalConfig<string | undefined>(
        'birthDate',
        undefined
      );
      let birth = birthDate || storageBirthDate || undefined;

      if (
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
      } else if (!sessionID && !!minAge && !birth) {
        setShowAgeVerification(true);
        setClickedStart(false);
      } else if (!sessionID) {
        setClickedStart(false);
        setGotErrorInOpening(false);
        const session = await fetchSession({
          memoriID: memori.engineMemoriID!,
          password: secret || memoriPwd || memori.secretToken,
          tag: personification?.tag,
          pin: personification?.pin,
          initialContextVars,
          initialQuestion,
          birthDate: birth,
        });

        if (session?.dialogState) {
          // reset history
          setHistory([]);

          translateDialogState(session.dialogState, userLang)
            .then(ts => {
              if (ts.emission) {
                speak(ts.emission);
              }
            })
            .finally(() => {
              setHasUserActivatedSpeak(true);
            });
        } else {
          await onClickStart(session || undefined);
        }

        return;
      } else if (initialSessionID) {
        // check if session is valid and not expired
        const { currentState, ...response } = await getSession(sessionID);
        if (response.resultCode !== 0 || !currentState) {
          console.debug('session expired, opening new session');
          setGotErrorInOpening(true);
          setSessionId(undefined);
          setClickedStart(false);
          await onClickStart();
          return;
        }

        // reset history
        setHistory([]);

        // checks engine state for current tag
        // opening session would have already correct tag
        // otherwise change tag to anonymous for test, giver for instruct, receiver if set

        // test if current tag is giver on instruct
        if (
          instruct &&
          memori.giverTag &&
          currentDialogState?.currentTag !== memori.giverTag
        ) {
          try {
            console.debug('change tag #0');
            // reset tag
            await changeTag(memori.engineMemoriID!, sessionID, '-');
            // change tag to giver
            const session = await changeTag(
              memori.engineMemoriID!,
              sessionID,
              memori.giverTag,
              memori.giverPIN
            );

            if (session && session.resultCode === 0) {
              translateDialogState(session.currentState, userLang)
                .then(ts => {
                  if (ts.emission) {
                    speak(ts.emission);
                  }
                })
                .finally(() => {
                  setHasUserActivatedSpeak(true);
                });
            } else {
              console.error('session #1', session);
              throw new Error('No session');
            }
          } catch (e) {
            console.error('session #2', e);
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              memori?.giverTag,
              memori?.giverPIN,
              initialContextVars,
              initialQuestion,
              birth
            ).then(() => {
              setHasUserActivatedSpeak(true);
            });
          }
        } else if (
          // test if current tag is receiver on test as it is requested
          !instruct &&
          personification &&
          currentDialogState?.currentTag !== personification.tag
        ) {
          try {
            console.debug('change tag #3');
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
                  if (ts.emission) {
                    speak(ts.emission);
                  }
                })
                .finally(() => {
                  setHasUserActivatedSpeak(true);
                });
            } else {
              console.error('session #4', session);
              throw new Error('No session');
            }
          } catch (e) {
            console.error('session #5', e);
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              personification.tag,
              personification.pin,
              initialContextVars,
              initialQuestion,
              birth
            ).then(() => {
              setHasUserActivatedSpeak(true);
            });
          }
        } else if (
          // test if current tag is anonymous on test without personification
          // this is the default case with anonymous tag
          !instruct &&
          !personification &&
          currentDialogState?.currentTag !== anonTag
        ) {
          try {
            console.debug('change tag #6');
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
                  if (ts.emission) {
                    speak(ts.emission);
                  }
                })
                .finally(() => {
                  setHasUserActivatedSpeak(true);
                });
            } else {
              console.error('session #7', session);
              throw new Error('No session');
            }
          } catch (e) {
            console.error('session #8', e);
            reopenSession(
              true,
              memori?.secretToken,
              undefined,
              undefined,
              undefined,
              initialContextVars,
              initialQuestion,
              birth
            ).then(() => {
              setHasUserActivatedSpeak(true);
            });
          }
        } else {
          // no need to change tag
          translateDialogState(currentState, userLang)
            .then(ts => {
              if (ts.emission) {
                speak(ts.emission);
              }
            })
            .finally(() => {
              setHasUserActivatedSpeak(true);
            });
        }
      } else {
        // reset history
        setHistory([]);

        // everything is fine, just translate dialog state and activate chat
        translateDialogState(dialogState!, userLang)
          .then(ts => {
            if (ts.emission) {
              speak(ts.emission);
            }
          })
          .finally(() => {
            setHasUserActivatedSpeak(true);
          });
      }
    },
    [memoriPwd, memori, memoriTokens, birthDate, sessionId, userLang]
  );

  const [loginToken, setLoginToken] = useState<string | undefined>(authToken);
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
          } else {
            // @ts-ignore
            setLoginToken(
              mutation.target?.parentElement?.getAttribute('authtoken') ||
                undefined
            );
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

  const headerProps: HeaderProps = {
    memori,
    history,
    showShare: showShare ?? integrationConfig?.showShare ?? true,
    position,
    setShowPositionDrawer,
    setShowSettingsDrawer,
    showSpeaker: !!AZURE_COGNITIVE_SERVICES_TTS_KEY,
    speakerMuted: muteSpeaker || speakerMuted,
    setSpeakerMuted: mute => {
      speakerMuted = !!mute;
      setMuteSpeaker(mute);
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
    isPlayingAudio,
    loading: !!memoriTyping,
    baseUrl,
    apiUrl,
  };

  const startPanelProps: StartPanelProps = {
    memori: memori,
    tenant: tenant,
    gamificationLevel: gamificationLevel,
    language: language,
    userLang: userLang,
    setUserLang: setUserLang,
    baseUrl: baseUrl,
    apiUrl: apiUrl,
    position: position,
    openPositionDrawer: () => setShowPositionDrawer(true),
    integrationConfig: integrationConfig,
    instruct: instruct,
    sessionId: sessionId,
    clickedStart: clickedStart,
    onClickStart: onClickStart,
    initializeTTS: initializeTTS,
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
    apiUrl,
    memoriTyping,
    showTypingText,
    history: layout === 'TOTEM' ? history.slice(-2) : history,
    authToken: loginToken,
    dialogState: currentDialogState,
    setDialogState: setCurrentDialogState,
    pushMessage,
    simulateUserPrompt,
    showDates,
    showContextPerLine,
    showAIicon,
    client,
    selectReceiverTag,
    preview,
    sendOnEnter,
    setSendOnEnter,
    microphoneMode: continuousSpeech ? 'CONTINUOUS' : 'HOLD_TO_TALK',
    attachmentsMenuOpen,
    setAttachmentsMenuOpen,
    instruct,
    showInputs,
    showMicrophone: !!AZURE_COGNITIVE_SERVICES_TTS_KEY,
    userMessage,
    onChangeUserMessage,
    sendMessage: (msg: string) => {
      stopAudio();
      stopListening();
      sendMessage(msg);
      setUserMessage('');
      resetTranscript();
    },
    stopListening: clearListening,
    startListening,
    stopAudio,
    resetTranscript,
    listening,
    isPlayingAudio,
    customMediaRenderer,
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

  const onChangeMode = (mode: 'instruct' | 'test') => {
    setInstruct(mode === 'instruct');
    setHasUserActivatedSpeak(false);
    setClickedStart(false);
  };
  const changeModeProps: ChangeModeProps = {
    canInstruct: !!memori.giverTag,
    instruct: !!instruct,
    onChangeMode,
  };

  const poweredBy = <PoweredBy tenant={tenant} userLang={userLang} />;

  const Layout = customLayout
    ? customLayout
    : selectedLayout === 'TOTEM'
    ? TotemLayout
    : selectedLayout === 'CHAT'
    ? ChatLayout
    : selectedLayout === 'FULLPAGE'
    ? FullPageLayout
    : FullPageLayout;

  return (
    <div
      className={cx(
        'memori',
        'memori-widget',
        `memori-layout-${layout.toLowerCase()}`,
        `memori-controls-${controlsPosition.toLowerCase()}`,
        {
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
        ChangeMode={ChangeMode}
        changeModeProps={changeModeProps}
        poweredBy={poweredBy}
        sessionId={sessionId}
        hasUserActivatedSpeak={hasUserActivatedSpeak}
        showInstruct={showInstruct}
        loading={loading}
      />

      <audio
        id="memori-audio"
        style={{ display: 'none' }}
        src="https://app.twincreator.com/intro.mp3"
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
              instruct ? memori.giverTag : undefined,
              instruct ? memori.giverPIN : undefined,
              initialContextVars,
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
                instruct ? memori.giverTag : undefined,
                instruct ? memori.giverPIN : undefined,
                initialContextVars,
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
          additionalSettings={additionalSettings}
        />
      )}

      {sessionId && (
        <AttachmentLinkModal
          apiURL={apiUrl}
          visible={attachmentsMenuOpen === 'link'}
          onCancel={() => setAttachmentsMenuOpen(undefined)}
          onOk={async link => {
            if (!sessionId) return;

            let medium: Medium = {
              mediumID: '',
              mimeType: 'text/html',
              url: link.url,
              title: link.title,
            };
            pushMessage({
              text: t('media.insertThisLink', {
                url: medium.url,
                title: medium.title,
              }),
              fromUser: true,
              media: [medium],
            });
            try {
              const { currentState, ...resp } =
                await client.postMediumSelectedEvent(sessionId, medium);

              if (currentState && resp.resultCode === 0) {
                setCurrentDialogState(currentState);

                if (currentState.emission) {
                  pushMessage({
                    text: currentState.emission,
                    media: currentState.media,
                    fromUser: false,
                  });
                  speak(currentState.emission);
                }
              } else {
                console.error(resp, currentState, medium);
                message.error(
                  t(getErrori18nKey(resp.resultCode), { ns: 'common' })
                );
              }
            } catch (e) {
              let err = e as Error;
              console.error(err);
              message.error(err.message);
            }
            setAttachmentsMenuOpen(undefined);
          }}
        />
      )}
      {loginToken && sessionId && tenant?.id && (
        <AttachmentMediaModal
          apiURL={apiUrl}
          visible={attachmentsMenuOpen === 'media'}
          authToken={loginToken}
          tenantID={tenant?.id}
          sessionID={sessionId}
          uploadAssetURL={client.backend.getUploadAssetURL(
            loginToken,
            memori.memoriID
          )}
          deleteAsset={client.backend.deleteAsset}
          onCancel={() => setAttachmentsMenuOpen(undefined)}
          onOk={async (asset: Asset) => {
            if (!sessionId) return;

            let medium: Medium = {
              mediumID: '',
              mimeType: asset.mimeType,
              url: asset.assetURL,
              title: asset.title || asset.assetID,
            };
            pushMessage({
              text: t('media.insertThisMediaMsg'),
              fromUser: true,
              media: [medium],
            });
            try {
              const { currentState, ...resp } =
                await client.postMediumSelectedEvent(sessionId, medium);

              if (currentState && resp.resultCode === 0) {
                setCurrentDialogState(currentState);

                if (currentState.emission) {
                  pushMessage({
                    text: currentState.emission,
                    media: currentState.media,
                    fromUser: false,
                  });
                  speak(currentState.emission);
                }
              } else {
                console.error(resp, currentState, medium);
                message.error(
                  t(getErrori18nKey(resp.resultCode), { ns: 'common' })
                );
              }
            } catch (e) {
              let err = e as Error;
              console.error(err);
              message.error(err.message);
            }
            setAttachmentsMenuOpen(undefined);
          }}
        />
      )}
    </div>
  );
};

export default MemoriWidget;
