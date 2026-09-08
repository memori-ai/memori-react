import { AnimationMixer, LoopOnce, } from 'three';
import { MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH } from '../../constants';
export class AvatarAnimator {
    constructor() {
        this.mixer = null;
        this.actions = {};
        this.animations = new Map();
        this.currentAnimation = null;
        this.currentSequence = null;
        this.sequenceIndex = 0;
        this.isTransitioning = false;
        this.timeScale = 1.0;
        this.fadeInDuration = 0.8;
        this.fadeOutDuration = 0.8;
        this.avatarType = 'CUSTOM_GLB';
        this.eventListeners = {
            start: [],
            complete: [],
            loop: [],
            transition: [],
            error: [],
        };
        this.initialized = false;
        this.idleRotationCount = 0;
        this.currentIdleAnimation = null;
        this.idleRotationLimit = 5;
        this.lastAnimationTime = null;
    }
    async initialize(scene, preloadedActions, animations = [], avatarType = 'CUSTOM_GLB') {
        if (this.initialized || this.mixer) {
            console.warn('[AvatarAnimator] Already initialized, ignoring duplicate initialization');
            return;
        }
        this.mixer = new AnimationMixer(scene);
        this.avatarType = avatarType;
        this.actions = {};
        this.registerClipsDirectly(animations);
        Object.entries(preloadedActions).forEach(([name, action]) => {
            if (!this.actions[name]) {
                this.actions[name] = action;
                this.registerAnimation(name, action);
            }
        });
        this.setupMixerEvents();
        const idleAnimations = ['Idle1', 'Idle2', 'Idle3', 'Idle4', 'Idle5'];
        let startedSuccessfully = false;
        for (const idleName of idleAnimations) {
            if (this.actions[idleName]) {
                try {
                    const idleAction = this.actions[idleName];
                    idleAction.reset();
                    idleAction.setEffectiveTimeScale(1);
                    idleAction.setEffectiveWeight(1);
                    idleAction.setLoop(Infinity, Infinity);
                    idleAction.play();
                    this.currentAnimation = idleName;
                    this.currentIdleAnimation = idleName;
                    this.idleRotationCount = 0;
                    startedSuccessfully = true;
                    break;
                }
                catch (error) {
                    console.error(`Error starting ${idleName}:`, error);
                }
            }
        }
        if (!startedSuccessfully) {
            console.warn('[AvatarAnimator] Could not start any idle animation directly');
        }
        this.initialized = true;
    }
    registerClipsDirectly(clips) {
        if (!this.mixer)
            return;
        clips.forEach(clip => {
            var _a;
            const action = (_a = this.mixer) === null || _a === void 0 ? void 0 : _a.clipAction(clip);
            if (!action) {
                console.warn(`[AvatarAnimator] Failed to create action for clip: ${clip.name}`);
                return;
            }
            this.actions[clip.name] = action;
            this.registerAnimation(clip.name, action);
        });
    }
    registerAnimation(name, action) {
        const duration = action.getClip().duration;
        let category = 'ACTION';
        let defaultLoopCount = 1;
        let canLoop = false;
        const lowerName = name.toLowerCase();
        if (lowerName.includes('idle')) {
            category = 'IDLE';
            defaultLoopCount = 0;
            canLoop = true;
        }
        else if (lowerName.includes('loading') || lowerName.includes('wait')) {
            category = 'LOADING';
            defaultLoopCount = 0;
            canLoop = true;
        }
        this.animations.set(name, {
            name,
            category,
            duration,
            canLoop,
            defaultLoopCount,
        });
    }
    play(animationName, options = {}) {
        var _a, _b, _c, _d;
        try {
            if (!this.initialized || !this.mixer) {
                console.warn(`[AvatarAnimator] Cannot play ${animationName} - not initialized`);
                return;
            }
            const nextAction = this.actions[animationName];
            if (!nextAction) {
                console.warn(`[AvatarAnimator] Animation not found: ${animationName}`);
                if (options.fallbackToIdle !== false) {
                    const fallbackAnim = Object.keys(this.actions)[0];
                    if (fallbackAnim) {
                        this.play(fallbackAnim, { ...options, fallbackToIdle: false });
                    }
                }
                return;
            }
            const animInfo = this.getAnimationInfo(animationName);
            if (!animInfo) {
                console.warn(`[AvatarAnimator] Animation info not found: ${animationName}`);
                if (options.fallbackToIdle !== false) {
                    this.idle();
                }
                return;
            }
            if (this.currentAnimation === animationName &&
                !this.isTransitioning &&
                options.loopCount === undefined) {
                return;
            }
            if (this.isTransitioning) {
                if (this.currentAnimation) {
                    const currentAction = this.actions[this.currentAnimation];
                    if (currentAction) {
                        currentAction.fadeOut(0.1);
                    }
                }
            }
            const fadeIn = (_a = options.fadeInDuration) !== null && _a !== void 0 ? _a : this.fadeInDuration;
            const fadeOut = (_b = options.fadeOutDuration) !== null && _b !== void 0 ? _b : this.fadeOutDuration;
            const loopCount = (_c = options.loopCount) !== null && _c !== void 0 ? _c : animInfo.defaultLoopCount;
            const timeScale = (_d = options.timeScale) !== null && _d !== void 0 ? _d : this.timeScale;
            const isIdleAnimation = animInfo.category === 'IDLE';
            if (isIdleAnimation) {
                this.currentIdleAnimation = animationName;
                this.idleRotationCount = 0;
            }
            this.emit('transition', {
                from: this.currentAnimation,
                to: animationName,
            });
            if (this.currentAnimation) {
                const currentAction = this.actions[this.currentAnimation];
                if (currentAction) {
                    if (this.currentAnimation === animationName) {
                        currentAction.stop();
                    }
                    else {
                        currentAction.fadeOut(fadeOut);
                    }
                }
            }
            nextAction.reset();
            nextAction.fadeIn(fadeIn);
            nextAction.timeScale = timeScale;
            nextAction.enabled = true;
            if (loopCount === 0) {
                nextAction.setLoop(Infinity, Infinity);
            }
            else {
                nextAction.setLoop(loopCount > 1 ? loopCount : LoopOnce, loopCount > 1 ? loopCount : 1);
                nextAction.clampWhenFinished = true;
            }
            nextAction.play();
            this.currentAnimation = animationName;
            this.isTransitioning = true;
            const transitionDuration = Math.max(fadeIn, fadeOut) * 1000;
            setTimeout(() => {
                this.isTransitioning = false;
            }, transitionDuration);
            this.emit('start', {
                animation: animationName,
                category: animInfo.category,
                loopCount,
            });
        }
        catch (error) {
            console.error(`[AvatarAnimator] Error in play method for ${animationName}:`, error);
            if (options.fallbackToIdle !== false) {
                try {
                    this.idle();
                }
                catch (recoveryError) {
                    console.error('[AvatarAnimator] Failed to recover with idle animation:', recoveryError);
                }
            }
        }
    }
    execute(command) {
        if (!this.initialized) {
            console.warn('[AvatarAnimator] Cannot execute - not initialized');
            return;
        }
        try {
            let loopCount;
            const loopMatch = command.match(/\[loop=(\d+)\]/);
            if (loopMatch) {
                loopCount = parseInt(loopMatch[1], 10);
                command = command.replace(loopMatch[0], '').trim();
            }
            if (command.includes('->')) {
                const sequence = command.split('->').map(s => s.trim());
                this.playSequence(sequence, { loopCount });
            }
            else {
                this.play(command, { loopCount });
            }
        }
        catch (error) {
            console.error('[AvatarAnimator] Error executing animation command:', error);
            this.emit('error', { error, command });
            this.idle();
        }
    }
    processChatEmission(chatEmission, isLoading) {
        if (!this.initialized) {
            console.warn('[AvatarAnimator] Cannot process chat emission - not initialized');
            return;
        }
        const wasInLoadingState = this.getAnimationCategory() === 'LOADING';
        if (isLoading) {
            if (wasInLoadingState) {
                return;
            }
            this.loading();
            return;
        }
        if (!chatEmission) {
            if (this.getAnimationCategory() === 'IDLE') {
                return;
            }
            this.idle(wasInLoadingState
                ? { fadeInDuration: 1.2, fadeOutDuration: 1.0 }
                : undefined);
            return;
        }
        const sequenceMatch = chatEmission.match(/<output class="animation-sequence">(.*?)<\/output>/);
        const animationMatch = chatEmission.match(/<output class="animation">(.*?)(\[loop=(\d+)\])?<\/output>/);
        const emotionMatch = chatEmission.match(/<output class="memori-emotion">(.*?)<\/output>/);
        const transitionOptions = this.calculateTransitionOptions();
        if (sequenceMatch && sequenceMatch[1]) {
            const sequence = sequenceMatch[1].trim();
            if (this.currentSequence &&
                this.currentSequence.join('->') === sequence &&
                this.sequenceIndex < this.currentSequence.length) {
                return;
            }
            this.executeWithTransition(sequence, transitionOptions);
            return;
        }
        if (animationMatch && animationMatch[1]) {
            const animation = animationMatch[1].trim();
            let loopCount;
            if (animationMatch[3]) {
                loopCount = parseInt(animationMatch[3], 10);
            }
            this.play(animation, {
                ...transitionOptions,
                loopCount,
            });
            return;
        }
        if (emotionMatch && emotionMatch[1]) {
            const emotion = emotionMatch[1].trim();
            let matchingAnimations = [];
            if (MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH.find(item => item.english === emotion)) {
                let matchingEmotions = MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH.filter(item => item.english === emotion);
                matchingAnimations = this.getAllAnimationNames().filter(name => matchingEmotions.some(emotion => name.toLowerCase().startsWith(emotion.italian.toLowerCase())));
            }
            else {
                matchingAnimations = this.getAllAnimationNames().filter(name => name.toLowerCase().startsWith(emotion.toLowerCase()));
            }
            if (matchingAnimations.length > 0) {
                const randomIndex = Math.floor(Math.random() * matchingAnimations.length);
                const animationToPlay = matchingAnimations[randomIndex];
                this.play(animationToPlay, transitionOptions);
                return;
            }
        }
        if (this.getAnimationCategory() !== 'IDLE') {
            this.idle(transitionOptions);
        }
    }
    calculateTransitionOptions() {
        var _a, _b;
        const options = {
            fadeInDuration: this.fadeInDuration,
            fadeOutDuration: this.fadeOutDuration,
            timeScale: this.timeScale,
        };
        const currentCategory = this.getAnimationCategory();
        const currentAction = this.currentAnimation
            ? this.actions[this.currentAnimation]
            : null;
        options.fadeOutDuration = 0.8;
        options.fadeInDuration = 0.8;
        if (currentAction) {
            const clip = currentAction.getClip();
            const progress = currentAction.time / clip.duration;
            if (progress > 0.75) {
                options.fadeOutDuration = Math.max(0.4, ((_a = options.fadeOutDuration) !== null && _a !== void 0 ? _a : 0.8) * 0.8);
            }
            else if (progress < 0.25) {
                options.fadeInDuration = Math.max(0.4, ((_b = options.fadeInDuration) !== null && _b !== void 0 ? _b : 0.8) * 0.8);
            }
        }
        return options;
    }
    executeWithTransition(command, options = {}) {
        if (!this.initialized) {
            console.warn('[AvatarAnimator] Cannot execute - not initialized');
            return;
        }
        try {
            let loopCount;
            const loopMatch = command.match(/\[loop=(\d+)\]/);
            if (loopMatch) {
                loopCount = parseInt(loopMatch[1], 10);
                command = command.replace(loopMatch[0], '').trim();
            }
            if (command.includes('->')) {
                const sequence = command.split('->').map(s => s.trim());
                const sequenceOptions = {
                    ...options,
                    loopCount: loopCount || 1,
                };
                this.playSequence(sequence, sequenceOptions);
            }
            else {
                this.play(command, {
                    ...options,
                    loopCount,
                });
            }
        }
        catch (error) {
            console.error('[AvatarAnimator] Error executing animation command:', error);
            this.emit('error', { error, command });
            this.idle();
        }
    }
    idle(options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const idleAnimations = this.getAnimationsByCategory('IDLE');
        if (idleAnimations.length > 0) {
            let availableIdles = idleAnimations;
            if (this.getAnimationCategory() === 'IDLE') {
                availableIdles = idleAnimations.filter(info => info.name !== this.currentAnimation);
                if (availableIdles.length === 0) {
                    availableIdles = idleAnimations;
                }
            }
            const randomIndex = Math.floor(Math.random() * availableIdles.length);
            const selectedIdle = availableIdles[randomIndex].name;
            const transitionOptions = {
                fadeInDuration: (_a = options.fadeInDuration) !== null && _a !== void 0 ? _a : 0.7,
                fadeOutDuration: (_b = options.fadeOutDuration) !== null && _b !== void 0 ? _b : 0.7,
                timeScale: (_c = options.timeScale) !== null && _c !== void 0 ? _c : 0.9,
                loopCount: 0,
                ...options,
            };
            transitionOptions.loopCount = 0;
            this.play(selectedIdle, transitionOptions);
            this.currentIdleAnimation = selectedIdle;
            this.idleRotationCount = 0;
            return;
        }
        else {
            console.warn('[AvatarAnimator] No idle animations available, checking fallback options');
            const loopableAnimations = Array.from(this.animations.values())
                .filter(info => info.canLoop)
                .map(info => info.name);
            if (loopableAnimations.length > 0) {
                const randomIndex = Math.floor(Math.random() * loopableAnimations.length);
                const fallbackAnimation = loopableAnimations[randomIndex];
                this.play(fallbackAnimation, {
                    loopCount: 0,
                    fadeInDuration: (_d = options.fadeInDuration) !== null && _d !== void 0 ? _d : 0.7,
                    fadeOutDuration: (_e = options.fadeOutDuration) !== null && _e !== void 0 ? _e : 0.7,
                    timeScale: (_f = options.timeScale) !== null && _f !== void 0 ? _f : 0.9,
                });
                this.currentIdleAnimation = fallbackAnimation;
                this.idleRotationCount = 0;
            }
            else if (Object.keys(this.actions).length > 0) {
                const firstAnimation = Object.keys(this.actions)[0];
                this.play(firstAnimation, {
                    loopCount: 0,
                    fadeInDuration: (_g = options.fadeInDuration) !== null && _g !== void 0 ? _g : 0.7,
                    fadeOutDuration: (_h = options.fadeOutDuration) !== null && _h !== void 0 ? _h : 0.7,
                    timeScale: (_j = options.timeScale) !== null && _j !== void 0 ? _j : 0.9,
                });
                this.currentIdleAnimation = firstAnimation;
                this.idleRotationCount = 0;
            }
        }
    }
    loading(options = {}) {
        var _a, _b, _c;
        const randomLoading = this.getRandomAnimation('LOADING');
        if (randomLoading) {
            const transitionOptions = {
                loopCount: 0,
                fadeInDuration: (_a = options.fadeInDuration) !== null && _a !== void 0 ? _a : 0.8,
                fadeOutDuration: (_b = options.fadeOutDuration) !== null && _b !== void 0 ? _b : 0.8,
                timeScale: (_c = options.timeScale) !== null && _c !== void 0 ? _c : this.timeScale,
                ...options,
            };
            transitionOptions.loopCount = 0;
            this.play(randomLoading, transitionOptions);
        }
        else {
            console.warn('[AvatarAnimator] No loading animations available, using idle instead');
            this.idle(options);
        }
    }
    playSequence(sequence, options = {}) {
        var _a;
        if (!sequence || sequence.length === 0) {
            console.warn('[AvatarAnimator] Empty animation sequence provided');
            return;
        }
        if (sequence.length > 5) {
            console.warn(`[AvatarAnimator] Sequence too long (${sequence.length}), limiting to 5 animations`);
            sequence = sequence.slice(0, 5);
        }
        const validSequence = sequence.filter(name => this.actions[name]);
        if (validSequence.length === 0) {
            console.error('[AvatarAnimator] No valid animations in sequence, defaulting to idle');
            this.idle();
            return;
        }
        if (this.isTransitioning) {
            setTimeout(() => {
                this.playSequence(sequence, options);
            }, 100);
            return;
        }
        this.currentSequence = [...validSequence];
        this.sequenceIndex = 0;
        const firstAnimationOptions = {
            fadeInDuration: 0.6,
            fadeOutDuration: 0.6,
            loopCount: 1,
            timeScale: (_a = options.timeScale) !== null && _a !== void 0 ? _a : this.timeScale,
        };
        const firstAnimation = validSequence[0];
        this.play(firstAnimation, firstAnimationOptions);
    }
    forceIdle() {
        const idleAnimations = this.getAnimationsByCategory('IDLE');
        if (idleAnimations.length > 0) {
            const forcedIdle = idleAnimations[0].name;
            this.play(forcedIdle, {
                loopCount: 0,
                fadeInDuration: 0.8,
                fadeOutDuration: 0.8,
            });
            this.currentIdleAnimation = forcedIdle;
            this.idleRotationCount = 0;
        }
        else {
            console.error('[AvatarAnimator] No idle animations available for forced transition');
        }
    }
    update(delta) {
        if (!this.initialized || !this.mixer)
            return;
        const clampedDelta = Math.min(delta, 0.1);
        this.mixer.update(clampedDelta);
        if (this.isTransitioning) {
            return;
        }
        if (this.currentSequence && this.currentAnimation) {
            const currentAction = this.actions[this.currentAnimation];
            if (currentAction) {
                const clipDuration = currentAction.getClip().duration;
                const progress = currentAction.time / clipDuration;
                if (progress > 0.85 && !this.isTransitioning) {
                    if (this.sequenceIndex < this.currentSequence.length - 1) {
                        this.sequenceIndex++;
                        const nextAnimation = this.currentSequence[this.sequenceIndex];
                        this.play(nextAnimation, {
                            fadeInDuration: 0.5,
                            fadeOutDuration: 0.5,
                            loopCount: 1,
                        });
                    }
                    else {
                        this.currentSequence = null;
                        this.sequenceIndex = 0;
                        this.idle({
                            fadeInDuration: 0.7,
                            fadeOutDuration: 0.7,
                        });
                    }
                }
            }
        }
        if (this.currentAnimation &&
            this.currentIdleAnimation &&
            this.getAnimationCategory() === 'IDLE') {
            const currentAction = this.actions[this.currentAnimation];
            if (currentAction) {
                const clipDuration = currentAction.getClip().duration;
                const currentTime = currentAction.time % clipDuration;
                const previousTime = this.lastAnimationTime || 0;
                if (previousTime > currentTime + 0.1) {
                    this.idleRotationCount++;
                    if (this.idleRotationCount >= this.idleRotationLimit) {
                        this.idleRotationCount = 0;
                        this.idle({
                            fadeInDuration: 0.6,
                            fadeOutDuration: 0.6,
                        });
                    }
                }
                this.lastAnimationTime = currentTime;
            }
        }
    }
    setupMixerEvents() {
        if (!this.mixer) {
            console.warn('[AvatarAnimator] Cannot setup mixer events - mixer not initialized');
            return;
        }
        this.mixer.addEventListener('loop', event => {
            const action = event.action;
            if (!action || !this.currentAnimation)
                return;
            if (action === this.actions[this.currentAnimation]) {
                this.emit('loop', { animation: this.currentAnimation });
            }
        });
        this.mixer.addEventListener('finished', event => {
            const action = event.action;
            if (!action || !this.currentAnimation)
                return;
            if (action === this.actions[this.currentAnimation]) {
                if (this.isTransitioning) {
                    return;
                }
                this.emit('complete', { animation: this.currentAnimation });
                setTimeout(() => {
                    var _a;
                    if (this.currentSequence &&
                        this.sequenceIndex < this.currentSequence.length - 1) {
                        this.sequenceIndex++;
                        this.play(this.currentSequence[this.sequenceIndex], {
                            fadeInDuration: 0.5,
                            fadeOutDuration: 0.5,
                            loopCount: 1,
                        });
                    }
                    else if (this.currentSequence &&
                        this.sequenceIndex >= this.currentSequence.length - 1) {
                        this.currentSequence = null;
                        this.sequenceIndex = 0;
                        this.idle({
                            fadeInDuration: 0.7,
                            fadeOutDuration: 0.7,
                        });
                    }
                    else if (this.currentAnimation &&
                        ((_a = this.getAnimationInfo(this.currentAnimation)) === null || _a === void 0 ? void 0 : _a.category) !== 'IDLE') {
                        this.idle({
                            fadeInDuration: 0.7,
                            fadeOutDuration: 0.7,
                        });
                    }
                }, 50);
            }
        });
    }
    setTimeScale(timeScale) {
        this.timeScale = timeScale;
        if (this.currentAnimation) {
            const currentAction = this.actions[this.currentAnimation];
            if (currentAction) {
                currentAction.timeScale = timeScale;
            }
        }
    }
    getRandomAnimation(category, exclude = []) {
        const filteredAnimations = Array.from(this.animations.values()).filter(info => info.category === category && !exclude.includes(info.name));
        if (filteredAnimations.length === 0)
            return null;
        const randomIndex = Math.floor(Math.random() * filteredAnimations.length);
        return filteredAnimations[randomIndex].name;
    }
    getAnimationInfo(name) {
        return this.animations.get(name) || null;
    }
    getAnimationCategory() {
        var _a;
        if (!this.currentAnimation)
            return null;
        return ((_a = this.getAnimationInfo(this.currentAnimation)) === null || _a === void 0 ? void 0 : _a.category) || null;
    }
    on(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].push(callback);
        }
    }
    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }
    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                }
                catch (error) {
                    console.error(`Error in ${event} event handler:`, error);
                }
            });
        }
    }
    getCurrentAnimationName() {
        return this.currentAnimation;
    }
    getAvatarType() {
        return this.avatarType;
    }
    isInitialized() {
        return this.initialized;
    }
    getAllAnimationNames() {
        return Array.from(this.animations.keys());
    }
    getAnimationsByCategory(category) {
        return Array.from(this.animations.values()).filter(info => info.category === category);
    }
}
//# sourceMappingURL=AvatarAnimator.js.map