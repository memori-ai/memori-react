// hooks/useSTT.ts
// Audio format compatibility:
// - MediaRecorder supports: webm, mp4, ogg formats
// - Azure STT supported formats:
//   * webm-16khz-16bit-mono-opus (recommended for this config)
//   * webm-24khz-16bit-24kbps-mono-opus
//   * webm-24khz-16bit-mono-opus
// - OpenAI: Supports multiple formats including webm, mp4, ogg
import { useState, useCallback, useRef, useEffect } from 'react';
import { getLocalConfig } from '../configuration';

/**
 * Configuration for STT
 */
export interface STTConfig {
  provider: 'azure' | 'openai';
  language?: string;
  model?: string;
  region?: string; // required for Azure
  tenant?: string; // Tenant identifier for multi-tenant applications
}

/**
 * Result from STT transcription
 */
export interface STTResult {
  text: string;
  confidence?: number;
  language?: string;
  duration?: number;
}

/**
 * Options for the useSTT hook
 */
export interface UseSTTOptions {
  apiUrl?: string;
  onTranscriptionComplete?: (result: STTResult) => void;
  onError?: (error: Error) => void;
  continuousRecording?: boolean;
  autoStart?: boolean;
  processSpeechAndSendMessage?: (text: string) => void;
  silenceTimeout?: number; // Timeout in milliseconds for silence detection
}

/**
 * Recording states
 */
export type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

/**
 * Unified hook for handling Speech-to-Text functionality
 */
export function useSTT(
  config: STTConfig,
  processSpeechAndSendMessage: (text: string) => void,
  options: UseSTTOptions = {},
  defaultEnableAudio: boolean = true
) {
  console.log('[useSTT] Initializing with config:', config);
  console.log('[useSTT] Options:', options);
  console.log('[useSTT] Default enable audio:', defaultEnableAudio);

  // Local state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [microphoneMuted, setMicrophoneMuted] = useState(
    getLocalConfig('muteMicrophone', !defaultEnableAudio)
  );
  const [hasUserActivatedRecord, setHasUserActivatedRecord] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastTranscription, setLastTranscription] = useState<STTResult | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const apiUrl = options.apiUrl || '/api/stt';
  const silenceTimeout = options.silenceTimeout || 300; // Default 300ms

  // Replace the initializeRecording function in your useSTT.ts with this:

  const initializeRecording = useCallback(async (): Promise<boolean> => {
    console.log('[useSTT] Initializing recording...');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[useSTT] Media recording not supported');
        throw new Error('Media recording is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimal for speech recognition
        },
      });
      console.log('[useSTT] Got media stream');

      audioStreamRef.current = stream;

      // Initialize audio context for silence detection if continuous recording is enabled
      if (options.continuousRecording) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
          
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          
          console.log('[useSTT] Audio context initialized for silence detection');
        } catch (err) {
          console.warn('[useSTT] Failed to initialize audio context for silence detection:', err);
        }
      }

      // Format selection based on provider and browser support
      let mimeType = '';

      if (config.provider === 'azure') {
        // For Azure, prioritize formats that work better with Azure STT
        // Azure supports: WAV, MP3, MP4, OGG, but WebM support is limited

        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          // Last resort - Azure may have issues with this
          mimeType = 'audio/webm';
          console.warn(
            '[useSTT] Using WebM format - Azure compatibility not guaranteed'
          );
        } else {
          // Let browser choose
          mimeType = '';
          console.warn(
            '[useSTT] No preferred format supported, using browser default'
          );
        }
      } else {
        // For OpenAI (Whisper), use existing logic - it handles WebM well
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else {
          mimeType = '';
        }
      }

      console.log(
        `[useSTT] Selected mimeType for ${config.provider}:`,
        mimeType
      );

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : {}
      );

      console.log(
        '[useSTT] Created MediaRecorder with actual mimeType:',
        mediaRecorder.mimeType
      );

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          console.log('[useSTT] Received data chunk of size:', event.data.size);
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('[useSTT] MediaRecorder stopped');
        if (!isRecordingRef.current || !isMountedRef.current) {
          console.log(
            '[useSTT] Recording or component not active, skipping processing'
          );
          return;
        }

        setRecordingState('processing');
        console.log('[useSTT] Processing recorded audio...');

        try {
          if (chunksRef.current.length === 0) {
            console.error('[useSTT] No audio chunks recorded');
            throw new Error('No audio data recorded');
          }

          const audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });
          console.log('[useSTT] Created audio blob of size:', audioBlob.size);

          if (audioBlob.size === 0) {
            console.error('[useSTT] Empty audio blob');
            throw new Error('Recorded audio is empty');
          }

          const result = await transcribeAudio(audioBlob);
          console.log('[useSTT] Transcription result:', result);

          if (processSpeechAndSendMessage) {
            processSpeechAndSendMessage(result.text);
          }

          setLastTranscription(result);

          if (options.onTranscriptionComplete) {
            console.log('[useSTT] Calling transcription complete callback');
            options.onTranscriptionComplete(result);
          }

          setRecordingState('idle');
        } catch (err) {
          console.error('[useSTT] Transcription error:', err);
          const errorMsg = err instanceof Error ? err : new Error(String(err));
          setError(errorMsg);
          setRecordingState('error');

          if (options.onError) {
            options.onError(errorMsg);
          }
        } finally {
          // Reset chunks for next recording
          console.log('[useSTT] Resetting audio chunks');
          chunksRef.current = [];
          isRecordingRef.current = false;
        }
      };

      mediaRecorder.onerror = event => {
        console.error('[useSTT] MediaRecorder error:', event);
        const errorMsg = new Error('Recording failed');
        setError(errorMsg);
        setRecordingState('error');
        isRecordingRef.current = false;

        if (options.onError) {
          options.onError(errorMsg);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      console.log('[useSTT] Recording initialized successfully');
      return true;
    } catch (err) {
      console.error('[useSTT] Failed to initialize recording:', err);
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to access microphone');
      setError(errorMsg);
      setRecordingState('error');

      if (options.onError) {
        options.onError(errorMsg);
      }

      return false;
    }
  }, [config.provider, options, silenceTimeout]); // Add silenceTimeout to dependencies

  /**
   * Detect if there's audio activity (not silence)
   */
  const detectAudioActivity = useCallback((): boolean => {
    if (!analyserRef.current || !dataArrayRef.current) {
      return false;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate average volume level
    const average = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length;
    
    // Consider audio active if average volume is above threshold
    // Adjust this threshold based on your needs
    const threshold = 10; // Adjust this value as needed
    return average > threshold;
  }, []);

  /**
   * Start silence detection monitoring
   */
  const startSilenceDetection = useCallback(() => {
    if (!options.continuousRecording || !analyserRef.current) {
      return;
    }

    console.log('[useSTT] Starting silence detection monitoring');
    
    const checkAudioActivity = () => {
      if (!isRecordingRef.current || !isMountedRef.current) {
        return;
      }

      const hasActivity = detectAudioActivity();
      
      if (hasActivity) {
        // Reset silence timeout when audio activity is detected
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        // Set new timeout for when user stops speaking
        silenceTimeoutRef.current = setTimeout(() => {
          if (isRecordingRef.current && isMountedRef.current) {
            console.log(`[useSTT] Silence detected for ${silenceTimeout}ms, stopping recording`);
            stopRecording();
          }
        }, silenceTimeout);
      }
    };

    // Check audio activity every 50ms for responsive detection
    const intervalId = setInterval(checkAudioActivity, 50);
    
    // Store interval ID for cleanup
    (window as any).memoriSilenceDetectionInterval = intervalId;
  }, [options.continuousRecording, detectAudioActivity, silenceTimeout]);

  /**
   * Stop silence detection monitoring
   */
  const stopSilenceDetection = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if ((window as any).memoriSilenceDetectionInterval) {
      clearInterval((window as any).memoriSilenceDetectionInterval);
      (window as any).memoriSilenceDetectionInterval = null;
    }
  }, []);

  /**
   * Transcribe audio blob using the API
   */
  const transcribeAudio = useCallback(
    async (audioBlob: Blob): Promise<STTResult> => {
      console.log('[useSTT] Starting audio transcription');
      const formData = new FormData();
      // Use appropriate file extension based on the actual recorded format
      // Note: Azure STT can handle various formats, so we use the actual recorded format
      let fileExtension = 'webm'; // default fallback

      if (mediaRecorderRef.current?.mimeType) {
        if (mediaRecorderRef.current.mimeType.includes('webm')) {
          fileExtension = 'webm';
        } else if (mediaRecorderRef.current.mimeType.includes('mp4')) {
          fileExtension = 'mp4';
        } else if (mediaRecorderRef.current.mimeType.includes('ogg')) {
          fileExtension = 'ogg';
        }
      }

      console.log(
        '[useSTT] Using file extension:',
        fileExtension,
        'for mimeType:',
        mediaRecorderRef.current?.mimeType
      );

      formData.append('audio', audioBlob, `recording.${fileExtension}`);
      formData.append('provider', config.provider);
      formData.append('tenant', config.tenant || 'www.aisuru.com');

      if (config.language) {
        formData.append('language', config.language);
      }

      if (config.model) {
        formData.append('model', config.model);
      }

      if (config.region) {
        formData.append('region', config.region);
      }

      console.log('[useSTT] Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('[useSTT] API error response:', response.status);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[useSTT] API response:', data);

      if (!data.success || !data.result) {
        console.error('[useSTT] Invalid API response');
        throw new Error('Invalid response from transcription service');
      }

      return data.result;
    },
    [config, apiUrl]
  );

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async (): Promise<void> => {
    console.log('[useSTT] Starting recording...');
    if (
      !isMountedRef.current ||
      microphoneMuted ||
      recordingState === 'recording'
    ) {
      console.log('[useSTT] Cannot start recording:', {
        mounted: isMountedRef.current,
        muted: microphoneMuted,
        state: recordingState,
      });
      return;
    }

    if (!hasUserActivatedRecord) {
      console.log('[useSTT] First user activation');
      setHasUserActivatedRecord(true);
    }

    try {
      setError(null);
      setRecordingState('recording');

      // Initialize recording if needed
      if (!mediaRecorderRef.current) {
        console.log('[useSTT] Initializing recording...');
        const initialized = await initializeRecording();
        if (!initialized) {
          console.error('[useSTT] Failed to initialize recording');
          return;
        }
      }

      // Reset chunks and start recording
      chunksRef.current = [];
      isRecordingRef.current = true;

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'inactive'
      ) {
        console.log('[useSTT] Starting MediaRecorder');
        mediaRecorderRef.current.start(100); // Collect data every 100ms
        setIsListening(true);
        
        // Start silence detection if continuous recording is enabled
        if (options.continuousRecording) {
          startSilenceDetection();
        }
      }
    } catch (err) {
      console.error('[useSTT] Failed to start recording:', err);
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to start recording');
      setError(errorMsg);
      setRecordingState('error');
      isRecordingRef.current = false;

      if (options.onError) {
        options.onError(errorMsg);
      }
    }
  }, [
    microphoneMuted,
    recordingState,
    hasUserActivatedRecord,
    initializeRecording,
    options,
    startSilenceDetection,
  ]);

  /**
   * Stop recording audio
   */
  const stopRecording = useCallback((): void => {
    console.log('[useSTT] Stopping recording...');
    if (!isRecordingRef.current || recordingState !== 'recording') {
      console.log('[useSTT] Cannot stop recording:', {
        isRecording: isRecordingRef.current,
        state: recordingState,
      });
      return;
    }

    try {
      setIsListening(false);
      
      // Stop silence detection
      stopSilenceDetection();

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        console.log('[useSTT] Stopping MediaRecorder');
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error('[useSTT] Failed to stop recording:', err);
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to stop recording');
      setError(errorMsg);
      setRecordingState('error');
      isRecordingRef.current = false;

      if (options.onError) {
        options.onError(errorMsg);
      }
    }
  }, [recordingState, options, stopSilenceDetection]);

  /**
   * Toggle recording state
   */
  const toggleRecording = useCallback(async (): Promise<void> => {
    console.log('[useSTT] Toggling recording, current state:', recordingState);
    if (recordingState === 'recording') {
      stopRecording();
    } else if (recordingState === 'idle') {
      await startRecording();
    }
  }, [recordingState, startRecording, stopRecording]);

  /**
   * Toggle microphone mute state
   */
  const toggleMute = useCallback(
    (mute?: boolean): void => {
      const newMuteState = mute !== undefined ? mute : !microphoneMuted;
      console.log('[useSTT] Toggling mute state to:', newMuteState);
      setMicrophoneMuted(newMuteState);

      if (newMuteState && recordingState === 'recording') {
        console.log('[useSTT] Stopping recording due to mute');
        stopRecording();
      }
    },
    [microphoneMuted, recordingState, stopRecording]
  );

  /**
   * Clean up resources
   */
  const cleanup = useCallback((): void => {
    console.log('[useSTT] Cleaning up resources');

    isRecordingRef.current = false;

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        console.log('[useSTT] Stopping active recording');
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    if (audioStreamRef.current) {
      console.log('[useSTT] Stopping audio tracks');
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop silence detection
    stopSilenceDetection();

    chunksRef.current = [];
    setIsListening(false);
    setRecordingState('idle');
  }, [stopSilenceDetection]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      console.log('[useSTT] Component unmounting');
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  /**
   * Update global variables
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[useSTT] Updating global listening state:', isListening);
      (window as any).memoriListening = isListening;
    }
  }, [isListening]);

  return {
    // State
    recordingState,
    microphoneMuted,
    hasUserActivatedRecord,
    error,
    lastTranscription,
    isListening,

    // Actions
    startRecording,
    stopRecording,
    toggleRecording,
    toggleMute,
    transcribeAudio,
    setHasUserActivatedRecord,
    setError,

    // Utils
    cleanup,
  };
}
