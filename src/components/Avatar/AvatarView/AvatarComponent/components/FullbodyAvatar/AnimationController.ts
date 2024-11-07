import { AnimationState, AnimationConfig } from './types';
import { AnimationAction, AnimationMixer, LoopOnce } from 'three';
import { DEFAULT_CONFIG } from '../constants';

/**
 * Controller class for managing avatar animations and transitions between states
 */
export class AnimationController {
  // Current animation state (LOADING, EMOTION, IDLE)
  private currentState: AnimationState = AnimationState.LOADING;
  // Currently playing animation action
  private currentAction: AnimationAction | null = null;
  // Three.js animation mixer
  private mixer: AnimationMixer;
  // Map of available animation actions
  private actions: Record<string, AnimationAction>;
  // Animation configuration settings
  private config: AnimationConfig;
  // Index of last played idle animation
  private lastIdleIndex: number = -1;
  // Flag to prevent overlapping transitions
  private isTransitioning: boolean = false;
  // Counter for number of times current idle has looped
  private currentIdleLoopCount: number = 0;
  // Maximum number of idle loops before forcing change
  private readonly MAX_IDLE_LOOPS = 5;
  // Timestamp of last animation frame
  private lastAnimationTime: number = 0;
  // Flag to check if chat has already started
  private isChatAlreadyStarted: boolean = false;

  constructor(
    mixer: AnimationMixer,
    actions: Record<string, AnimationAction>,
    config: AnimationConfig = DEFAULT_CONFIG
  ) {
    // console.log('Initializing AnimationController');
    this.mixer = mixer;
    this.actions = actions;
    this.config = config;
  }

  /**
   * Checks if current idle animation has completed a loop
   */
  private checkForLoop() {
    if (!this.currentAction || this.currentState !== AnimationState.IDLE)
      return;

    const clip = this.currentAction.getClip();
    const currentTime = this.currentAction.time;

    // If the current time is less than the last time we recorded,
    // it means the animation has looped
    if (currentTime < this.lastAnimationTime) {
      this.currentIdleLoopCount++;
      // console.log(
      //   `[AnimationController] Loop detected! Count: ${this.currentIdleLoopCount}`
      // );

      // Force idle change after MAX_IDLE_LOOPS
      if (this.currentIdleLoopCount >= this.MAX_IDLE_LOOPS) {
        // console.log(
        //   '[AnimationController] Max loops reached, changing idle animation'
        // );
        this.forceIdleChange();
      }
    }

    this.lastAnimationTime = currentTime;
  }

  /**
   * Forces transition to a new idle animation
   */
  private forceIdleChange() {
    // console.log('[AnimationController] Forcing idle change');
    this.currentIdleLoopCount = 0;
    this.lastAnimationTime = 0;
    this.transitionTo(AnimationState.IDLE);
  }

  /**
   * Selects next random idle animation that differs from last played
   */
  private getNextIdleAnimation(): AnimationAction {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.config.idleCount) + 1;
    } while (nextIndex === this.lastIdleIndex);

    // console.log(
    //   '[AnimationController] isChatAlreadyStarted',
    //   this.isChatAlreadyStarted
    // );

    if (this.isChatAlreadyStarted && nextIndex === 3) {
      // If chat has already started and the last idle was Idle4, use Idle3 instead
      nextIndex = this.lastIdleIndex !== 4 ? 4 : 2;
    }

    // console.log(
    //   `[AnimationController] Selected idle animation: Idle${nextIndex}`
    // );
    this.lastIdleIndex = nextIndex;
    const idleAction = this.actions[`Idle${nextIndex}`];

    if (!idleAction) {
      throw new Error(`Idle animation ${nextIndex} not found`);
    }

    return idleAction;
  }

  /**
   * Transitions to a new animation state
   */
  transitionTo(state: AnimationState, emotionName?: string) {
    if (this.isTransitioning) {
      // console.log(
      //   '[AnimationController] Transition already in progress, skipping'
      // );
      return;
    }

    // console.log(
    //   `[AnimationController] Transitioning to ${state}${
    //     emotionName ? ` (${emotionName})` : ''
    //   }`
    // );
    this.isTransitioning = true;

    try {
      let nextAction: AnimationAction | null = null;

      switch (state) {
        case AnimationState.LOADING:
          nextAction = this.actions[emotionName || 'Loading1'];
          this.currentIdleLoopCount = 0;
          this.lastAnimationTime = 0;
          break;
        case AnimationState.EMOTION:
          nextAction = this.actions[emotionName || 'Timore1'];
          this.currentIdleLoopCount = 0;
          this.lastAnimationTime = 0;
          break;
        case AnimationState.IDLE:
          nextAction = this.getNextIdleAnimation();
          // Only reset loop count if we're coming from a different idle animation
          if (this.currentState !== AnimationState.IDLE) {
            this.currentIdleLoopCount = 0;
            this.lastAnimationTime = 0;
          }
          break;
      }

      if (!nextAction) {
        throw new Error(`No animation found for state: ${state}`);
      }

      // Fade out current animation
      if (this.currentAction) {
        this.currentAction.fadeOut(this.config.fadeOutDuration);
      }

      // Setup next animation
      nextAction.reset().fadeIn(this.config.fadeInDuration).play();

      // Configure animation properties
      nextAction.timeScale = this.config.timeScale;
      if (state !== AnimationState.IDLE) {
        nextAction.setLoop(LoopOnce, 1);
        nextAction.clampWhenFinished = true;
      } else {
        nextAction.setLoop(Infinity, Infinity);
      }

      this.currentAction = nextAction;
      this.currentState = state;
      // console.log('[AnimationController] Transition completed successfully');
    } catch (error) {
      console.error(
        '[AnimationController] Error during animation transition:',
        error
      );
      if (state !== AnimationState.IDLE) {
        this.transitionTo(AnimationState.IDLE);
      }
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Updates animation state on each frame
   */
  update(delta: number) {
    if (!this.currentAction) return;

    // Check for loop completion in idle animations
    this.checkForLoop();

    // Check if emotion/loading animation is finished
    if (
      this.currentState !== AnimationState.IDLE &&
      this.currentAction.time >= this.currentAction.getClip().duration * 0.9
    ) {
      // console.log(
      //   '[AnimationController] Non-idle animation completed, transitioning to idle'
      // );
      this.transitionTo(AnimationState.IDLE);
    }

    this.mixer.update(delta);
  }

  /**
   * Returns current animation state
   */
  getCurrentState(): AnimationState {
    return this.currentState;
  }

  /**
   * Returns number of times current idle has looped
   */
  getLoopCount(): number {
    return this.currentIdleLoopCount;
  }

  /**
   * Updates animation playback speed
   */
  setTimeScale(timeScale: number) {
    // console.log(`[AnimationController] Setting time scale to ${timeScale}`);
    this.config.timeScale = timeScale;
    if (this.currentAction) {
      this.currentAction.timeScale = timeScale;
    }
  }

  updateIsChatAlreadyStarted(isChatAlreadyStarted: boolean) {
    this.isChatAlreadyStarted = isChatAlreadyStarted;
  }

  /**
   * Returns debug information about current animation state
   */
  getDebugInfo() {
    return {
      currentState: this.currentState,
      currentIdleIndex: this.lastIdleIndex,
      loopCount: this.currentIdleLoopCount,
      currentTime: this.currentAction?.time || 0,
      lastTime: this.lastAnimationTime,
      isTransitioning: this.isTransitioning,
      isChatAlreadyStarted: this.isChatAlreadyStarted,
    };
  }
}
