import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Integration,
  Memori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tooltip from '../ui/Tooltip';
import AvatarView, { Props as AvatarViewProps } from './AvatarView';
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

export interface Props {
  memori: Memori;
  integration?: Integration;
  integrationConfig?: { [key: string]: any };
  tenant?: Tenant;
  instruct?: boolean;
  hasUserActivatedSpeak?: boolean;
  avatar3dVisible?: boolean;
  setAvatar3dVisible: (visible: boolean) => void;
  isPlayingAudio?: boolean;
  loading?: boolean;
  baseUrl?: string;
  apiUrl?: string;
  animation?: string;
}

const Avatar: React.FC<Props> = ({
  memori,
  integration,
  integrationConfig,
  tenant,
  instruct = false,
  avatar3dVisible = false,
  setAvatar3dVisible,
  hasUserActivatedSpeak = false,
  isPlayingAudio = false,
  loading = false,
  baseUrl,
  apiUrl,
  animation 
}) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the avatar URL, if the avatar is a user avatar, the avatar URL is the user avatar URL, if the avatar is a default avatar, the avatar URL is the default avatar URL
  const getAvatarUrl = () => {
    if (integrationConfig?.avatar === 'userAvatar' && memori.avatarURL && memori.avatarURL.length > 0) {
      return getResourceUrl({
        type: 'avatar',
        tenantID: tenant?.id,
        resourceURI: memori.avatarURL,
        baseURL: baseUrl,
        apiURL: apiUrl,
      });
    }
    return undefined;
  };


  // Render the avatar, if the avatar is a user avatar, the avatar is rendered, if the avatar is a default avatar, the avatar is rendered
  const renderAvatar = () => {
    if ((integrationConfig?.avatar === 'readyplayerme' ||
        integrationConfig?.avatar === 'readyplayerme-full' ||
        integrationConfig?.avatar === 'customglb') &&
      integrationConfig?.avatarURL) {
      return (
        <>
          <div
            className={cx(
              'memori--avatar-wrapper',
              `memori--avatar-${integrationConfig?.avatar || 'default'}`,
              {
                hidden: !avatar3dVisible,
              }
            )}
          >
            {renderAvatarContent()}
          </div>
          {renderAvatarToggle()}
        </>
      );
    }
    return (
      <div className="memori--blob-container">
        {isClient && <Blob speaking={isPlayingAudio} avatar={getAvatarUrl()} />}
      </div>
    );
  };

  const renderAvatarContent = () => {
    if (!isClient) return null;

    if (integrationConfig?.avatar === 'readyplayerme' || integrationConfig?.avatar === 'readyplayerme-full') {
      return (
        <ErrorBoundary fallback={<BlobFallback />}>
          <ContainerAvatarView
            url={integrationConfig.avatarURL}
            sex={memori.voiceType === 'FEMALE' ? 'FEMALE' : 'MALE'}
            fallbackImg={getAvatarUrl()}
            headMovement
            eyeBlink
            animation={animation}
            halfBody={integrationConfig.avatar === 'readyplayerme'}
            speaking={isPlayingAudio}
            loading={loading}
            style={getAvatarStyle()}
          />
        </ErrorBoundary>
      );
    }

    if (integrationConfig?.avatar === 'customglb') {
      return (
        <ModelViewer
          poster={getAvatarUrl() || ''}
          src={integrationConfig.avatarURL}
          alt=""
        />
      );
    }

    return null;
  };

  // Render the avatar toggle
  const renderAvatarToggle = () => (
    <div className="memori--avatar-toggle">
      <Button
        ghost
        onClick={() => setAvatar3dVisible(!avatar3dVisible)}
        icon={avatar3dVisible ? <EyeInvisible /> : <Eye />}
      >
        <span className="memori--avatar-toggle-text">
          {avatar3dVisible ? t('hide') : t('show')}
        </span>
      </Button>
    </div>
  );

  const BlobFallback = () => (
    <div className="memori--blob-container">
      {isClient && <Blob speaking={isPlayingAudio} avatar={getAvatarUrl()} />}
    </div>
  );

  const getAvatarStyle = () => {
    if (integrationConfig?.avatar === 'readyplayerme') {
      return {
        width: '300px',
        height: '300px',
        backgroundColor: 'none',
        borderRadius: '100%',
        boxShadow: 'none',
      };
    }
    return {
      width: '600px',
      height: '600px',
      backgroundColor: 'none',
    };
  };

  const renderIntegrationsLink = () => {
    if (!(instruct && !hasUserActivatedSpeak && memori.isGiver && tenant?.id)) return null;

    const href = `https://${tenant.id}/${
      memori.culture === 'it-IT' ? 'it' : 'en'
    }/${memori.ownerUserName}/${memori.name}/integrations${
      integration?.integrationID
        ? `?integration=${integration.integrationID}&openAvatarModal=true`
        : ''
    }`;

    return (
      <div className="memori--avatar-link-to-integrations">
        <a
          className="memori-button memori-button--circle memori-button--outlined"
          href={href}
        >
          <Tooltip content={t('widgetgoToIntegrationsToCustomizeAvatar')}>
            <span className="memori-button--icon">
              <Edit />
            </span>
          </Tooltip>
        </a>
      </div>
    );
  };

  console.log('animation', animation);
  console.log('speaking', isPlayingAudio);
  console.log('loading', loading);
  return (
    <>
      {renderAvatar()}
      {renderIntegrationsLink()}
    </>
  );
};

export default memo(Avatar, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
