// Improved useTTS.ts with better viseme handling
import { useState, useCallback, useEffect, useRef } from 'react';
import { sanitizeText } from '../sanitizer';
import { getLocalConfig } from '../configuration';
import Alert from '../../components/ui/Alert';
import { useViseme } from '../../context/visemeContext';
import { IAudioContext } from 'standardized-audio-context';

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

type VisemeData = {
  visemeId: number;
  audioOffset: number;
};

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

// Create our own simplified audio context interface for better typing
interface SimpleAudioWrapper {
  currentTime: number;
  state: 'running' | 'suspended' | 'closed';
  onstatechange: ((this: AudioContext, ev: Event) => any) | null;
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
  // Stato locale
  const [isPlaying, setIsPlaying] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(
    getLocalConfig(
      'muteSpeaker',
      !defaultEnableAudio || !defaultSpeakerActive || autoStart
    )
  );
  // Get viseme methods from your context
  const {
    addViseme,
    resetVisemeQueue,
    startProcessing,
    stopProcessing,
  } = useViseme();
  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Riferimenti
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioWrapperRef = useRef<SimpleAudioWrapper | null>(null);
  const globalSpeakRef = useRef<Function | null>(null);
  const visemeLoadedRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const apiUrl = options.apiUrl || '/api/tts';

  // Load viseme data into the queue
  const loadVisemeData = useCallback(
    (visemeData: VisemeData[]) => {
      resetVisemeQueue();
      visemeLoadedRef.current = false;

      if (visemeData && visemeData.length > 0) {
        visemeData.forEach(viseme => {
          addViseme(viseme.visemeId, viseme.audioOffset);
        });
        visemeLoadedRef.current = true;
        return true;
      } else {
        console.warn('[useTTS] No viseme data available');
        return false;
      }
    },
    [addViseme, resetVisemeQueue]
  );

  // Create audio wrapper for viseme processing
  const createAudioWrapper = useCallback(() => {
    if (!audioRef.current) {
      console.warn('[useTTS] Cannot create audio wrapper: audio element is null');
      return null;
    }

    // Create a clean wrapper for this audio session
    const wrapper: SimpleAudioWrapper = {
      state: 'running',
      onstatechange: null,
      get currentTime() {
        return audioRef.current ? audioRef.current.currentTime : 0;
      }
    };

    // Add event listeners to update the state
    const handlePause = () => {
      wrapper.state = 'suspended';
      if (wrapper.onstatechange) {
        wrapper.onstatechange.call(null as any, new Event('statechange'));
      }
    };

    const handlePlay = () => {
      wrapper.state = 'running';
      if (wrapper.onstatechange) {
        wrapper.onstatechange.call(null as any, new Event('statechange'));
      }
    };

    const handleEnded = () => {
      wrapper.state = 'closed';
      if (wrapper.onstatechange) {
        wrapper.onstatechange.call(null as any, new Event('statechange'));
      }
    };

    // Attach event listeners to the audio element
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('ended', handleEnded);

    // Store cleanup function
    const cleanupEventListeners = () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };

    // Store the cleanup function on the wrapper for later use
    (wrapper as any).cleanup = cleanupEventListeners;

    return wrapper;
  }, []);

  /**
   * Performs a complete cleanup of audio and viseme resources
   */
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (audioWrapperRef.current && (audioWrapperRef.current as any).cleanup) {
      (audioWrapperRef.current as any).cleanup();
    }
    audioWrapperRef.current = null;
    
    stopProcessing();
    
    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    
    visemeLoadedRef.current = false;
    isSpeakingRef.current = false;
  }, [stopProcessing]);

  /**
   * Stops audio playback and cleans up
   */
  const stop = useCallback((): void => {
    isSpeakingRef.current = false;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsPlaying(false);
    
    cleanup();
  }, [cleanup]);

  /**
   * Emette l'evento di fine riproduzione
   */
  const emitEndSpeakEvent = useCallback(() => {
    const e = new CustomEvent('MemoriEndSpeak');
    document.dispatchEvent(e);

    if (options.continuousSpeech && options.onEndSpeakStartListen) {
      options.onEndSpeakStartListen();
    }
  }, [options.continuousSpeech, options.onEndSpeakStartListen]);

  /**
   * Sintetizza il testo in audio e lo riproduce
   */
  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (!isMountedRef.current) {
        return;
      }

      if (isSpeakingRef.current) {
        return;
      }

      if (!text || options.preview || speakerMuted) {
        emitEndSpeakEvent();
        return;
      }

      isSpeakingRef.current = true;

      if (!hasUserActivatedSpeak) {
        setHasUserActivatedSpeak(true);
      }

      try {
        if (isPlaying) {
          stop();
        }

        setIsPlaying(true);
        setError(null);

        const response = await fetch(options.apiUrl || '/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            tenant: config.tenant || 'www.aisuru.com',
            voice: config.voice,
            model: config.model || 'tts-1',
            region: config.region,
            provider: config.provider,
            includeVisemes: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
        
        const visemeDataHeader = response.headers.get('X-Viseme-Data');
        
        let hasVisemeData = false;
        if (visemeDataHeader) {
          try {
            const visemeData: VisemeData[] = JSON.parse(visemeDataHeader);
            hasVisemeData = loadVisemeData(visemeData);
          } catch (err) {
            console.error('[useTTS] Error parsing viseme data:', err);
          }
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!isSpeakingRef.current || !isMountedRef.current) {
          URL.revokeObjectURL(audioUrl);
          return;
        }

        audioRef.current = new Audio(audioUrl);
        
        if (hasVisemeData) {
          audioWrapperRef.current = createAudioWrapper();
        }
        
        audioRef.current.oncanplaythrough = async () => {
          try {
            if (!isSpeakingRef.current || !isMountedRef.current) {
              return;
            }

            if (hasVisemeData && audioWrapperRef.current) {
              startProcessing(audioWrapperRef.current as unknown as IAudioContext);
            }
            
            await audioRef.current?.play();
            
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            
            if (audioRef.current) {
              audioRef.current.oncanplaythrough = null;
            }
          } catch (e: any) {
            cleanup();
            emitEndSpeakEvent();
          }
        };
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          isSpeakingRef.current = false;
          emitEndSpeakEvent();
        };

        audioRef.current.onerror = (e) => {
          console.error('[useTTS] Audio playback error:', e);
          setIsPlaying(false);
          isSpeakingRef.current = false;
          cleanup();
          
          const errorMsg = new Error(`Audio playback failed. This may be due to a network issue or audio format problem.`);
          setError(errorMsg);
          emitEndSpeakEvent();
        };
        
        audioRef.current.load();
        
      } catch (err) {
        console.error('[useTTS] Error during speech synthesis:', err);
        setIsPlaying(false);
        isSpeakingRef.current = false;
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        cleanup();
        const errorMsg = err instanceof Error ? err : new Error(String(err));
        setError(errorMsg);

        try {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(sanitizeText(text));
            window.speechSynthesis.speak(utterance);
          }
        } catch (fallbackErr) {
          // Silently handle fallback errors
        }

        emitEndSpeakEvent();
      }
    },
    [
      config,
      speakerMuted,
      options.preview,
      hasUserActivatedSpeak,
      stop,
      cleanup,
      loadVisemeData,
      createAudioWrapper,
      startProcessing,
      emitEndSpeakEvent,
      isPlaying,
    ]
  );

  /**
   * Imposta lo stato del muto
   */
  const toggleMute = useCallback(
    (mute?: boolean) => {
      const newMuteState = mute !== undefined ? mute : !speakerMuted;
      setSpeakerMuted(newMuteState);

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
    if (typeof window !== 'undefined') {
      (window as any).memoriSpeaking = isPlaying;
    }
  }, [isPlaying]);

  /**
   * Hook per esporre la funzione speak globalmente
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      globalSpeakRef.current = (window as any).speak;
      (window as any).speak = speak;

      return () => {
        (window as any).speak = globalSpeakRef.current;
      };
    }
  }, [speak]);

  /**
   * Pulizia delle risorse al dismount
   */
  useEffect(() => {
    return () => {
      isSpeakingRef.current = false;
      isMountedRef.current = false;
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