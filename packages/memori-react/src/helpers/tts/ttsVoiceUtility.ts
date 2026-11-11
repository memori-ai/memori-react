// tts/voiceUtils.ts
import { TTSConfig } from './useTTS';

// Azure voices organized by language and gender
export const AZURE_VOICES = {
  IT: {
    MALE: 'it-IT-DiegoNeural',
    FEMALE: 'it-IT-ElsaNeural'
  },
  DE: {
    MALE: 'de-DE-ConradNeural', 
    FEMALE: 'de-DE-KatjaNeural'
  },
  EN: {
    MALE: 'en-GB-RyanNeural', 
    FEMALE: 'en-GB-SoniaNeural'
  },
  ES: {
    MALE: 'es-ES-AlvaroNeural', 
    FEMALE: 'es-ES-ElviraNeural'
  },
  FR: {
    MALE: 'fr-FR-HenriNeural', 
    FEMALE: 'fr-FR-DeniseNeural'
  },
  PT: {
    MALE: 'pt-PT-DuarteNeural', 
    FEMALE: 'pt-PT-RaquelNeural'
  },
  UK: {
    MALE: 'uk-UA-OstapNeural', 
    FEMALE: 'uk-UA-PolinaNeural'
  },
  RU: {
    MALE: 'ru-RU-DmitryNeural', 
    FEMALE: 'ru-RU-SvetlanaNeural'
  },
  PL: {
    MALE: 'pl-PL-MarekNeural', 
    FEMALE: 'pl-PL-AgnieszkaNeural'
  },
  FI: {
    MALE: 'fi-FI-HarriNeural', 
    FEMALE: 'fi-FI-SelmaNeural'
  },
  EL: {
    MALE: 'el-GR-NestorasNeural', 
    FEMALE: 'el-GR-AthinaNeural'
  },
  AR: {
    MALE: 'ar-SA-HamedNeural', 
    FEMALE: 'ar-SA-ZariyahNeural'
  },
  ZH: {
    MALE: 'zh-CN-YunxiNeural', 
    FEMALE: 'zh-CN-XiaoxiaoNeural'
  },
  JA: {
    MALE: 'ja-JP-KeitaNeural', 
    FEMALE: 'ja-JP-NanamiNeural'
  },
  // Add more languages as needed
};

// Default Azure voice if language not found
export const DEFAULT_AZURE_VOICE = {
  MALE: 'en-US-GuyNeural',
  FEMALE: 'en-US-JennyNeural'
};

// OpenAI voices mapped to approximate language/gender preferences
// Note: OpenAI voices don't correspond directly to languages, this is an approximation
export const OPENAI_VOICES = {
  ALL: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'], // All available voices
  // Voice characteristics based on OpenAI's documentation
  CHARACTERISTICS: {
    'alloy': { gender: 'NEUTRAL', tone: 'BALANCED' },
    'echo': { gender: 'MALE', tone: 'DEEP' },
    'fable': { gender: 'FEMALE', tone: 'EXPRESSIVE' },
    'onyx': { gender: 'MALE', tone: 'AUTHORITATIVE' },
    'nova': { gender: 'FEMALE', tone: 'FRIENDLY' },
    'shimmer': { gender: 'FEMALE', tone: 'BRIGHT' }
  },
  // Voice recommendations by language and gender
  // This is subjective and can be adjusted based on preference
  RECOMMENDED: {
    DEFAULT: {
      MALE: 'onyx',
      FEMALE: 'nova',
      NEUTRAL: 'alloy'
    },
    // Romance languages
    IT: {
      MALE: 'echo',
      FEMALE: 'nova'
    },
    ES: {
      MALE: 'echo',
      FEMALE: 'shimmer'
    },
    FR: {
      MALE: 'echo',
      FEMALE: 'fable'
    },
    PT: {
      MALE: 'onyx',
      FEMALE: 'shimmer'
    },
    // Germanic languages
    DE: {
      MALE: 'onyx',
      FEMALE: 'fable'
    },
    EN: {
      MALE: 'echo',
      FEMALE: 'nova'
    },
    // Other language families
    ZH: {
      MALE: 'echo',
      FEMALE: 'shimmer'
    },
    JA: {
      MALE: 'echo',
      FEMALE: 'nova'
    },
    RU: {
      MALE: 'onyx',
      FEMALE: 'fable'
    }
    // Add more languages as needed
  }
};

// Default OpenAI voice
export const DEFAULT_OPENAI_VOICE = 'alloy';

// Provider configurations
export const PROVIDER_CONFIG = {
  azure: {
    defaultVoice: DEFAULT_AZURE_VOICE.FEMALE,
    defaultRegion: 'westeurope',
    defaultModel: null, // Azure doesn't use model parameter in the same way
    endpoint: (region: string) => 
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
  },
  openai: {
    defaultVoice: DEFAULT_OPENAI_VOICE,
    defaultModel: 'tts-1',
    voices: OPENAI_VOICES.ALL,
    endpoint: 'https://api.openai.com/v1/audio/speech'
  }
};

/**
 * Gets appropriate voice for the selected provider and language
 * 
 * @param {string} lang - Language code (e.g., 'IT', 'EN')
 * @param {string} provider - TTS provider ('azure' or 'openai')
 * @param {string} voiceType - Voice gender preference ('MALE' or 'FEMALE')
 * @returns {string} Voice identifier for the selected provider
 */
export function getTTSVoice(
  lang?: string, 
  provider: 'azure' | 'openai' = 'azure', 
  voiceType: 'MALE' | 'FEMALE' | 'NEUTRAL' = 'FEMALE'
): string {
  // Normalize language code
  const voiceLang = (lang || 'EN').toUpperCase();
  
  // Handle different providers
  if (provider.toLowerCase() === 'openai') {
    // For OpenAI, get recommended voice by language and gender
    const langMap = OPENAI_VOICES.RECOMMENDED[voiceLang as keyof typeof OPENAI_VOICES.RECOMMENDED] || OPENAI_VOICES.RECOMMENDED.DEFAULT;
    return langMap[voiceType as keyof typeof langMap] || OPENAI_VOICES.RECOMMENDED.DEFAULT[voiceType] || DEFAULT_OPENAI_VOICE;
  } else {
    // For Azure, get neural voice by language and gender
    const langVoices = AZURE_VOICES[voiceLang as keyof typeof AZURE_VOICES] || DEFAULT_AZURE_VOICE;
    return langVoices[voiceType as keyof typeof langVoices] || langVoices.FEMALE || DEFAULT_AZURE_VOICE.FEMALE;
  }
}

/**
 * Validates if a voice is supported by the provider
 * 
 * @param {string} voice - Voice identifier to validate
 * @param {string} provider - TTS provider ('azure' or 'openai')
 * @returns {boolean} True if voice is valid for the provider
 */
export function isValidVoice(voice: string, provider: 'azure' | 'openai'): boolean {
  if (provider.toLowerCase() === 'openai') {
    return OPENAI_VOICES.ALL.includes(voice);
  }
  
  // For Azure, check if it follows the format pattern (simple validation)
  return /^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(voice);
}

/**
 * Gets default voice for the provider
 * 
 * @param {string} provider - TTS provider ('azure' or 'openai')
 * @param {string} voiceType - Voice gender preference ('MALE' or 'FEMALE')
 * @returns {string} Default voice for the provider
 */
export function getDefaultVoice(
  provider: 'azure' | 'openai', 
  voiceType: 'MALE' | 'FEMALE' = 'FEMALE'
): string {
  if (provider.toLowerCase() === 'openai') {
    return OPENAI_VOICES.RECOMMENDED.DEFAULT[voiceType] || DEFAULT_OPENAI_VOICE;
  } else {
    return DEFAULT_AZURE_VOICE[voiceType] || DEFAULT_AZURE_VOICE.FEMALE;
  }
}

/**
 * Get appropriate default region for the provider
 * 
 * @param provider - TTS provider ('azure' or 'openai')
 * @returns Default region for the provider
 */
export function getDefaultRegion(provider: 'azure' | 'openai'): string | null {
  return (PROVIDER_CONFIG[provider] as { defaultRegion: string }).defaultRegion || null;
}

/**
 * Get appropriate default model for the provider
 * 
 * @param provider - TTS provider ('azure' or 'openai')
 * @returns Default model for the provider
 */
export function getDefaultModel(provider: 'azure' | 'openai'): string | null {
  return (PROVIDER_CONFIG[provider] as { defaultModel: string }).defaultModel || null;
}

/**
 * Ensures voice is valid for provider, or returns default
 * 
 * @param voice - Voice to validate
 * @param provider - TTS provider ('azure' or 'openai')
 * @param voiceType - Fallback voice type if invalid
 * @returns Valid voice for the provider
 */
export function ensureValidVoice(
  voice: string, 
  provider: 'azure' | 'openai',
  voiceType: 'MALE' | 'FEMALE' = 'FEMALE'
): string {
  if (!voice || !isValidVoice(voice, provider)) {
    return getDefaultVoice(provider, voiceType);
  }
  return voice;
}

/**
 * Creates the appropriate provider-specific TTS configuration
 * 
 * @param config - Base TTS configuration
 * @returns Provider-specific configuration with defaults
 */
export function createTTSConfiguration(config: Partial<TTSConfig>): TTSConfig {
  const provider = config.provider || 'azure';
  const voiceType = (config as { voiceType?: 'MALE' | 'FEMALE' }).voiceType || 'FEMALE';
  
  return {
    provider,
    voice: config.voice || getDefaultVoice(provider, voiceType),
    model: config.model || getDefaultModel(provider),
    region: config.region || getDefaultRegion(provider),
    tenant: config.tenant || 'www.aisuru.com',
    voiceType
  } as TTSConfig;
}