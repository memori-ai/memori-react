// Improved useTTS.ts with race condition fix
import { useState, useCallback, useEffect, useRef } from 'react';
import { sanitizeText } from '../sanitizer';
import { getLocalConfig, setLocalConfig } from '../configuration';
import { useViseme } from '../../context/visemeContext';
import { IAudioContext } from 'standardized-audio-context';
import { isAndroid } from '../utils';

/**
 * Configurazione per il TTS
 */
export interface TTSConfig {
  provider: 'azure' | 'openai';
  voice?: string;
  model?: string;
  region?: string; // richiesto per Azure
  tenant?: string; // Tenant identifier for multi-tenant applications
  layout?: 'DEFAULT' | 'ZOOMED_FULL_BODY' | 'FULLPAGE' | 'TOTEM';
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
  const { addViseme, resetVisemeQueue, startProcessing, stopProcessing } =
    useViseme();
  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);

  // Helper function to check if audio should be played
  const shouldPlayAudio = (text?: string) => {
    const currentSpeakerMuted = getLocalConfig('muteSpeaker', false);
    return (
      text &&
      text.trim() &&
      !options.preview &&
      !currentSpeakerMuted &&
      defaultEnableAudio
    );
  };

  // Riferimenti
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioWrapperRef = useRef<SimpleAudioWrapper | null>(null);
  const globalSpeakRef = useRef<Function | null>(null);
  const visemeLoadedRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const currentChunkAudioRef = useRef<HTMLAudioElement | null>(null);
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
        return false;
      }
    },
    [addViseme, resetVisemeQueue]
  );

  // Create audio wrapper for viseme processing
  const createAudioWrapper = useCallback(() => {
    if (!audioRef.current) {
      return null;
    }

    // Create a clean wrapper for this audio session
    const wrapper: SimpleAudioWrapper = {
      state: 'running',
      onstatechange: null,
      get currentTime() {
        return audioRef.current ? audioRef.current.currentTime : 0;
      },
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
    resetVisemeQueue(); // ADD THIS LINE - ensure viseme queue is cleared

    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }

    // Clear chunk audio reference
    if (currentChunkAudioRef.current) {
      currentChunkAudioRef.current = null;
    }

    visemeLoadedRef.current = false;
    // Don't reset isSpeakingRef here - let the speak function manage it
  }, [stopProcessing, resetVisemeQueue]);

  /**
   * Stops audio playback and cleans up
   */
  const stop = useCallback((): void => {
    // Stop the main audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop the current chunk audio element if it exists
    if (currentChunkAudioRef.current) {
      currentChunkAudioRef.current.pause();
      currentChunkAudioRef.current.currentTime = 0;
      currentChunkAudioRef.current = null;
    }

    setIsPlaying(false);
    cleanup();
    isSpeakingRef.current = false;

    const e = new CustomEvent('MemoriAudioEnded');
    document.dispatchEvent(e);
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

  // Helper per creare i chunk
  const createChunks = useCallback(
    (text: string, maxLength: number = 800): string[] => {
      if (text.length <= maxLength) {
        return [text];
      }

      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const chunks: string[] = [];
      let currentChunk = '';

      for (const sentence of sentences) {
        const sentenceWithPunct = sentence.trim() + '.';
        if (
          (currentChunk + sentenceWithPunct).length > maxLength &&
          currentChunk.length > 0
        ) {
          chunks.push(currentChunk.trim());
          currentChunk = sentenceWithPunct;
        } else {
          currentChunk += sentenceWithPunct + ' ';
        }
      }

      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }

      return chunks;
    },
    []
  );

  // Helper per riprodurre un singolo chunk
  // Helper function to handle text-to-speech for a single chunk of text
  const speakChunk = useCallback(
    async (chunkText: string): Promise<void> => {
      // Make API request to TTS endpoint
      const response = await fetch(options.apiUrl || '/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: chunkText,
          tenant: config.tenant || 'www.aisuru.com',
          voice: config.voice,
          model: config.model || 'tts-1',
          region: config.region,
          provider: config.provider,
          // Include viseme data for certain layout types that need lip sync
          includeVisemes:
            config.layout === 'ZOOMED_FULL_BODY' ||
            config.layout === 'FULLPAGE' ||
            config.layout === 'DEFAULT' ||
            config.layout === 'TOTEM',
        }),
      });

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      // Get audio blob from response and create URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Check if speaker is muted after receiving TTS result
      if (!shouldPlayAudio(chunkText)) {
        URL.revokeObjectURL(audioUrl);
        return;
      }

      // Clean up if speaking was cancelled
      if (!isSpeakingRef.current || !isMountedRef.current) {
        URL.revokeObjectURL(audioUrl);
        return;
      }

      // Parse viseme data from response headers if available
      let hasVisemeData = false;
      const visemeDataHeader = response.headers.get('X-Viseme-Data');
      if (visemeDataHeader) {
        try {
          const visemeData: VisemeData[] = JSON.parse(visemeDataHeader);
          hasVisemeData = loadVisemeData(visemeData);
        } catch (err) {
          console.error('[useTTS] Error parsing viseme data:', err);
        }
      } else {
        console.log('[useTTS] No viseme data in response header');
      }

      // Clean up if speaking was cancelled
      if (!isSpeakingRef.current || !isMountedRef.current) {
        URL.revokeObjectURL(audioUrl);
        return;
      }

      // Create audio element with Android optimizations
      const audio = new Audio();
      audio.preload = 'auto'; // Force preloading for Android compatibility
      audio.src = audioUrl;
      audioRef.current = audio;
      currentChunkAudioRef.current = audio;

      // Clean up previous wrapper before creating a new one
      if (audioWrapperRef.current && (audioWrapperRef.current as any).cleanup) {
        (audioWrapperRef.current as any).cleanup();
        audioWrapperRef.current = null;
      }

      // Create audio wrapper for viseme processing if needed
      if (hasVisemeData) {
        audioWrapperRef.current = createAudioWrapper();
      }

      // Return promise that resolves when audio finishes playing
      return new Promise<void>((resolve, reject) => {
        if (!audioRef.current) {
          reject(new Error('Audio element not found'));
          return;
        }

        const handleCanPlay = async () => {
          try {
            // Check if playback was cancelled
            if (!isSpeakingRef.current || !isMountedRef.current) {
              URL.revokeObjectURL(audioUrl);
              resolve();
              return;
            }

            // Play audio first, then start viseme processing
            try {
              // Start viseme processing AFTER audio starts playing
              if (hasVisemeData && audioWrapperRef.current) {
                startProcessing(
                  audioWrapperRef.current as unknown as IAudioContext
                );
              }
              await audioRef.current?.play();
            } catch (playError) {
              // Retry once for Android compatibility
              await new Promise(r => setTimeout(r, 100));
              if (hasVisemeData && audioWrapperRef.current) {
                startProcessing(
                  audioWrapperRef.current as unknown as IAudioContext
                );
              }
              
              await audioRef.current?.play();
            }
          } catch (e) {
            // Clean up on error
            URL.revokeObjectURL(audioUrl);
            reject(e);
          }
        };

        audioRef.current.addEventListener('canplaythrough', handleCanPlay, {
          once: true,
        });

        // When audio finishes playing
        audioRef.current.onended = () => {
          // Clean up resources
          URL.revokeObjectURL(audioUrl);
          if (currentChunkAudioRef.current === audio) {
            currentChunkAudioRef.current = null;
          }
          resolve();
        };

        // Handle audio errors
        audioRef.current.onerror = () => {
          // Clean up resources
          URL.revokeObjectURL(audioUrl);
          if (currentChunkAudioRef.current === audio) {
            currentChunkAudioRef.current = null;
          }
          reject(new Error('Audio playback failed'));
        };

        // Start loading the audio
        audioRef.current?.load();
      });
    },
    [
      config,
      options,
      loadVisemeData,
      createAudioWrapper,
      startProcessing,
      isSpeakingRef,
      isMountedRef,
      speakerMuted,
    ]
  );

  /**
   * Sintetizza il testo in audio e lo riproduce
   */
  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (!isMountedRef.current) {
        return;
      }

      // Early exit conditions before setting speaking flag
      if (!shouldPlayAudio(text)) {
        // Still set hasUserActivatedSpeak to true when audio is disabled
        // so the chat can start properly
        if (!hasUserActivatedSpeak) {
          setHasUserActivatedSpeak(true);
        }
        emitEndSpeakEvent();
        return;
      }

      // Stop any existing playback first (before checking/setting speaking flag)
      if (isPlaying) {
        stop();
      }

      // Now check if we're already processing a request
      if (isSpeakingRef.current) {
        return;
      }

      // Set the flag after all the early exits and cleanup
      isSpeakingRef.current = true;

      if (!hasUserActivatedSpeak) {
        setHasUserActivatedSpeak(true);
      }

      try {
        setIsPlaying(true);

        // CHUNKING LOGIC: Dividi il testo in chunk se necessario
        const chunks = createChunks(text, 500);

        // Riproduci tutti i chunk in sequenza
        // Il loop itera su ogni chunk di testo che deve essere riprodotto
        for (let i = 0; i < chunks.length; i++) {
          // Controlla se il componente è ancora montato e se non è stato interrotto
          if (!isSpeakingRef.current || !isMountedRef.current) {
            break; // Interrompe il loop se il componente viene smontato
          }

          // Attende che il chunk corrente venga riprodotto prima di passare al successivo
          await speakChunk(chunks[i]);

          // Se ci sono altri chunk da riprodurre, aggiunge una piccola pausa
          if (
            i < chunks.length - 1 &&
            isSpeakingRef.current &&
            isMountedRef.current
          ) {
            // Crea una Promise che si risolve dopo 300ms
            // Questo crea una pausa tra un chunk e l'altro
            // setTimeout viene wrappato in una Promise per poter usare await
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        setIsPlaying(false);
        isSpeakingRef.current = false;
        emitEndSpeakEvent();

        // Dispatch custom event to notify MemoriWidget that audio has ended
        const e = new CustomEvent('MemoriAudioEnded');
        document.dispatchEvent(e);
      } catch (err) {
        console.error('[speak] Error during playback:', err);
        setIsPlaying(false);
        isSpeakingRef.current = false;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        cleanup();

        emitEndSpeakEvent();

        // Dispatch custom event to notify MemoriWidget that audio has ended
        const e = new CustomEvent('MemoriAudioEnded');
        document.dispatchEvent(e);
      }
    },
    [
      config,
      speakerMuted,
      options.preview,
      hasUserActivatedSpeak,
      stop,
      cleanup,
      createChunks,
      speakChunk,
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

      // Update local config for persistence
      setLocalConfig('muteSpeaker', newMuteState);

      if (newMuteState && isPlaying) {
        stop();
      }
      
      // Always clean up viseme state when toggling mute
      // This ensures fresh start when unmuting
      // if (newMuteState) {
      //   console.log('[useTTS] Muting - resetting viseme queue and stopping processing');
      //   resetVisemeQueue();
      //   stopProcessing();
      // } else {
      //   console.log('[useTTS] Unmuting - visemes will restart on next speak call');
      //   // When unmuting, ensure viseme processing can restart properly
      //   // The visemes will be loaded fresh on the next speak call
      // }
    },
    [speakerMuted, isPlaying, stop, resetVisemeQueue, stopProcessing]
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
  };
}
