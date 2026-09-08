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
};
export const DEFAULT_AZURE_VOICE = {
    MALE: 'en-US-GuyNeural',
    FEMALE: 'en-US-JennyNeural'
};
export const OPENAI_VOICES = {
    ALL: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    CHARACTERISTICS: {
        'alloy': { gender: 'NEUTRAL', tone: 'BALANCED' },
        'echo': { gender: 'MALE', tone: 'DEEP' },
        'fable': { gender: 'FEMALE', tone: 'EXPRESSIVE' },
        'onyx': { gender: 'MALE', tone: 'AUTHORITATIVE' },
        'nova': { gender: 'FEMALE', tone: 'FRIENDLY' },
        'shimmer': { gender: 'FEMALE', tone: 'BRIGHT' }
    },
    RECOMMENDED: {
        DEFAULT: {
            MALE: 'onyx',
            FEMALE: 'nova',
            NEUTRAL: 'alloy'
        },
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
        DE: {
            MALE: 'onyx',
            FEMALE: 'fable'
        },
        EN: {
            MALE: 'echo',
            FEMALE: 'nova'
        },
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
    }
};
export const DEFAULT_OPENAI_VOICE = 'alloy';
export const PROVIDER_CONFIG = {
    azure: {
        defaultVoice: DEFAULT_AZURE_VOICE.FEMALE,
        defaultRegion: 'westeurope',
        defaultModel: null,
        endpoint: (region) => `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    },
    openai: {
        defaultVoice: DEFAULT_OPENAI_VOICE,
        defaultModel: 'tts-1',
        voices: OPENAI_VOICES.ALL,
        endpoint: 'https://api.openai.com/v1/audio/speech'
    }
};
export function getTTSVoice(lang, provider = 'azure', voiceType = 'FEMALE') {
    const voiceLang = (lang || 'EN').toUpperCase();
    if (provider.toLowerCase() === 'openai') {
        const langMap = OPENAI_VOICES.RECOMMENDED[voiceLang] || OPENAI_VOICES.RECOMMENDED.DEFAULT;
        return langMap[voiceType] || OPENAI_VOICES.RECOMMENDED.DEFAULT[voiceType] || DEFAULT_OPENAI_VOICE;
    }
    else {
        const langVoices = AZURE_VOICES[voiceLang] || DEFAULT_AZURE_VOICE;
        return langVoices[voiceType] || langVoices.FEMALE || DEFAULT_AZURE_VOICE.FEMALE;
    }
}
export function isValidVoice(voice, provider) {
    if (provider.toLowerCase() === 'openai') {
        return OPENAI_VOICES.ALL.includes(voice);
    }
    return /^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(voice);
}
export function getDefaultVoice(provider, voiceType = 'FEMALE') {
    if (provider.toLowerCase() === 'openai') {
        return OPENAI_VOICES.RECOMMENDED.DEFAULT[voiceType] || DEFAULT_OPENAI_VOICE;
    }
    else {
        return DEFAULT_AZURE_VOICE[voiceType] || DEFAULT_AZURE_VOICE.FEMALE;
    }
}
export function getDefaultRegion(provider) {
    return PROVIDER_CONFIG[provider].defaultRegion || null;
}
export function getDefaultModel(provider) {
    return PROVIDER_CONFIG[provider].defaultModel || null;
}
export function ensureValidVoice(voice, provider, voiceType = 'FEMALE') {
    if (!voice || !isValidVoice(voice, provider)) {
        return getDefaultVoice(provider, voiceType);
    }
    return voice;
}
export function createTTSConfiguration(config) {
    const provider = config.provider || 'azure';
    const voiceType = config.voiceType || 'FEMALE';
    return {
        provider,
        voice: config.voice || getDefaultVoice(provider, voiceType),
        model: config.model || getDefaultModel(provider),
        region: config.region || getDefaultRegion(provider),
        tenant: config.tenant || 'www.aisuru.com',
        voiceType
    };
}
//# sourceMappingURL=ttsVoiceUtility.js.map