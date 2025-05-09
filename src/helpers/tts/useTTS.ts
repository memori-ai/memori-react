// tts/useTTS.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { sanitizeText } from '../sanitizer';
import { getLocalConfig } from '../configuration';
import Alert from '../../components/ui/Alert';

/**
 * Configurazione per il TTS
 */
export interface TTSConfig {
  provider: 'azure' | 'openai';
  voice?: string;
  model?: string;
  region?: string; // richiesto per Azure
  tenant?: string; // Tenant identifier for multi-tenant applications
}

/**
 * Opzioni per l'hook useTTS
 */
export interface UseTTSOptions {
  apiUrl?: string;
  continuousSpeech?: boolean;
  onEndSpeakStartListen?: () => void;
  preview?: boolean;
  disableSpeaker?: boolean;
}

/**
 * Hook unificato che gestisce la sintesi vocale
 */
export function useTTS(
  config: TTSConfig,
  options: UseTTSOptions = {},
  autoStart: boolean = false,
  defaultEnableAudio: boolean = true,
  defaultSpeakerActive: boolean = true
) {
  console.log('[useTTS] Initializing with config:', config);
  console.log('[useTTS] Options:', options);

  // Stato locale
  const [isPlaying, setIsPlaying] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(
      getLocalConfig(
        'muteSpeaker',
        !defaultEnableAudio || !defaultSpeakerActive || autoStart
      )
  );
  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  // Riferimenti
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const globalSpeakRef = useRef<Function | null>(null);
  const apiUrl = options.apiUrl || '/api/tts';
  console.log(
    'speakerMuted',
    speakerMuted,
    'autoStart',
    autoStart,
    'defaultEnableAudio',
    defaultEnableAudio,
    'defaultSpeakerActive',
    defaultSpeakerActive,
    'getLocalConfig',
    getLocalConfig(
      'muteSpeaker',
      !defaultEnableAudio || !defaultSpeakerActive || autoStart
    )
  );

  /**
   * Cleanup delle risorse audio
   */
  const cleanup = useCallback(() => {
    console.log('[useTTS] Cleaning up audio resources');
    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
  }, []);

  /**
   * Interrompe la riproduzione in corso
   */
  const stop = useCallback((): void => {
    console.log('[useTTS] Stopping audio playback');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      cleanup();
    }
    setIsPlaying(false);
  }, [cleanup]);

  /**
   * Emette l'evento di fine riproduzione
   */
  const emitEndSpeakEvent = useCallback(() => {
    console.log('[useTTS] Emitting end speak event');
    const e = new CustomEvent('MemoriEndSpeak');
    document.dispatchEvent(e);

    // Se è impostato il parlato continuo, avvia l'ascolto
    if (options.continuousSpeech && options.onEndSpeakStartListen) {
      console.log('[useTTS] Starting continuous speech listening');
      options.onEndSpeakStartListen();
    }
  }, [options.continuousSpeech, options.onEndSpeakStartListen]);

  /**
   * Sintetizza il testo in audio e lo riproduce
   */
  const speak = useCallback(
    async (text: string): Promise<void> => {
      console.log('[useTTS] Starting speech synthesis for text:', text);

      // Se non c'è testo, o siamo in preview, o l'audio è disabilitato, non fare nulla
      if (!text || options.preview || speakerMuted) {
        console.log(
          '[useTTS] Speech cancelled - empty text, preview mode, or muted'
        );
        emitEndSpeakEvent();
        return;
      }

      // Aggiorna lo stato di attivazione
      if (!hasUserActivatedSpeak) {
        console.log('[useTTS] First user activation of speak');
        setHasUserActivatedSpeak(true);
      }

      try {
        // Interrompe qualsiasi riproduzione in corso
        stop();

        // Notifica l'inizio
        setIsPlaying(true);
        setError(null);

        // Sanitizza il testo
        const processedText = sanitizeText(text);
        console.log('[useTTS] Processed text:', processedText);

        // Prepara la richiesta all'API (senza inviare l'apiKey dal client)
        console.log(
          '[useTTS] Making API request to:',
          'http://localhost:3000/api/tts',
          config.voice
        );
        const response = await fetch('http://localhost:3000/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: processedText,
            tenant: config.tenant || 'www.aisuru.com', // Usa il tenant specificato o default
            voice: config.voice,
            model: config.model || 'tts-1',
            region: config.region,
            provider: config.provider,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        // Ottiene il blob audio dalla risposta
        const audioBlob = await response.blob();
        console.log('[useTTS] Received audio blob of size:', audioBlob.size);
        const audioUrl = URL.createObjectURL(audioBlob);

        // Crea un elemento audio
        audioRef.current = new Audio(audioUrl);

        // Configura gli eventi dell'audio
        audioRef.current.onended = () => {
          console.log('[useTTS] Audio playback ended normally');
          setIsPlaying(false);
          emitEndSpeakEvent();
          cleanup();
        };

        audioRef.current.onerror = e => {
          console.error('[useTTS] Audio playback error:', e);
          setIsPlaying(false);
          const errorMsg = new Error(`Audio error: ${e}`);
          setError(errorMsg);
          cleanup();
          emitEndSpeakEvent();
        };

        // Riproduci l'audio
        console.log('[useTTS] Starting audio playback');
        await audioRef.current.play();
      } catch (err) {
        console.error('[useTTS] Error during speech synthesis:', err);
        if (err instanceof Error && err.message.includes('play() failed')) {
          setError(err);
        }
        setIsPlaying(false);
        const errorMsg = err instanceof Error ? err : new Error(String(err));
        setError(errorMsg);
        console.error('TTS error:', err);

        // Fallback a sintesi vocale nativa del browser
        try {
          if ('speechSynthesis' in window) {
            console.log('[useTTS] Attempting browser fallback synthesis');
            const utterance = new SpeechSynthesisUtterance(sanitizeText(text));
            window.speechSynthesis.speak(utterance);
          }
        } catch (fallbackErr) {
          console.error(
            '[useTTS] Browser fallback synthesis error:',
            fallbackErr
          );
        }

        emitEndSpeakEvent();
      }
    },
    [
      apiUrl,
      config,
      speakerMuted,
      options.preview,
      hasUserActivatedSpeak,
      stop,
      cleanup,
      emitEndSpeakEvent,
    ]
  );

  /**
   * Imposta lo stato del muto
   */
  const toggleMute = useCallback(
    (mute?: boolean) => {
      const newMuteState = mute !== undefined ? mute : !speakerMuted;
      console.log('[useTTS] Toggling mute state to:', newMuteState);
      setSpeakerMuted(newMuteState);

      // Se stiamo attivando il muto mentre l'audio sta suonando, fermiamo l'audio
      if (newMuteState && isPlaying) {
        stop();
      }
    },
    [speakerMuted, isPlaying, stop]
  );

  /**
   * Aggiorna la variabile globale quando cambia isPlaying
   */
  useEffect(() => {
    console.log('[useTTS] Updating global memoriSpeaking state:', isPlaying);
    if (typeof window !== 'undefined') {
      (window as any).memoriSpeaking = isPlaying;
    }
  }, [isPlaying]);

  /**
   * Hook per esporre la funzione speak globalmente
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[useTTS] Setting up global speak function');
      // Salviamo una referenza alla funzione originale, se esistente
      globalSpeakRef.current = (window as any).speak;

      // Assegniamo la nostra funzione
      (window as any).speak = speak;

      // Pulizia al dismount
      return () => {
        console.log('[useTTS] Cleaning up global speak function');
        // Ripristiniamo la funzione originale se esisteva
        (window as any).speak = globalSpeakRef.current;
      };
    }
  }, [speak]);

  /**
   * Pulizia delle risorse al dismount
   */
  useEffect(() => {
    return () => {
      console.log('[useTTS] Component unmounting, cleaning up');
      stop();
    };
  }, [stop]);

  return {
    speak,
    stop,
    isPlaying,
    speakerMuted,
    toggleMute,
    hasUserActivatedSpeak,
    setHasUserActivatedSpeak,
    error,
    setError,
  };
}
