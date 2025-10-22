// hooks/useSTT.ts - Simplified version for Speech-to-Text functionality
// Audio format compatibility:
// - MediaRecorder supports: webm, mp4, ogg formats
// - Azure STT supported formats: WAV format (required for Azure Speech SDK)
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

        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const wavBlob = audioBufferToWav(audioBuffer);

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
 * Simplified hook for handling Speech-to-Text functionality
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
  const apiUrl = options.apiUrl || '/api/stt';

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
          sampleRate: 16000,
        },
      });

      audioStreamRef.current = stream;

      let mimeType = '';

      const supportedFormats = [
        'audio/mp4',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/wav',
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
      setRecordingState('error');

      if (options.onError) {
        options.onError(errorMsg);
      }

      return false;
    }
  }, [config.provider, options]);


  /**
   * Transcribe audio blob using the API
   */
  const transcribeAudio = useCallback(
    async (audioBlob: Blob): Promise<STTResult> => {
      const formData = new FormData();
      let fileExtension = 'webm';

      if (config.provider === 'azure') {
        fileExtension = 'wav';
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
    if (microphoneMuted || recordingState === 'recording') {
      return;
    }

    if (!hasUserActivatedRecord) {
      setHasUserActivatedRecord(true);
    }

    try {
      setRecordingState('recording');

      if (!mediaRecorderRef.current) {
        const initialized = await initializeRecording();
        if (!initialized) {
          return;
        }
      }

      chunksRef.current = [];
      isRecordingRef.current = true;

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'inactive'
      ) {
        mediaRecorderRef.current.start();
        setIsListening(true);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to start recording');
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

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err : new Error('Failed to stop recording');
      setRecordingState('error');
      isRecordingRef.current = false;

      if (options.onError) {
        options.onError(errorMsg);
      }
    }
  }, [recordingState, options]);

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

    chunksRef.current = [];
    setIsListening(false);
    setRecordingState('idle');
  }, []);

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
