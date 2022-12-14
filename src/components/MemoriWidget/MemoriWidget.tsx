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
} from '@memori.ai/memori-api-client/dist/types';
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
import { AudioContext } from 'standardized-audio-context';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';
import cx from 'classnames';

// UI
// TODO: Implement this
import message from '../ui/Message';

// Components
import PositionDrawer from '../PositionDrawer/PositionDrawer';
import MemoriAuth from '../Auth/Auth';
import Chat from '../Chat/Chat';
import StartPanel from '../StartPanel/StartPanel';
import Avatar from '../Avatar/Avatar';
import ChangeMode from '../ChangeMode/ChangeMode';
import Header from '../Header/Header';

// Layout
import DefaultLayout from '../layouts/Default';

// Helpers / Utils
import { getTranslation } from '../../helpers/translations';
import { setLocalConfig, getLocalConfig } from '../../helpers/configuration';
import { hasTouchscreen, stripDuplicates } from '../../helpers/utils';
import { anonTag } from '../../helpers/constants';
import { getErrori18nKey } from '../../helpers/error';
import { getGamificationLevel } from '../../helpers/statistics';

// Styles
import './MemoriWidget.css';
import AttachmentMediaModal from '../AttachmentMediaModal/AttachmentMediaModal';
import AttachmentLinkModal from '../AttachmentLinkModal/AttachmentLinkModal';

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

function setNativeValue(element: Element, value: string) {
  const valueSetter = Object?.getOwnPropertyDescriptor?.(element, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object?.getOwnPropertyDescriptor?.(
    prototype,
    'value'
  )?.set;

  if (
    prototypeValueSetter &&
    valueSetter &&
    valueSetter !== prototypeValueSetter
  ) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  }
}

const typeMessage = (message: string) => {
  let textarea =
    document.querySelector('fieldset#chat-fieldset textarea') ||
    document
      .querySelector('memori-client')
      ?.shadowRoot?.querySelector('fieldset#chat-fieldset textarea');
  if (!textarea) return;

  setNativeValue(textarea, message);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));

  setTimeout(() => {
    let sendButton =
      document.querySelector('button.memori-chat-inputs--send') ||
      document
        .querySelector('memori-client')
        ?.shadowRoot?.querySelector('button.memori-chat-inputs--send');
    if (!sendButton) return;
    (sendButton as HTMLButtonElement).click();
  }, 100);
};

declare global {
  interface Window {
    getMemoriState: typeof getMemoriState;
    typeMessage: typeof typeMessage;
  }
}
window.getMemoriState = getMemoriState;
window.typeMessage = typeMessage;

// Global variables
const silenceSeconds = [2, 3, 5, 10, 15, 20, 30, 60];
let recognizer: SpeechRecognizer | null;
let speechConfig: SpeechConfig;
let speechSynthesizer: SpeechSynthesizer | null;
let audioDestination: SpeakerAudioDestination;

export interface Props {
  memori: Memori;
  memoriConfigs?: MemoriConfig[];
  memoriLang?: string;
  integration?: Integration;
  showShare?: boolean;
  showInstruct?: boolean;
  showInputs?: boolean;
  showDates?: boolean;
  showContextPerLine?: boolean;
  showSettings?: boolean;
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
}

const MemoriWidget = ({
  memori,
  memoriConfigs,
  memoriLang,
  integration,
  showInstruct = false,
  showShare = true,
  preview = false,
  embed = false,
  showInputs = true,
  showDates = false,
  showContextPerLine = false,
  showSettings = false,
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
  const { uploadAsset, getUploadAssetURL, deleteAsset } = client.backend;

  const [instruct, setInstruct] = useState(false);

  const [clickedStart, setClickedStart] = useState(false);
  const [gotErrorInOpening, setGotErrorInOpening] = useState(false);

  const language = memoriConfigs
    ?.find(c => c.memoriConfigID === memori.memoriConfigurationID)
    ?.culture?.split('-')?.[0]
    ?.toUpperCase();
  // eslint-disable-next-line
  const [userLang, setUserLang] = useState(
    memoriLang ??
      memori?.culture?.split('-')?.[0] ??
      language ??
      i18n.language ??
      'IT'
  );
  const integrationConfig = integration?.customData
    ? JSON.parse(integration.customData)
    : null;
  const isMultilanguageEnabled = !!integrationConfig?.multilanguage;

  const [loading, setLoading] = useState(false);
  const [memoriTyping, setMemoriTyping] = useState(false);

  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);
  const [hasUserActivatedListening, setHasUserActivatedListening] =
    useState(false);
  const [showPositionDrawer, setShowPositionDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [muteSpeaker, setMuteSpeaker] = useState(false);
  const [continuousSpeech, setContinuousSpeech] = useState(false);
  const [continuousSpeechTimeout, setContinuousSpeechTimeout] = useState(3);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  useEffect(() => {
    setIsPlayingAudio(!!speechSynthesizer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechSynthesizer]);

  useEffect(() => {
    setMuteSpeaker(getLocalConfig('muteSpeaker', false));
    setContinuousSpeech(getLocalConfig('continuousSpeech', false));
    setContinuousSpeechTimeout(getLocalConfig('continuousSpeechTimeout', 3));
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
    setHistory(history => [...history, { ...message }]);
  };
  const sendMessage = async (
    text: string,
    media?: Medium[],
    newSessionId?: string,
    translate: boolean = true,
    translatedText?: string
  ) => {
    if (!sessionId || !text?.length) return;

    pushMessage({
      text: text,
      translatedText,
      fromUser: true,
      media: media ?? [],
      initial: !!newSessionId,
    });

    setMemoriTyping(true);

    const language = memori.culture?.split('-')?.[0] ?? i18n.language ?? 'IT';
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
      sessionId: newSessionId ?? sessionId,
      text: msg,
    });
    if (response.resultCode === 0 && currentState) {
      const emission = currentState.emission ?? currentDialogState?.emission;
      if (currentState.state === 'X4' && memori.giverTag) {
        const { currentState, ...resp } = await postTagChangedEvent(
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
          console.error(response, resp);
          message.error(t(getErrori18nKey(resp.resultCode)));
        }
      } else if (currentState.state === 'X2d' && memori.giverTag) {
        const { currentState, ...resp } = await postTextEnteredEvent({
          sessionId: newSessionId ?? sessionId,
          text: Math.random().toString().substring(2, 8),
        });

        if (resp.resultCode === 0) {
          const { currentState, ...resp } = await postTagChangedEvent(
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
        translateDialogState(currentState, userLang);
      } else {
        setCurrentDialogState({
          ...currentState,
          emission,
        });

        if (emission)
          pushMessage({
            text: emission,
            media: currentState.media,
            fromUser: false,
          });
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
      ).then(sessionID => {
        console.info('session timeout');
        if (sessionID) {
          setTimeout(() => {
            sendMessage(text, media, sessionID);
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
    const language = memori.culture?.split('-')?.[0] ?? i18n.language ?? 'IT';
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
        };
      }

      if (t.text.length > 0)
        translatedMsg = {
          text: t.text,
          media: state.media,
          fromUser: false,
        };
    }

    setCurrentDialogState(translatedState);
    if (translatedMsg) {
      pushMessage(translatedMsg);
    }

    return translatedState;
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

      const session = await initSession(params);
      if (
        session?.sessionID &&
        session?.currentState &&
        session.resultCode === 0
      ) {
        setSessionId(session.sessionID);
        const language =
          memori.culture?.split('-')?.[0] ?? i18n.language ?? 'IT';

        if (
          !instruct &&
          isMultilanguageEnabled &&
          userLang.toLowerCase() !== language.toLowerCase()
        ) {
          translateDialogState(session.currentState, userLang).then(state => {
            if (state?.emission) {
              history.length <= 1
                ? setHistory([
                    {
                      text: state.emission,
                      media: state.media,
                      fromUser: false,
                      initial: true,
                    },
                  ])
                : pushMessage({
                    text: state.emission,
                    media: state.media,
                    fromUser: false,
                    initial: true,
                  });
            }
          });
        } else {
          setCurrentDialogState(session.currentState);
          if (session.currentState.emission) {
            history.length <= 1
              ? setHistory([
                  {
                    text: session.currentState.emission,
                    media: session.currentState.media,
                    fromUser: false,
                    initial: true,
                  },
                ])
              : pushMessage({
                  text: session.currentState.emission,
                  media: session.currentState.media,
                  fromUser: false,
                  initial: true,
                });
          }
        }

        if (position) applyPosition(position, session.sessionID);

        setLoading(false);
        return {
          dialogState: session.currentState,
          sessionID: session.sessionID,
        } as { dialogState: DialogState; sessionID: string };
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
    initialQuestion?: string
  ) => {
    setLoading(true);
    try {
      const { sessionID, currentState, ...response } = await initSession({
        memoriID: memori.engineMemoriID ?? '',
        password,
        recoveryTokens,
        tag,
        pin,
        initialContextVars,
        initialQuestion,
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
        return sessionID;
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
        // console.debug('[APPCONTEXT/CHANGETAG]', currentState);
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
          fetchSession({
            memoriID: memori.engineMemoriID ?? '',
            password: secret || memori.secretToken,
            tag: memori.giverTag,
            pin: memori.giverPIN,
            initialContextVars,
            initialQuestion,
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
      !listening
    )
      setInteractionTimeout();
  };
  const handleTimeout = async () => {
    if (
      !!speechSynthesizer ||
      isPlayingAudio ||
      !!userMessage.length ||
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
          );
        } else if (emission && emission.length > 0) {
          pushMessage({
            text: emission,
            media: currentState.media,
            fromUser: false,
          });
          setCurrentDialogState(currentState);
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
    if (!!userMessage.length || isPlayingAudio) clearInteractionTimeout();
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

    let memoriAudioElement = document.getElementById(
      'memori-audio'
    ) as HTMLAudioElement;
    if (memoriAudioElement && window.navigator.userAgent.includes('Safari')) {
      memoriAudioElement.muted = false;
      memoriAudioElement
        .play()
        .then(async () => {
          try {
            const context = new AudioContext();
            let buffer = context.createBuffer(1, 1, 22050);
            let source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
          } catch (e) {
            console.error(e);
          }
        })
        .catch((e: any) => {
          console.error('error playing intro audio', e);
        });
    }
  };
  useEffect(() => {
    return () => {
      if (audioDestination) audioDestination.pause();
      if (speechSynthesizer) {
        speechSynthesizer.close();
        speechSynthesizer = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    let voiceLang = (lang ?? memori.culture?.split('-')?.[0] ?? i18n.language,
    'IT').toUpperCase();
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
      default:
        voice = 'it-IT';
        break;
    }
    return voice;
  };

  const [phonemesMap, setPhonemesMap] = useState<{
    [ns: 'common' | string]: {
      [word: string]: { [lang: 'default' | string]: string };
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

  const replaceTextWithPhonemes = (text: string, lang: string) => {
    if (!phonemesMap) return text;

    const phonemes = {
      ...(phonemesMap.common ?? {}),
      ...(tenant?.id && phonemesMap[tenant.id] ? phonemesMap[tenant.id] : {}),
    };
    const phonemesPairs = Object.keys(phonemes).map(word => {
      const phoneme = phonemes[word][lang] ?? phonemes[word].default;
      return { word, phoneme };
    });
    const ssmlText = phonemesPairs.reduce((acc, { word, phoneme }) => {
      return acc.replace(
        new RegExp(word, 'gi'),
        `<phoneme alphabet="ipa" ph="${phoneme}">${word}</phoneme>`
      );
    }, text);

    return ssmlText;

    // E.g.:
    // return text.replace(
    //   /martius/gi,
    //   `<phoneme alphabet="ipa" ph="??ma??r??tzius">Martius</phoneme>`,
    // )
    // .replace(
    //   /rawmaterial/gi,
    //   `<phoneme alphabet="ipa" ph="??pippo">RawMaterial</phoneme>`,
    // )
    // .replace(/qfe/gi, `<sub alias="Quota Filo Erba">QFE</sub>`)
  };

  const speak = (text: string, fireListeningEvent = true): void => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) return;

    if (preview || !hasUserActivatedSpeak) return;
    if (audioDestination) audioDestination.pause();
    if (speechSynthesizer) {
      speechSynthesizer.close();
      speechSynthesizer = null;
    }

    if (muteSpeaker && fireListeningEvent) {
      setTimeout(() => {
        // trigger start continuous listening if set, see MemoriChat
        document.dispatchEvent(new Event('endSpeakStartListen'));
      }, 3000);
      return;
    } else if (muteSpeaker) {
      return;
    }

    audioDestination = new speechSdk.SpeakerAudioDestination();
    let audioConfig = speechSdk.AudioConfig.fromSpeakerOutput(audioDestination);
    speechSynthesizer = new speechSdk.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

    audioDestination.onAudioEnd = () => {
      setIsPlayingAudio(false);

      if (fireListeningEvent) {
        // trigger start continuous listening if set, see MemoriChat
        document.dispatchEvent(new Event('endSpeakStartListen'));
      }
    };

    // speechSynthesizer.visemeReceived = function (s, e) {
    //   window.console.log(
    //     '(Viseme), Audio offset: ' +
    //       e.audioOffset / 10000 +
    //       'ms. Viseme ID: ' +
    //       e.visemeId,
    //     e,
    //   );

    //   // `Animation` is an xml string for SVG or a json string for blend shapes
    //   // var animation = e.Animation;
    // };

    setIsPlayingAudio(true);
    speechSynthesizer.speakSsmlAsync(
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" xml:lang="${getCultureCodeByLanguage(
        userLang
      )}"><voice name="${getTTSVoice(userLang)}"><s>${replaceTextWithPhonemes(
        text,
        userLang.toLowerCase()
      )}</s></voice></speak>`,
      result => {
        if (result) {
          try {
            if (speechSynthesizer) {
              speechSynthesizer.close();
              speechSynthesizer = null;
            }
          } catch (e) {
            console.error('speak error: ', e);
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
            setIsPlayingAudio(false);
          }
        } else {
          setIsPlayingAudio(false);
        }
      },
      error => {
        console.error('speak:', error);
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        setIsPlayingAudio(false);
      }
    );
  };
  const stopAudio = () => {
    if (speechSynthesizer) {
      speechSynthesizer.close();
      speechSynthesizer = null;
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
      if (message.length > 0) {
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
    if (transcript?.length > 0) {
      const transcriptMessage = stripDuplicates(transcript);
      if (transcriptMessage.length > 0) setUserMessage(transcriptMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  /**
   * Listening methods
   */
  const startListening = () => {
    if (!AZURE_COGNITIVE_SERVICES_TTS_KEY) return;

    clearListening();
    setTranscript('');

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
            if (e.result.reason === speechSdk.ResultReason.RecognizedSpeech) {
              setTranscript(e.result.text ?? '');
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
            if (recognizer) recognizer.stopContinuousRecognitionAsync();
          };
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
      setListening(false);
    }
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

  useEffect(() => {
    if (
      hasUserActivatedSpeak &&
      !preview &&
      !muteSpeaker &&
      history.length > 0 &&
      currentDialogState?.emission
    ) {
      speak(currentDialogState.emission, currentDialogState.state !== 'Z0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDialogState, hasUserActivatedSpeak]);

  /**
   * Speech recognition event handlers
   */
  const [requestedListening, setRequestedListening] = useState(false);
  const onEndSpeakStartListen = useCallback(
    (_e: Event) => {
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
    if (!isPlayingAudio && continuousSpeech && hasUserActivatedListening)
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
    setSendOnEnter(stored);
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

  // eslint-disable-next-line
  const [avatar3dVisible, setAvatar3dVisible] = useState(true);

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
    sendMessage(text, undefined, undefined, false, translatedText);
  };

  const onClickStart = async (session?: {
    dialogState: DialogState;
    sessionID: string;
  }) => {
    const sessionID = session?.sessionID || sessionId;
    const dialogState = session?.dialogState || currentDialogState;
    setClickedStart(true);
    initializeTTS();
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
    } else if (!sessionID) {
      setClickedStart(false);
      setGotErrorInOpening(false);
      const session = await fetchSession({
        memoriID: memori.engineMemoriID!,
        password: secret || memori.secretToken,
        tag: personification?.tag,
        pin: personification?.pin,
        initialContextVars,
        initialQuestion,
      });
      onClickStart(session || undefined);
      return;
    } else if (initialSessionID) {
      // check if session is valid and not expired
      const { currentState, ...response } = await getSession(sessionID);
      if (response.resultCode !== 0 || !currentState) {
        console.debug('session expired, opening new session');
        setGotErrorInOpening(true);
        setSessionId(undefined);
        setClickedStart(false);
        onClickStart();
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
            translateDialogState(session.currentState, userLang).finally(() => {
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
            initialQuestion
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
            translateDialogState(session.currentState, userLang).finally(() => {
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
            initialQuestion
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
            translateDialogState(session.currentState, userLang).finally(() => {
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
            initialQuestion
          ).then(() => {
            setHasUserActivatedSpeak(true);
          });
        }
      } else {
        // no need to change tag
        translateDialogState(currentState, userLang).finally(() => {
          setHasUserActivatedSpeak(true);
        });
      }
    } else {
      // reset history
      setHistory([]);

      // everything is fine, just translate dialog state and activate chat
      translateDialogState(dialogState!, userLang).finally(() => {
        setHasUserActivatedSpeak(true);
      });
    }
  };

  const header = (
    <Header
      memori={memori}
      history={history}
      showShare={showShare}
      position={position}
      setShowPositionDrawer={setShowPositionDrawer}
      setShowSettingsDrawer={setShowSettingsDrawer}
      speakerMuted={muteSpeaker}
      setSpeakerMuted={setMuteSpeaker}
      showSettings={showSettings}
      hasUserActivatedSpeak={hasUserActivatedSpeak}
    />
  );

  const avatar = (
    <Avatar
      memori={memori}
      integration={integration}
      integrationConfig={integrationConfig}
      tenant={tenant}
      instruct={instruct}
      avatar3dVisible={avatar3dVisible}
      setAvatar3dVisible={setAvatar3dVisible}
      hasUserActivatedSpeak={hasUserActivatedSpeak}
      isPlayingAudio={isPlayingAudio}
      baseUrl={baseUrl}
    />
  );

  const startPanel = (
    <StartPanel
      memori={memori}
      tenant={tenant}
      gamificationLevel={gamificationLevel}
      language={language}
      userLang={userLang}
      setUserLang={setUserLang}
      baseUrl={baseUrl}
      position={position}
      openPositionDrawer={() => setShowPositionDrawer(true)}
      integrationConfig={integrationConfig}
      instruct={instruct}
      sessionId={sessionId}
      clickedStart={clickedStart}
      onClickStart={onClickStart}
    />
  );

  const chat = sessionId ? (
    <Chat
      memori={memori}
      sessionID={sessionId}
      tenant={tenant}
      translateTo={
        isMultilanguageEnabled &&
        userLang.toUpperCase() !==
          (
            memori.culture?.split('-')?.[0] ??
            i18n.language ??
            'IT'
          )?.toUpperCase()
          ? userLang
          : undefined
      }
      baseUrl={baseUrl}
      memoriTyping={memoriTyping}
      history={history}
      dialogState={currentDialogState}
      setDialogState={setCurrentDialogState}
      pushMessage={pushMessage}
      simulateUserPrompt={simulateUserPrompt}
      showDates={showDates}
      showContextPerLine={showContextPerLine}
      client={client}
      selectReceiverTag={selectReceiverTag}
      preview={preview}
      sendOnEnter={sendOnEnter}
      setSendOnEnter={setSendOnEnter}
      attachmentsMenuOpen={attachmentsMenuOpen}
      setAttachmentsMenuOpen={setAttachmentsMenuOpen}
      instruct={instruct}
      showInputs={showInputs}
      showMicrophone={!!AZURE_COGNITIVE_SERVICES_TTS_KEY}
      userMessage={userMessage}
      onChangeUserMessage={onChangeUserMessage}
      sendMessage={(msg: string) => {
        stopListening();
        sendMessage(msg);
        setUserMessage('');
        resetTranscript();
      }}
      stopListening={clearListening}
      startListening={startListening}
      stopAudio={stopAudio}
      resetTranscript={resetTranscript}
      listening={listening}
      isPlayingAudio={isPlayingAudio}
    />
  ) : null;

  const integrationBackground =
    integration && globalBackgroundUrl ? (
      <div className="memori--global-background">
        <div
          className="memori--global-background-image"
          style={{ backgroundImage: globalBackgroundUrl }}
        />
      </div>
    ) : null;

  const integrationStyle = integration ? (
    <style dangerouslySetInnerHTML={{ __html: integrationStylesheet }} />
  ) : null;

  const onChangeMode = (mode: 'instruct' | 'test') => {
    setInstruct(mode === 'instruct');
    setHasUserActivatedSpeak(false);
    setClickedStart(false);
  };
  const changeMode = (
    <ChangeMode
      canInstruct={!!memori.giverTag}
      instruct={instruct}
      onChangeMode={onChangeMode}
    />
  );

  return (
    <div
      className={cx('memori', 'memori-widget', {
        'memori--preview': preview,
        'memori--embed': embed,
        'memori--with-integration': integration,
        'memori--active': hasUserActivatedSpeak,
      })}
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
      <DefaultLayout
        header={header}
        avatar={avatar}
        chat={chat}
        startPanel={startPanel}
        integrationStyle={integrationStyle}
        integrationBackground={integrationBackground}
        changeMode={changeMode}
        sessionId={sessionId}
        hasUserActivatedSpeak={hasUserActivatedSpeak}
        showInstruct={showInstruct}
        loading={loading}
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
            if (values['tokens']) setMemoriTokens(values['tokens']);

            reopenSession(
              !sessionId,
              values['password'],
              values['tokens'],
              instruct ? memori.giverTag : undefined,
              instruct ? memori.giverPIN : undefined,
              initialContextVars,
              initialQuestion
            )
              .then(() => {
                setAuthModalState(null);
                setHasUserActivatedSpeak(true);
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

      {sessionId && (
        <AttachmentLinkModal
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
      {authToken && sessionId && tenant?.id && (
        <AttachmentMediaModal
          visible={attachmentsMenuOpen === 'media'}
          authToken={authToken}
          tenantID={tenant?.id}
          sessionID={sessionId}
          uploadAssetURL={client.backend.getUploadAssetURL(
            authToken,
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
