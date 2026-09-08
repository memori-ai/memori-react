import { DialogState, Memori, Integration, Message, OpenSession, MemoriConfig, Tenant } from '@memori.ai/memori-api-client/src/types';
import { ArtifactData } from '../MemoriArtifactSystem/types/artifact.types';
import type { LayoutName } from '../../types/layout';
import React from 'react';
import Chat, { Props as ChatProps } from '../Chat/Chat';
import StartPanel, { Props as StartPanelProps } from '../StartPanel/StartPanel';
import Avatar, { Props as AvatarProps } from '../Avatar/Avatar';
import Header, { Props as HeaderProps } from '../Header/Header';
declare const getMemoriState: (integrationId?: string | undefined) => object | null;
export declare function dialogStateFingerprint(state: DialogState | undefined): string;
type MemoriTextEnteredEvent = CustomEvent<{
    text: string;
    waitForPrevious?: boolean;
    hidden?: boolean;
    typingText?: string;
    useLoaderTextAsMsg?: boolean;
    hasBatchQueued?: boolean;
}>;
declare const typeMessage: (message: string, waitForPrevious?: boolean, hidden?: boolean, typingText?: string | undefined, useLoaderTextAsMsg?: boolean, hasBatchQueued?: boolean) => void;
declare const typeMessageHidden: (message: string, waitForPrevious?: boolean, typingText?: string | undefined, useLoaderTextAsMsg?: boolean, hasBatchQueued?: boolean) => void;
declare const typeBatchMessages: (messages: {
    message: string;
    waitForPrevious?: boolean | undefined;
    hidden?: boolean | undefined;
    typingText?: string | undefined;
    useLoaderTextAsMsg?: boolean | undefined;
}[]) => void;
type MemoriNewDialogStateEvent = CustomEvent<DialogState>;
type ArtifactCreatedEvent = CustomEvent<{
    artifact: ArtifactData;
    message: Message;
}>;
interface CustomEventMap {
    MemoriTextEntered: MemoriTextEnteredEvent;
    MemoriEndSpeak: CustomEvent;
    MemoriResetUIEffects: CustomEvent;
    MemoriNewDialogState: MemoriNewDialogStateEvent;
    artifactCreated: ArtifactCreatedEvent;
}
declare global {
    interface Document {
        addEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void;
        removeEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void;
        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
    }
    interface Window {
        getMemoriState: typeof getMemoriState;
        typeMessage: typeof typeMessage;
        typeMessageHidden: typeof typeMessageHidden;
        typeBatchMessages: typeof typeBatchMessages;
        MemoriArtifactAPI?: {
            openArtifact: (artifact: ArtifactData) => void;
            createAndOpenArtifact: (content: string, mimeType?: string, title?: string) => void;
            createFromOutputElement: (outputElement: HTMLOutputElement) => string;
            closeArtifact: () => void;
            toggleFullscreen: () => void;
            getState: () => {
                currentArtifact: ArtifactData | null;
                isDrawerOpen: boolean;
                isFullscreen: boolean;
            };
        };
    }
}
export interface LayoutProps {
    Header?: typeof Header;
    headerProps?: HeaderProps;
    Avatar: typeof Avatar;
    avatarProps?: AvatarProps;
    Chat?: typeof Chat;
    chatProps?: ChatProps;
    StartPanel: typeof StartPanel;
    startPanelProps?: StartPanelProps;
    integrationStyle?: JSX.Element | null;
    integrationBackground?: JSX.Element | null;
    poweredBy?: JSX.Element | null;
    sessionId?: string;
    hasUserActivatedSpeak?: boolean;
    showUpload?: boolean;
    loading?: boolean;
    autoStart?: boolean;
    onSidebarToggle?: (isOpen: boolean) => void;
    avatar3dHidden?: boolean | string;
}
export interface Props {
    memori: Memori;
    ownerUserName?: string | null;
    ownerUserID?: string | null;
    tenantID: string;
    memoriConfigs?: MemoriConfig[];
    memoriLang?: string;
    uiLang?: string;
    spokenLang?: string;
    multilingual?: boolean;
    integration?: Integration;
    layout?: LayoutName;
    customLayout?: React.FC<LayoutProps>;
    showShare?: boolean;
    showCopyButton?: boolean;
    showTranslationOriginal?: boolean;
    showInputs?: boolean;
    showDates?: boolean;
    showContextPerLine?: boolean;
    showMessageConsumption?: boolean;
    showSettings?: boolean;
    showClear?: boolean;
    showOnlyLastMessages?: boolean;
    showTypingText?: boolean;
    showLogin?: boolean;
    showUpload?: boolean;
    showChatHistory?: boolean;
    showReasoning?: boolean;
    avatar3dHidden?: boolean;
    preview?: boolean;
    embed?: boolean;
    height?: number | string;
    secret?: string;
    baseUrl?: string;
    apiURL?: string;
    engineURL?: string;
    initialContextVars?: {
        [key: string]: string;
    };
    initialQuestion?: string;
    ogImage?: string;
    sessionID?: string;
    tenant?: Tenant;
    personification?: {
        name?: string;
        tag: string;
        pin: string;
    };
    ttsProvider?: 'azure' | 'openai';
    enableAudio?: boolean;
    defaultSpeakerActive?: boolean;
    disableTextEnteredEvents?: boolean;
    onStateChange?: (state?: DialogState) => void;
    additionalInfo?: OpenSession['additionalInfo'] & {
        [key: string]: string;
    };
    customMediaRenderer?: ChatProps['customMediaRenderer'];
    additionalSettings?: JSX.Element | null;
    userAvatar?: string | JSX.Element;
    useMathFormatting?: boolean;
    autoStart?: boolean;
    applyVarsToRoot?: boolean;
    showFunctionCache?: boolean;
    authToken?: string;
    __WEBCOMPONENT__?: boolean;
    maxTotalMessagePayload?: number;
    maxTextareaCharacters?: number;
}
declare const MemoriWidget: ({ memori, memoriConfigs, ownerUserID, ownerUserName, tenantID, memoriLang, uiLang, spokenLang, multilingual, integration, layout, customLayout, showShare, preview, embed, showCopyButton, showTranslationOriginal, showInputs, showDates, showContextPerLine, showMessageConsumption, showSettings, showTypingText, showClear, showLogin, showUpload, showOnlyLastMessages, showChatHistory, showReasoning, avatar3dHidden, height, secret, baseUrl, apiURL, engineURL, initialContextVars, initialQuestion, ttsProvider, ogImage, sessionID: initialSessionID, tenant, personification, authToken, enableAudio, defaultSpeakerActive, disableTextEnteredEvents, onStateChange, additionalInfo, additionalSettings, customMediaRenderer, userAvatar, __WEBCOMPONENT__, useMathFormatting, autoStart, applyVarsToRoot, showFunctionCache, maxTotalMessagePayload, maxTextareaCharacters, }: Props) => JSX.Element;
export default MemoriWidget;
