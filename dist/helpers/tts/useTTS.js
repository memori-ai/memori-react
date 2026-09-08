"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTTS = void 0;
const react_1 = require("react");
const configuration_1 = require("../configuration");
const visemeContext_1 = require("../../context/visemeContext");
function useTTS(config, options = {}, autoStart = false, defaultEnableAudio = true, defaultSpeakerActive = true) {
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [speakerMuted, setSpeakerMuted] = (0, react_1.useState)((0, configuration_1.getLocalConfig)('muteSpeaker', !defaultEnableAudio || !defaultSpeakerActive || autoStart));
    const { addViseme, resetVisemeQueue, startProcessing, stopProcessing } = (0, visemeContext_1.useViseme)();
    const [hasUserActivatedSpeak, setHasUserActivatedSpeak] = (0, react_1.useState)(false);
    const shouldPlayAudio = (text) => {
        const currentSpeakerMuted = (0, configuration_1.getLocalConfig)('muteSpeaker', !defaultEnableAudio);
        return (text &&
            text.trim() &&
            !options.preview &&
            !currentSpeakerMuted &&
            defaultEnableAudio);
    };
    const audioRef = (0, react_1.useRef)(null);
    const audioWrapperRef = (0, react_1.useRef)(null);
    const globalSpeakRef = (0, react_1.useRef)(null);
    const visemeLoadedRef = (0, react_1.useRef)(false);
    const isSpeakingRef = (0, react_1.useRef)(false);
    const timeoutRef = (0, react_1.useRef)(null);
    const isMountedRef = (0, react_1.useRef)(true);
    const currentChunkAudioRef = (0, react_1.useRef)(null);
    const apiUrl = options.apiUrl || '/api/tts';
    const loadVisemeData = (0, react_1.useCallback)((visemeData) => {
        resetVisemeQueue();
        visemeLoadedRef.current = false;
        if (visemeData && visemeData.length > 0) {
            visemeData.forEach(viseme => {
                addViseme(viseme.visemeId, viseme.audioOffset);
            });
            visemeLoadedRef.current = true;
            return true;
        }
        else {
            return false;
        }
    }, [addViseme, resetVisemeQueue]);
    const createAudioWrapper = (0, react_1.useCallback)(() => {
        if (!audioRef.current) {
            return null;
        }
        const wrapper = {
            state: 'running',
            onstatechange: null,
            get currentTime() {
                return audioRef.current ? audioRef.current.currentTime : 0;
            },
        };
        const handlePause = () => {
            wrapper.state = 'suspended';
            if (wrapper.onstatechange) {
                wrapper.onstatechange.call(null, new Event('statechange'));
            }
        };
        const handlePlay = () => {
            wrapper.state = 'running';
            if (wrapper.onstatechange) {
                wrapper.onstatechange.call(null, new Event('statechange'));
            }
        };
        const handleEnded = () => {
            wrapper.state = 'closed';
            if (wrapper.onstatechange) {
                wrapper.onstatechange.call(null, new Event('statechange'));
            }
        };
        audioRef.current.addEventListener('pause', handlePause);
        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('ended', handleEnded);
        const cleanupEventListeners = () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('pause', handlePause);
                audioRef.current.removeEventListener('play', handlePlay);
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
        wrapper.cleanup = cleanupEventListeners;
        return wrapper;
    }, []);
    const cleanup = (0, react_1.useCallback)(() => {
        var _a;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (audioWrapperRef.current && audioWrapperRef.current.cleanup) {
            audioWrapperRef.current.cleanup();
        }
        audioWrapperRef.current = null;
        stopProcessing();
        resetVisemeQueue();
        if ((_a = audioRef.current) === null || _a === void 0 ? void 0 : _a.src) {
            URL.revokeObjectURL(audioRef.current.src);
            audioRef.current = null;
        }
        if (currentChunkAudioRef.current) {
            currentChunkAudioRef.current = null;
        }
        visemeLoadedRef.current = false;
    }, [stopProcessing, resetVisemeQueue]);
    const stop = (0, react_1.useCallback)(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
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
    const emitEndSpeakEvent = (0, react_1.useCallback)(() => {
        const e = new CustomEvent('MemoriEndSpeak');
        document.dispatchEvent(e);
        if (options.continuousSpeech && options.onEndSpeakStartListen) {
            options.onEndSpeakStartListen();
        }
    }, [options.continuousSpeech, options.onEndSpeakStartListen]);
    const createChunks = (0, react_1.useCallback)((text, maxLength = 800) => {
        if (text.length <= maxLength) {
            return [text];
        }
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        let currentChunk = '';
        for (const sentence of sentences) {
            const sentenceWithPunct = sentence.trim() + '.';
            if ((currentChunk + sentenceWithPunct).length > maxLength &&
                currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = sentenceWithPunct;
            }
            else {
                currentChunk += sentenceWithPunct + ' ';
            }
        }
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        return chunks;
    }, []);
    const speakChunk = (0, react_1.useCallback)(async (chunkText) => {
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
                includeVisemes: config.layout === 'ZOOMED_FULL_BODY' ||
                    config.layout === 'FULLPAGE' ||
                    config.layout === 'DEFAULT' ||
                    config.layout === 'TOTEM',
            }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API error: ${response.status}`);
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        if (!shouldPlayAudio(chunkText)) {
            URL.revokeObjectURL(audioUrl);
            return;
        }
        if (!isSpeakingRef.current || !isMountedRef.current) {
            URL.revokeObjectURL(audioUrl);
            return;
        }
        let hasVisemeData = false;
        const visemeDataHeader = response.headers.get('X-Viseme-Data');
        if (visemeDataHeader) {
            try {
                const visemeData = JSON.parse(visemeDataHeader);
                hasVisemeData = loadVisemeData(visemeData);
            }
            catch (err) {
                console.error('[useTTS] Error parsing viseme data:', err);
            }
        }
        if (!isSpeakingRef.current || !isMountedRef.current) {
            URL.revokeObjectURL(audioUrl);
            return;
        }
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = audioUrl;
        audioRef.current = audio;
        currentChunkAudioRef.current = audio;
        if (audioWrapperRef.current && audioWrapperRef.current.cleanup) {
            audioWrapperRef.current.cleanup();
            audioWrapperRef.current = null;
        }
        if (hasVisemeData) {
            audioWrapperRef.current = createAudioWrapper();
        }
        return new Promise((resolve, reject) => {
            var _a;
            if (!audioRef.current) {
                reject(new Error('Audio element not found'));
                return;
            }
            const handleCanPlay = async () => {
                var _a, _b;
                try {
                    if (!isSpeakingRef.current || !isMountedRef.current) {
                        URL.revokeObjectURL(audioUrl);
                        resolve();
                        return;
                    }
                    try {
                        if (hasVisemeData && audioWrapperRef.current) {
                            startProcessing(audioWrapperRef.current);
                        }
                        await ((_a = audioRef.current) === null || _a === void 0 ? void 0 : _a.play());
                    }
                    catch (playError) {
                        await new Promise(r => setTimeout(r, 100));
                        if (hasVisemeData && audioWrapperRef.current) {
                            startProcessing(audioWrapperRef.current);
                        }
                        await ((_b = audioRef.current) === null || _b === void 0 ? void 0 : _b.play());
                    }
                }
                catch (e) {
                    URL.revokeObjectURL(audioUrl);
                    reject(e);
                }
            };
            audioRef.current.addEventListener('canplaythrough', handleCanPlay, {
                once: true,
            });
            audioRef.current.onended = () => {
                URL.revokeObjectURL(audioUrl);
                if (currentChunkAudioRef.current === audio) {
                    currentChunkAudioRef.current = null;
                }
                resolve();
            };
            audioRef.current.onerror = () => {
                URL.revokeObjectURL(audioUrl);
                if (currentChunkAudioRef.current === audio) {
                    currentChunkAudioRef.current = null;
                }
                reject(new Error('Audio playback failed'));
            };
            (_a = audioRef.current) === null || _a === void 0 ? void 0 : _a.load();
        });
    }, [
        config,
        options,
        loadVisemeData,
        createAudioWrapper,
        startProcessing,
        isSpeakingRef,
        isMountedRef,
        speakerMuted,
        defaultEnableAudio,
    ]);
    const speak = (0, react_1.useCallback)(async (text) => {
        if (!isMountedRef.current) {
            return;
        }
        if (!shouldPlayAudio(text)) {
            if (!hasUserActivatedSpeak) {
                setHasUserActivatedSpeak(true);
            }
            emitEndSpeakEvent();
            return;
        }
        if (isPlaying) {
            stop();
        }
        if (isSpeakingRef.current) {
            return;
        }
        isSpeakingRef.current = true;
        if (!hasUserActivatedSpeak) {
            setHasUserActivatedSpeak(true);
        }
        try {
            setIsPlaying(true);
            const chunks = createChunks(text, 500);
            for (let i = 0; i < chunks.length; i++) {
                if (!isSpeakingRef.current || !isMountedRef.current) {
                    break;
                }
                await speakChunk(chunks[i]);
                if (i < chunks.length - 1 &&
                    isSpeakingRef.current &&
                    isMountedRef.current) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
            setIsPlaying(false);
            isSpeakingRef.current = false;
            emitEndSpeakEvent();
            const e = new CustomEvent('MemoriAudioEnded');
            document.dispatchEvent(e);
        }
        catch (err) {
            console.error('[speak] Error during playback:', err);
            setIsPlaying(false);
            isSpeakingRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            cleanup();
            emitEndSpeakEvent();
            const e = new CustomEvent('MemoriAudioEnded');
            document.dispatchEvent(e);
        }
    }, [
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
        defaultEnableAudio,
    ]);
    const toggleMute = (0, react_1.useCallback)((mute) => {
        const newMuteState = mute !== undefined ? mute : !speakerMuted;
        setSpeakerMuted(newMuteState);
        (0, configuration_1.setLocalConfig)('muteSpeaker', newMuteState);
        if (newMuteState && isPlaying) {
            stop();
        }
    }, [speakerMuted, isPlaying, stop, resetVisemeQueue, stopProcessing]);
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            window.memoriSpeaking = isPlaying;
        }
    }, [isPlaying]);
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            globalSpeakRef.current = window.speak;
            window.speak = speak;
            return () => {
                window.speak = globalSpeakRef.current;
            };
        }
    }, [speak]);
    (0, react_1.useEffect)(() => {
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
exports.useTTS = useTTS;
//# sourceMappingURL=useTTS.js.map