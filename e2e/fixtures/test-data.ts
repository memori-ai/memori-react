import { env } from 'process';
/**
 * Test data configuration for Memori React integration tests
 * All values are loaded from environment variables defined in .env.test
 */

export const testConfig = {
  // Base URLs
  baseURL: 'https://memori-ai.github.io/memori-react/iframe.html?id=general-layouts--default&viewMode=story',

  // Upload configuration
  upload: {
    maxImageSize: parseInt(env.TEST_MAX_IMAGE_SIZE || '5242880', 10),
    maxDocumentSize: parseInt(
      env.TEST_MAX_DOCUMENT_SIZE || '10485760',
      10
    ),
  },

  // Test configuration
  useMockApi: env.TEST_USE_MOCK === 'true',
};

/**
 * Test messages for chat testing
 */
export const testMessages = {
  simple: 'Hello, this is a test message',
  question: 'What is your name?',
  followUp: 'Can you tell me more about that?',
  withContext: 'Tell me about the weather',
  long: 'This is a longer test message that contains multiple sentences. It is used to test how the system handles longer inputs. The message should be processed correctly and receive an appropriate response from the memori.',
};

/**
 * Test languages for multilingual testing
 */
export const testLanguages = {
  english: 'EN',
  italian: 'IT',
  spanish: 'ES',
  french: 'FR',
  german: 'DE',
};

/**
 * Selector constants for common elements
 * These can be updated if the component structure changes
 */
export const selectors = {
  // Widget root
  widget: '.memori-widget',
  
  // Start Panel
  startPanel: '.memori--start-panel',
  startButton: '.memori--start-button',
  memoriTitle: '.memori--title',
  memoriDescription: '.memori--description',
  memoriAvatar: '.memori--avatar img',
  memoriCover: '.memori--cover',
  languageSelector: '#user-lang-pref',
  
  // Chat
  chat: '.memori-widget',
  chatHistory: '.memori-chat--history',
  chatBubble: '.memori-chat--bubble',
  userBubble: '.memori-chat--user-bubble',
  memoriBubble: '.memori-chat--bubble:not(.memori-chat--user-bubble)',
  chatInput: '.memori-chat-textarea--input',
  sendButton: '.memori-chat-inputs--send',
  
  // Typing indicator
  typing: '.memori--typing',
  
  // Media & Uploads
  uploadButton: '.memori--unified-upload-button',
  uploadMenu: '.memori--upload-menu',
  imageUploadInput: 'input[type="file"][accept*="image"]',
  documentUploadInput: 'input[type="file"][accept*="pdf"]',
  mediaPreview: '.memori-media-preview',
  
  // Audio/TTS
  speakerButton: '.memori-header--button--speaker',
  audioElement: 'audio',
  
  // Settings
  settingsButton: '.memori-settings-button',
  settingsDrawer: '.memori-settings-drawer',
  languageSettingSelect: '.memori-settings-language select',
  sendOnEnterToggle: '.memori-settings-send-on-enter',
  
  // Authentication
  loginButton: '.memori-login-button',
  loginDrawer: '.memori-login-drawer',
  passwordInput: 'input[type="password"]',
  tokenInput: '.memori-token-input',
  authSubmitButton: '.memori-auth-submit',
  
  // Age Verification
  ageVerificationModal: '.memori-modal--panel',
  ageVerificationForm: '.age-verification-form',
  ageVerificationSubmit: '.age-verification-submit',
  // DateSelector uses Headless UI Listbox, not native select elements
  dateSelector: '.memori--date-selector',
  dateSelectorButton: '.memori--date-selector__select-button',
  dateSelectorOption: '.memori--date-selector__select-option',
  
  // Layouts
  fullPageLayout: '.memori-layout-fullpage',
  chatLayout: '.memori-layout-chat',
  totemLayout: '.memori-layout-totem',
  websiteAssistantLayout: '.memori-layout-website_assistant',
  
  // State attributes
  sessionIDAttr: '[data-memori-session-id]',
  engineStateAttr: '[data-memori-engine-state]',
};

/**
 * Wait time constants (in milliseconds)
 */
export const waitTimes = {
  short: 1000,
  medium: 3000,
  long: 5000,
  response: 10000, // Wait for memori response
  upload: 15000, // Wait for file upload
  audio: 20000, // Wait for audio playback
};

/**
 * Helper to create a birthdate for age verification
 * @param yearsOld Age in years (e.g., 25 for someone born 25 years ago)
 */
export const createBirthDate = (yearsOld: number): { day: number; month: number; year: number; iso: string } => {
  const now = new Date();
  const year = now.getFullYear() - yearsOld;
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  
  const date = new Date(year, month - 1, day);
  
  return {
    day,
    month,
    year,
    iso: date.toISOString(),
  };
};

