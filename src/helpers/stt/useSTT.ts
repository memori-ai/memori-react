// hooks/useSTT.ts - Modified version for Azure WAV support
// Audio format compatibility:
// - MediaRecorder supports: webm, mp4, ogg formats
// - Azure STT supported formats:
//   * WAV format (required for Azure Speech SDK)
//   * webm-16khz-16bit-mono-opus (for REST API)
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
 * Convert audio blob to WAV format
 */
async function convertToWav(audioBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Safari compatibility: check for AudioContext support
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      reject(new Error('AudioContext not supported in this browser'));
      return;
    }

    const audioContext = new AudioContextClass();
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        const arrayBuffer = fileReader.result as ArrayBuffer;

        // Resume context if suspended (required for Safari)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Convert to WAV format
        const wavBlob = audioBufferToWav(audioBuffer);

        // Close the audio context to free resources
        await audioContext.close();

        resolve(wavBlob);
      } catch (error) {
        reject(error);
      }
    };

    fileReader.onerror = () => {
      reject(new Error('Failed to read audio file'));
    };

    fileReader.readAsArrayBuffer(audioBlob);
  });
}

/**
 * Convert AudioBuffer to WAV Blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const numberOfChannels = buffer.numberOfChannels;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);

  // Convert audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(
        -1,
        Math.min(1, buffer.getChannelData(channel)[i])
      );
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Unified hook for handling Speech-to-Text functionality
 */
export function useSTT(
  config: STTConfig,
  processSpeechAndSendMessage: (text: string) => void,
  options: UseSTTOptions = {},
  defaultEnableAudio: boolean = true
) {
  // Local state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [microphoneMuted, setMicrophoneMuted] = useState(
    getLocalConfig('muteMicrophone', !defaultEnableAudio)
  );
  const [hasUserActivatedRecord, setHasUserActivatedRecord] = useState(false);
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
  const backgroundNoiseRef = useRef<number>(0);
  const audioActivityHistoryRef = useRef<number[]>([]);
  const lastStopTimeRef = useRef<number>(0); // Track when recording was last stopped
  const apiUrl = options.apiUrl || '/api/stt';
  const silenceTimeout = options.silenceTimeout || 3; // Increased default to 3 seconds

  const initializeRecording = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
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

      audioStreamRef.current = stream;

      // Initialize audio context for silence detection only if continuous recording is enabled
      if (options.continuousRecording) {
        try {
          // Safari compatibility: check for AudioContext support
          const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass({
              sampleRate: 16000, // Match the audio input sample rate
              latencyHint: 'interactive', // Better for real-time analysis
            });

            // Resume context if suspended (required for Safari)
            if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
            }

            // Wait a bit for Safari to stabilize the AudioContext
            await new Promise(resolve => setTimeout(resolve, 100));

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 512; // Increased for better frequency resolution
            analyserRef.current.smoothingTimeConstant = 0.3; // Reduced for more responsive detection
            analyserRef.current.minDecibels = -90;
            analyserRef.current.maxDecibels = -10;

            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            const source =
              audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            // Initialize audio analysis state
            backgroundNoiseRef.current = 0;
            audioActivityHistoryRef.current = [];
          }
        } catch (err) {
          // Silence detection initialization failed but we can continue
        }
      }

      // Format selection based on provider with Safari compatibility
      let mimeType = '';

      // Safari compatibility: prefer formats that work well on Safari
      const supportedFormats = [
        'audio/mp4', // Best Safari support
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/wav', // Fallback
      ];

      for (const format of supportedFormats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : {}
      );

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Immediately set processing state to prevent ghost messages
        setRecordingState('processing');
        setIsListening(false);

        try {
          if (chunksRef.current.length === 0) {
            throw new Error('No audio data recorded');
          }

          let audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          if (audioBlob.size === 0) {
            throw new Error('Recorded audio is empty');
          }

          // Convert to WAV if using Azure
          if (config.provider === 'azure') {
            try {
              audioBlob = await convertToWav(audioBlob);
            } catch (conversionError) {
              throw new Error(
                'Failed to convert audio to WAV format for Azure'
              );
            }
          }

          const result = await transcribeAudio(audioBlob);

          // Only process if we have meaningful text
          if (result.text && result.text.trim().length > 0) {
            if (processSpeechAndSendMessage) {
              processSpeechAndSendMessage(result.text);
            }

            setLastTranscription(result);

            if (options.onTranscriptionComplete) {
              options.onTranscriptionComplete(result);
            }
          }

          setRecordingState('idle');
        } catch (err) {
          const errorMsg = err instanceof Error ? err : new Error(String(err));
          console.error('STT Error:', errorMsg);
          setRecordingState('error');

          if (options.onError) {
            options.onError(errorMsg);
          }
        } finally {
          chunksRef.current = [];
          isRecordingRef.current = false;
        }
      };

      mediaRecorder.onerror = () => {
        const errorMsg = new Error('Recording failed');
        console.error('STT Error:', errorMsg);
        setRecordingState('error');
        isRecordingRef.current = false;

        if (options.onError) {
          options.onError(errorMsg);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      return true;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to access microphone');
      console.error('STT Error:', errorMsg);
      setRecordingState('error');

      if (options.onError) {
        options.onError(errorMsg);
      }

      return false;
    }
  }, [config.provider, options, silenceTimeout]);

  /**
   * Detect if there's audio activity (not silence)
   * Only works when continuous recording is enabled
   */
  const detectAudioActivity = useCallback((): boolean => {
    if (!options.continuousRecording) {
      return false;
    }

    if (!analyserRef.current || !dataArrayRef.current) {
      return false;
    }

    try {
      // @ts-ignore
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Calculate simple average volume
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const averageVolume = sum / dataArrayRef.current.length;

      // Simple threshold - if volume is above 20, consider it activity
      const hasActivity = averageVolume > 20;

      return hasActivity;
    } catch (error) {
      return false;
    }
  }, [options.continuousRecording]);

  /**
   * Start silence detection monitoring
   * Only works when continuous recording is enabled
   */
  const startSilenceDetection = useCallback(() => {
    if (!options.continuousRecording || !analyserRef.current) {
      return;
    }

    let silenceCount = 0;
    const maxSilenceCount = 30; // 3 seconds of silence (30 * 100ms)

    const checkAudioActivity = () => {
      if (!isRecordingRef.current || !isMountedRef.current) {
        return;
      }

      const hasActivity = detectAudioActivity();

      if (hasActivity) {
        // Reset silence counter when activity is detected
        silenceCount = 0;
      } else {
        // Increment silence counter
        silenceCount++;

        // Stop recording after 3 seconds of silence
        if (silenceCount >= maxSilenceCount) {
          isRecordingRef.current = false;
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === 'recording'
          ) {
            mediaRecorderRef.current.stop();
          }
          return;
        }
      }
    };

    // Check audio activity every 100ms
    const intervalId = setInterval(checkAudioActivity, 100);
    (window as any).memoriSilenceDetectionInterval = intervalId;
  }, [options.continuousRecording, detectAudioActivity]);

  /**
   * Stop silence detection monitoring
   * Only works when continuous recording is enabled
   */
  const stopSilenceDetection = useCallback(() => {
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
      const formData = new FormData();
      let fileExtension = 'webm'; // default fallback

      // Determine file extension based on provider and blob type
      if (config.provider === 'azure') {
        fileExtension = 'wav'; // We convert to WAV for Azure
      } else if (mediaRecorderRef.current?.mimeType) {
        if (mediaRecorderRef.current.mimeType.includes('webm')) {
          fileExtension = 'webm';
        } else if (mediaRecorderRef.current.mimeType.includes('mp4')) {
          fileExtension = 'mp4';
        } else if (mediaRecorderRef.current.mimeType.includes('ogg')) {
          fileExtension = 'ogg';
        }
      }

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

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.result) {
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
    // Prevent immediate restart after stopping (cooldown period)
    const timeSinceLastStop = Date.now() - lastStopTimeRef.current;
    if (timeSinceLastStop < 1000) {
      // 1 second cooldown
      return;
    }

    if (microphoneMuted || recordingState === 'recording') {
      return;
    }

    if (!hasUserActivatedRecord) {
      setHasUserActivatedRecord(true);
    }

    try {
      setRecordingState('recording');

      // Initialize recording if needed
      if (!mediaRecorderRef.current) {
        const initialized = await initializeRecording();
        if (!initialized) {
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
        // Use different timeslice based on recording mode and browser
        // For Safari, use longer timeslice to avoid issues with short recordings
        // For other browsers, use shorter timeslice for real-time analysis
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        const timeslice = isSafari ? 500 : 100; // 500ms for Safari, 100ms for others

        mediaRecorderRef.current.start(timeslice);
        setIsListening(true);

        // Start silence detection if continuous recording is enabled
        if (options.continuousRecording) {
          startSilenceDetection();
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to start recording');
      console.error('STT Error:', errorMsg);
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
    if (!isRecordingRef.current) {
      return;
    }

    try {
      setIsListening(false);

      // Record the stop time for cooldown
      lastStopTimeRef.current = Date.now();

      // Stop silence detection only if continuous recording was enabled
      if (options.continuousRecording) {
        stopSilenceDetection();
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to stop recording');
      console.error('STT Error:', errorMsg);
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
      setMicrophoneMuted(newMuteState);

      if (newMuteState && recordingState === 'recording') {
        stopRecording();
      }
    },
    [microphoneMuted, recordingState, stopRecording]
  );

  /**
   * Clean up resources
   */
  const cleanup = useCallback((): void => {
    isRecordingRef.current = false;

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    // Clean up audio context only if continuous recording was enabled
    if (options.continuousRecording && audioContextRef.current) {
      try {
        // Check if AudioContext is still valid before closing
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (error) {
        // Ignore AudioContext close errors
      }
      audioContextRef.current = null;
    }

    // Stop silence detection only if continuous recording was enabled
    if (options.continuousRecording) {
      stopSilenceDetection();
    }

    // Reset audio analysis state
    analyserRef.current = null;
    dataArrayRef.current = null;

    chunksRef.current = [];
    setIsListening(false);
    setRecordingState('idle');
  }, [options.continuousRecording, stopSilenceDetection]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  /**
   * Update global variables
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).memoriListening = isListening;
    }
  }, [isListening]);

  return {
    // State
    recordingState,
    microphoneMuted,
    hasUserActivatedRecord,
    lastTranscription,
    isListening,

    // Actions
    startRecording,
    stopRecording,
    toggleRecording,
    toggleMute,
    transcribeAudio,
    setHasUserActivatedRecord,

    // Utils
    cleanup,
  };
}
