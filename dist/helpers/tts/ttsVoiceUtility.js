"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTTSConfiguration = exports.ensureValidVoice = exports.getDefaultModel = exports.getDefaultRegion = exports.getDefaultVoice = exports.isValidVoice = exports.getTTSVoice = exports.PROVIDER_CONFIG = exports.DEFAULT_OPENAI_VOICE = exports.OPENAI_VOICES = exports.DEFAULT_AZURE_VOICE = exports.AZURE_VOICES = void 0;
exports.AZURE_VOICES = {
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
exports.DEFAULT_AZURE_VOICE = {
    MALE: 'en-US-GuyNeural',
    FEMALE: 'en-US-JennyNeural'
};
exports.OPENAI_VOICES = {
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
exports.DEFAULT_OPENAI_VOICE = 'alloy';
exports.PROVIDER_CONFIG = {
    azure: {
        defaultVoice: exports.DEFAULT_AZURE_VOICE.FEMALE,
        defaultRegion: 'westeurope',
        defaultModel: null,
        endpoint: (region) => `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    },
    openai: {
        defaultVoice: exports.DEFAULT_OPENAI_VOICE,
        defaultModel: 'tts-1',
        voices: exports.OPENAI_VOICES.ALL,
        endpoint: 'https://api.openai.com/v1/audio/speech'
    }
};
function getTTSVoice(lang, provider = 'azure', voiceType = 'FEMALE') {
    const voiceLang = (lang || 'EN').toUpperCase();
    if (provider.toLowerCase() === 'openai') {
        const langMap = exports.OPENAI_VOICES.RECOMMENDED[voiceLang] || exports.OPENAI_VOICES.RECOMMENDED.DEFAULT;
        return langMap[voiceType] || exports.OPENAI_VOICES.RECOMMENDED.DEFAULT[voiceType] || exports.DEFAULT_OPENAI_VOICE;
    }
    else {
        const langVoices = exports.AZURE_VOICES[voiceLang] || exports.DEFAULT_AZURE_VOICE;
        return langVoices[voiceType] || langVoices.FEMALE || exports.DEFAULT_AZURE_VOICE.FEMALE;
    }
}
exports.getTTSVoice = getTTSVoice;
function isValidVoice(voice, provider) {
    if (provider.toLowerCase() === 'openai') {
        return exports.OPENAI_VOICES.ALL.includes(voice);
    }
    return /^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(voice);
}
exports.isValidVoice = isValidVoice;
function getDefaultVoice(provider, voiceType = 'FEMALE') {
    if (provider.toLowerCase() === 'openai') {
        return exports.OPENAI_VOICES.RECOMMENDED.DEFAULT[voiceType] || exports.DEFAULT_OPENAI_VOICE;
    }
    else {
        return exports.DEFAULT_AZURE_VOICE[voiceType] || exports.DEFAULT_AZURE_VOICE.FEMALE;
    }
}
exports.getDefaultVoice = getDefaultVoice;
function getDefaultRegion(provider) {
    return exports.PROVIDER_CONFIG[provider].defaultRegion || null;
}
exports.getDefaultRegion = getDefaultRegion;
function getDefaultModel(provider) {
    return exports.PROVIDER_CONFIG[provider].defaultModel || null;
}
exports.getDefaultModel = getDefaultModel;
function ensureValidVoice(voice, provider, voiceType = 'FEMALE') {
    if (!voice || !isValidVoice(voice, provider)) {
        return getDefaultVoice(provider, voiceType);
    }
    return voice;
}
exports.ensureValidVoice = ensureValidVoice;
function createTTSConfiguration(config) {
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
exports.createTTSConfiguration = createTTSConfiguration;
//# sourceMappingURL=ttsVoiceUtility.js.map