// Improved useTTS.ts with race condition fix
import { useState, useCallback, useEffect, useRef } from 'react';
import { sanitizeText } from '../sanitizer';
import { getLocalConfig } from '../configuration';
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
  // Get viseme methods from your context
  const { addViseme, resetVisemeQueue, startProcessing, stopProcessing } =
    useViseme();
  const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = useState(false);

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
      console.log('[useTTS] Loading viseme data:', visemeData);
      resetVisemeQueue();
      visemeLoadedRef.current = false;

      if (visemeData && visemeData.length > 0) {
        visemeData.forEach(viseme => {
          addViseme(viseme.visemeId, viseme.audioOffset);
        });
        visemeLoadedRef.current = true;
        console.log('[useTTS] Viseme data loaded successfully');
        return true;
      } else {
        console.log('[useTTS] No viseme data to load');
        return false;
      }
    },
    [addViseme, resetVisemeQueue]
  );

  // Create audio wrapper for viseme processing
  const createAudioWrapper = useCallback(() => {
    console.log('[useTTS] Creating audio wrapper');
    if (!audioRef.current) {
      console.log('[useTTS] No audio ref available');
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
      console.log('[useTTS] Audio paused');
      wrapper.state = 'suspended';
      if (wrapper.onstatechange) {
        wrapper.onstatechange.call(null as any, new Event('statechange'));
      }
    };

    const handlePlay = () => {
      console.log('[useTTS] Audio playing');
      wrapper.state = 'running';
      if (wrapper.onstatechange) {
        wrapper.onstatechange.call(null as any, new Event('statechange'));
      }
    };

    const handleEnded = () => {
      console.log('[useTTS] Audio ended');
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
      console.log('[useTTS] Cleaning up audio wrapper event listeners');
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
    console.log('[useTTS] Performing cleanup');
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

    // Clear chunk audio reference
    if (currentChunkAudioRef.current) {
      currentChunkAudioRef.current = null;
    }

    visemeLoadedRef.current = false;
    // Don't reset isSpeakingRef here - let the speak function manage it
  }, [stopProcessing]);

  /**
   * Stops audio playback and cleans up
   */
  const stop = useCallback((): void => {
    console.log('[useTTS] Stopping audio playback');
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
    console.log('[useTTS] Emitting end speak event');
    const e = new CustomEvent('MemoriEndSpeak');
    document.dispatchEvent(e);

    if (options.continuousSpeech && options.onEndSpeakStartListen) {
      options.onEndSpeakStartListen();
    }
  }, [options.continuousSpeech, options.onEndSpeakStartListen]);

  // Helper per creare i chunk
  const createChunks = useCallback(
    (text: string, maxLength: number = 800): string[] => {
      console.log('[useTTS] Creating chunks for text:', text.substring(0, 50) + '...');
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

      console.log('[useTTS] Created chunks:', chunks.length);
      return chunks;
    },
    []
  );

  // Helper per riprodurre un singolo chunk
  // Helper function to handle text-to-speech for a single chunk of text
  const speakChunk = useCallback(
    async (chunkText: string): Promise<void> => {
      console.log('[useTTS] Speaking chunk:', chunkText.substring(0, 50) + '...');
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
      console.log('[useTTS] Created audio URL for chunk');

      // Clean up if speaking was cancelled
      if (!isSpeakingRef.current || !isMountedRef.current) {
        console.log('[useTTS] Speaking cancelled, cleaning up');
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
          console.log('[useTTS] Loaded viseme data:', hasVisemeData);
        } catch (err) {
          console.error('[useTTS] Error parsing viseme data:', err);
        }
      }

      // Clean up if speaking was cancelled
      if (!isSpeakingRef.current || !isMountedRef.current) {
        console.log('[useTTS] Speaking cancelled after viseme load, cleaning up');
        URL.revokeObjectURL(audioUrl);
        return;
      }

      // Create audio element with Android optimizations
      const audio = new Audio();
      audio.preload = 'auto'; // Force preloading for Android compatibility
      audio.src = audioUrl;
      audioRef.current = audio;
      currentChunkAudioRef.current = audio;

      // Create audio wrapper for viseme processing if needed
      if (hasVisemeData) {
        audioWrapperRef.current = createAudioWrapper();
      }

      // Return promise that resolves when audio finishes playing
      return new Promise<void>((resolve, reject) => {
        if (!audioRef.current) {
          console.error('[useTTS] Audio element not found');
          reject(new Error('Audio element not found'));
          return;
        }

        const handleCanPlay = async () => {
          try {
            // Check if playback was cancelled
            if (!isSpeakingRef.current || !isMountedRef.current) {
              console.log('[useTTS] Playback cancelled before starting');
              URL.revokeObjectURL(audioUrl);
              resolve();
              return;
            }

            // Play audio first, then start viseme processing
            try {
              console.log('[useTTS] Starting audio playback');
              // Start viseme processing AFTER audio starts playing
              if (hasVisemeData && audioWrapperRef.current) {
                startProcessing(
                  audioWrapperRef.current as unknown as IAudioContext
                );
              }
              await audioRef.current?.play();
            } catch (playError) {
              console.log('[useTTS] First playback attempt failed, retrying:', playError);
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
            console.error('[useTTS] Error during playback:', e);
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
          console.log('[useTTS] Audio chunk finished playing');
          // Clean up resources
          URL.revokeObjectURL(audioUrl);
          if (currentChunkAudioRef.current === audio) {
            currentChunkAudioRef.current = null;
          }
          resolve();
        };

        // Handle audio errors
        audioRef.current.onerror = () => {
          console.error('[useTTS] Audio playback error');
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
    ]
  );

  /**
   * Sintetizza il testo in audio e lo riproduce
   */
  const speak = useCallback(
    async (text: string): Promise<void> => {
      console.log('[useTTS] Speak called with text:', text.substring(0, 50) + '...');
      
      if (!isMountedRef.current) {
        console.log('[useTTS] Component not mounted, exiting');
        return;
      }

      // Early exit conditions before setting speaking flag
      if (!text || !text.trim() || options.preview) {
        console.log('[useTTS] Early exit - empty text or preview mode');
        emitEndSpeakEvent();
        return;
      }

      // If speaker is muted, completely disable TTS functionality
      if (speakerMuted) {
        console.log('[useTTS] Speaker is muted');
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
        console.log('[useTTS] Stopping existing playback');
        stop();
      }

      // Now check if we're already processing a request
      if (isSpeakingRef.current) {
        console.log('[useTTS] Already speaking, exiting');
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
        console.log('[useTTS] Created chunks:', chunks.length);

        // Riproduci tutti i chunk in sequenza
        // Il loop itera su ogni chunk di testo che deve essere riprodotto
        for (let i = 0; i < chunks.length; i++) {
          console.log('[useTTS] Processing chunk', i + 1, 'of', chunks.length);
          
          // Controlla se il componente è ancora montato e se non è stato interrotto
          if (!isSpeakingRef.current || !isMountedRef.current) {
            console.log('[useTTS] Playback interrupted');
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
            console.log('[useTTS] Adding pause between chunks');
            // Crea una Promise che si risolve dopo 300ms
            // Questo crea una pausa tra un chunk e l'altro
            // setTimeout viene wrappato in una Promise per poter usare await
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        console.log('[useTTS] Finished speaking all chunks');
        setIsPlaying(false);
        isSpeakingRef.current = false;
        emitEndSpeakEvent();

        // Dispatch custom event to notify MemoriWidget that audio has ended
        const e = new CustomEvent('MemoriAudioEnded');
        document.dispatchEvent(e);
      } catch (err) {
        console.error('[useTTS] Error during speech:', err);
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
      console.log('[useTTS] Toggling mute state to:', newMuteState);
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
      console.log('[useTTS] Updating global speaking state:', isPlaying);
      (window as any).memoriSpeaking = isPlaying;
    }
  }, [isPlaying]);

  /**
   * Hook per esporre la funzione speak globalmente
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[useTTS] Setting up global speak function');
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
      console.log('[useTTS] Cleaning up on unmount');
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
