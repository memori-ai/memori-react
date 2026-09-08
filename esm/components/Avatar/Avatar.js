import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tooltip from '../ui/Tooltip';
import { getResourceUrl } from '../../helpers/media';
import Blob from '../Blob/Blob';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import Eye from '../icons/Eye';
import EyeInvisible from '../icons/EyeInvisible';
import Edit from '../icons/Edit';
import cx from 'classnames';
import ContainerAvatarView from './AvatarView';
import { useViseme } from '../../context/visemeContext';
import { is3dAvatarWithUrl, usesRpmAvatarView } from '../../types/integration';
const Avatar = ({ memori, integration, integrationConfig, tenant, instruct = false, avatar3dVisible = false, setAvatar3dVisible, hasUserActivatedSpeak = false, isPlayingAudio = false, loading = false, baseUrl, apiUrl, animation, isZoomed = false, chatProps, avatarType = null, enablePositionControls, setEnablePositionControls, isTotem = false, }) => {
    const { t } = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const { stopProcessing, updateCurrentViseme, resetVisemeQueue } = useViseme();
    useEffect(() => {
        setIsClient(true);
    }, []);
    const getAvatarUrl = () => {
        if ((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) === 'userAvatar' &&
            memori.avatarURL &&
            memori.avatarURL.length > 0) {
            return getResourceUrl({
                type: 'avatar',
                tenantID: tenant === null || tenant === void 0 ? void 0 : tenant.name,
                resourceURI: memori.avatarURL,
                baseURL: baseUrl,
                apiURL: apiUrl,
            });
        }
        return undefined;
    };
    const renderAvatar = () => {
        if (is3dAvatarWithUrl(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar, integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatarURL) &&
            avatarType &&
            avatarType !== 'blob') {
            return (_jsxs(_Fragment, { children: [_jsx("div", { className: cx('memori--avatar-wrapper', `memori--avatar-${(integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) || 'default'}`, {
                            hidden: !avatar3dVisible,
                        }), children: renderAvatarContent() }), renderAvatarToggle()] }));
        }
        return (_jsx("div", { className: "memori--blob-container", children: isClient && _jsx(Blob, { speaking: isPlayingAudio, avatar: getAvatarUrl() }) }));
    };
    const renderAvatarContent = () => {
        var _a;
        if (!isClient || !integrationConfig)
            return null;
        if (usesRpmAvatarView(integrationConfig.avatar)) {
            return (_jsx(ErrorBoundary, { fallback: _jsx("div", { className: "memori--blob-container", children: isClient && (_jsx(Blob, { speaking: isPlayingAudio, avatar: getAvatarUrl() })) }), children: _jsx(ContainerAvatarView, { enablePositionControls: enablePositionControls, updateCurrentViseme: updateCurrentViseme, url: integrationConfig.avatarURL, sex: memori.voiceType === 'FEMALE' ? 'FEMALE' : 'MALE', fallbackImg: getAvatarUrl(), headMovement: true, eyeBlink: true, animation: animation, halfBody: integrationConfig.avatar === 'readyplayerme', speaking: isPlayingAudio, loading: loading, style: getAvatarStyle(), stopProcessing: stopProcessing, resetVisemeQueue: resetVisemeQueue, isZoomed: isZoomed, isTotem: isTotem, chatEmission: (_a = chatProps === null || chatProps === void 0 ? void 0 : chatProps.dialogState) === null || _a === void 0 ? void 0 : _a.emission, setEnablePositionControls: setEnablePositionControls }) }));
        }
        if (integrationConfig.avatar === 'customglb') {
            return (_jsx(ModelViewer, { poster: getAvatarUrl() || '', src: integrationConfig.avatarURL, alt: "" }));
        }
        return null;
    };
    const renderAvatarToggle = () => (_jsx("div", { className: "memori--avatar-toggle", children: _jsx(Button, { ghost: true, onClick: () => setAvatar3dVisible(!avatar3dVisible), icon: avatar3dVisible ? _jsx(EyeInvisible, {}) : _jsx(Eye, {}), children: _jsx("span", { className: "memori--avatar-toggle-text", children: avatar3dVisible ? t('hide') : t('show') }) }) }));
    const getAvatarStyle = () => {
        if ((integrationConfig === null || integrationConfig === void 0 ? void 0 : integrationConfig.avatar) === 'readyplayerme') {
            return {
                width: '100%',
                height: '100%',
                backgroundColor: 'none',
                boxShadow: 'none',
            };
        }
        return {
            width: '100%',
            height: '100%',
            backgroundColor: 'none',
        };
    };
    const renderIntegrationsLink = () => {
        if (!(instruct && !hasUserActivatedSpeak && memori.isGiver && (tenant === null || tenant === void 0 ? void 0 : tenant.name)))
            return null;
        const href = `https://${tenant.name}/${memori.culture === 'it-IT' ? 'it' : 'en'}/${memori.ownerUserName}/${memori.name}/integrations${(integration === null || integration === void 0 ? void 0 : integration.integrationID)
            ? `?integration=${integration.integrationID}&openAvatarModal=true`
            : ''}`;
        return (_jsx("div", { className: "memori--avatar-link-to-integrations", children: _jsx("a", { className: "memori-button memori-button--circle memori-button--outlined", href: href, children: _jsx(Tooltip, { content: t('widgetgoToIntegrationsToCustomizeAvatar'), children: _jsx("span", { className: "memori-button--icon", children: _jsx(Edit, {}) }) }) }) }));
    };
    return (_jsxs(_Fragment, { children: [renderAvatar(), renderIntegrationsLink()] }));
};
export default memo(Avatar, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
//# sourceMappingURL=Avatar.js.map