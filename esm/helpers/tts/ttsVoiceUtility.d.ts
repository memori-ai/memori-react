import { TTSConfig } from './useTTS';
export declare const AZURE_VOICES: {
    IT: {
        MALE: string;
        FEMALE: string;
    };
    DE: {
        MALE: string;
        FEMALE: string;
    };
    EN: {
        MALE: string;
        FEMALE: string;
    };
    ES: {
        MALE: string;
        FEMALE: string;
    };
    FR: {
        MALE: string;
        FEMALE: string;
    };
    PT: {
        MALE: string;
        FEMALE: string;
    };
    UK: {
        MALE: string;
        FEMALE: string;
    };
    RU: {
        MALE: string;
        FEMALE: string;
    };
    PL: {
        MALE: string;
        FEMALE: string;
    };
    FI: {
        MALE: string;
        FEMALE: string;
    };
    EL: {
        MALE: string;
        FEMALE: string;
    };
    AR: {
        MALE: string;
        FEMALE: string;
    };
    ZH: {
        MALE: string;
        FEMALE: string;
    };
    JA: {
        MALE: string;
        FEMALE: string;
    };
};
export declare const DEFAULT_AZURE_VOICE: {
    MALE: string;
    FEMALE: string;
};
export declare const OPENAI_VOICES: {
    ALL: string[];
    CHARACTERISTICS: {
        alloy: {
            gender: string;
            tone: string;
        };
        echo: {
            gender: string;
            tone: string;
        };
        fable: {
            gender: string;
            tone: string;
        };
        onyx: {
            gender: string;
            tone: string;
        };
        nova: {
            gender: string;
            tone: string;
        };
        shimmer: {
            gender: string;
            tone: string;
        };
    };
    RECOMMENDED: {
        DEFAULT: {
            MALE: string;
            FEMALE: string;
            NEUTRAL: string;
        };
        IT: {
            MALE: string;
            FEMALE: string;
        };
        ES: {
            MALE: string;
            FEMALE: string;
        };
        FR: {
            MALE: string;
            FEMALE: string;
        };
        PT: {
            MALE: string;
            FEMALE: string;
        };
        DE: {
            MALE: string;
            FEMALE: string;
        };
        EN: {
            MALE: string;
            FEMALE: string;
        };
        ZH: {
            MALE: string;
            FEMALE: string;
        };
        JA: {
            MALE: string;
            FEMALE: string;
        };
        RU: {
            MALE: string;
            FEMALE: string;
        };
    };
};
export declare const DEFAULT_OPENAI_VOICE = "alloy";
export declare const PROVIDER_CONFIG: {
    azure: {
        defaultVoice: string;
        defaultRegion: string;
        defaultModel: null;
        endpoint: (region: string) => string;
        outputFormat: string;
    };
    openai: {
        defaultVoice: string;
        defaultModel: string;
        voices: string[];
        endpoint: string;
    };
};
export declare function getTTSVoice(lang?: string, provider?: 'azure' | 'openai', voiceType?: 'MALE' | 'FEMALE' | 'NEUTRAL'): string;
export declare function isValidVoice(voice: string, provider: 'azure' | 'openai'): boolean;
export declare function getDefaultVoice(provider: 'azure' | 'openai', voiceType?: 'MALE' | 'FEMALE'): string;
export declare function getDefaultRegion(provider: 'azure' | 'openai'): string | null;
export declare function getDefaultModel(provider: 'azure' | 'openai'): string | null;
export declare function ensureValidVoice(voice: string, provider: 'azure' | 'openai', voiceType?: 'MALE' | 'FEMALE'): string;
export declare function createTTSConfiguration(config: Partial<TTSConfig>): TTSConfig;
