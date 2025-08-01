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
  const apiUrl = options.apiUrl || '/api/tts';

  // Load viseme data into the queue
  const loadVisemeData = useCallback(
    (visemeData: VisemeData[]) => {
      // Make sure we're in a clean state before loading new visemes
      resetVisemeQueue();
      visemeLoadedRef.current = false;

      if (visemeData && visemeData.length > 0) {
        console.log(`[useTTS] Loading ${visemeData.length} viseme events`);
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

    console.log('[useTTS] Created audio wrapper for viseme processing');
    return wrapper;
  }, []);

  /**
   * Performs a complete cleanup of audio and viseme resources
   */
  const cleanup = useCallback(() => {
    console.log('[useTTS] Cleaning up audio and viseme resources');
    
    // First, clean up audio wrapper
    if (audioWrapperRef.current && (audioWrapperRef.current as any).cleanup) {
      (audioWrapperRef.current as any).cleanup();
      console.log('[useTTS] Cleaned up audio wrapper event listeners');
    }
    audioWrapperRef.current = null;
    
    // Then stop viseme processing
    stopProcessing();
    console.log('[useTTS] Stopped viseme processing');
    
    // Finally clean up audio resources
    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src);
      console.log('[useTTS] Revoked audio object URL');
      audioRef.current = null;
    }
    
    // Reset viseme loaded flag
    visemeLoadedRef.current = false;
  }, [stopProcessing]);

  /**
   * Stops audio playback and cleans up
   */
  const stop = useCallback((): void => {
    console.log('[useTTS] Stopping audio playback');
    
    // Pause audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Set UI state
    setIsPlaying(false);
    
    // Clean up all resources
    cleanup();
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
        // Perform complete cleanup of any previous state
        stop();

        // Notifica l'inizio
        setIsPlaying(true);
        setError(null);

        // Sanitizza il testo
        const processedText = sanitizeText(text);
        console.log('[useTTS] Processed text:', processedText);

        // Prepara la richiesta all'API
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
        
        // Extract viseme data from header
        console.log('[useTTS] Checking for viseme data in response headers');
        const visemeDataHeader = response.headers.get('X-Viseme-Data');
        console.log('[useTTS] Viseme data header present:', visemeDataHeader ? 'Yes' : 'No');
        
        let hasVisemeData = false;
        if (visemeDataHeader) {
          console.log('[useTTS] Found viseme data header, attempting to parse');
          try {
            const visemeData: VisemeData[] = JSON.parse(visemeDataHeader);
            console.log('[useTTS] Successfully parsed viseme data, entries:', visemeData.length);
            
            // Load viseme data BEFORE audio setup
            hasVisemeData = loadVisemeData(visemeData);
            console.log('[useTTS] Loaded viseme data into queue:', hasVisemeData);
          } catch (err) {
            console.error('[useTTS] Failed to parse viseme data:', err);
          }
        } else {
          console.log('[useTTS] No viseme data found in response headers');
        }

        // Get audio blob from response
        console.log('[useTTS] Getting audio blob from response');
        const audioBlob = await response.blob();
        console.log('[useTTS] Received audio blob of size:', audioBlob.size);
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('[useTTS] Created audio URL:', audioUrl);

        // Create new audio element
        console.log('[useTTS] Creating new Audio element');
        audioRef.current = new Audio(audioUrl);

        // Set up event listeners for the audio element
        console.log('[useTTS] Configuring audio event handlers');
        
        // Create the audio wrapper first
        if (hasVisemeData) {
          audioWrapperRef.current = createAudioWrapper();
        }
        
        // Configure audio event handlers
        audioRef.current.oncanplaythrough = async () => {
          console.log('[useTTS] Audio can play through, ready to start playback');
          
          try {
            // Start viseme processing if we have data BEFORE playing audio
            if (hasVisemeData && audioWrapperRef.current) {
              console.log('[useTTS] Starting viseme processing before audio playback');
              startProcessing(audioWrapperRef.current as unknown as IAudioContext);
              console.log('[useTTS] Viseme processing started successfully');
            }
            
            // Start audio playback
            console.log('[useTTS] Starting audio playback');
            await audioRef.current?.play();
            console.log('[useTTS] Audio playback started successfully');
            
            // Remove the event handler to avoid calling it multiple times
            if (audioRef.current) {
              audioRef.current.oncanplaythrough = null;
            }
          } catch (e) {
            console.error('[useTTS] Error in canplaythrough handler:', e);
            cleanup();
            emitEndSpeakEvent();
          }
        };
        
        audioRef.current.onended = () => {
          console.log('[useTTS] Audio playback ended normally');
          setIsPlaying(false);
          cleanup(); // This will also stop viseme processing
          emitEndSpeakEvent();
        };

        audioRef.current.onerror = e => {
          console.error('[useTTS] Audio playback error:', e);
          setIsPlaying(false);
          cleanup(); // This will also stop viseme processing
          const errorMsg = new Error(`Audio error: ${e}`);
          setError(errorMsg);
          emitEndSpeakEvent();
        };
        
        // Begin loading the audio
        console.log('[useTTS] Beginning audio load');
        audioRef.current.load();
        
      } catch (err) {
        console.error('[useTTS] Error during speech synthesis:', err);
        setIsPlaying(false);
        cleanup();
        const errorMsg = err instanceof Error ? err : new Error(String(err));
        setError(errorMsg);

        // Fallback to browser's native speech synthesis if available
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