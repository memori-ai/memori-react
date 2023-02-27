import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Integration,
  Memori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tooltip from '../ui/Tooltip';
import AvatarView, { Props as AvatarViewProps } from '../AvatarView';
import { getResourceUrl } from '../../helpers/media';
import Blob from '../Blob/Blob';
import ModelViewer from '../CustomGLBModelViewer/ModelViewer';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import Eye from '../icons/Eye';
import EyeInvisible from '../icons/EyeInvisible';
import Edit from '../icons/Edit';
import cx from 'classnames';

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
}) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animation = useMemo(
    () =>
      isPlayingAudio
        ? (['Talk 1', 'Talk 2', 'Talk 3'][
            Math.round(Math.random() * 2)
          ] as AvatarViewProps['animation'])
        : loading
        ? 'Loading'
        : (['Idle', 'Idle 1', 'Idle 2', 'Idle 3'][
            Math.round(Math.random() * 3)
          ] as AvatarViewProps['animation']),
    [isPlayingAudio, loading]
  );

  return (
    <>
      {(integrationConfig?.avatar === 'readyplayerme' ||
        integrationConfig?.avatar === 'readyplayerme-full' ||
        integrationConfig?.avatar === 'customglb') &&
      integrationConfig?.avatarURL ? (
        <>
          <div
            className={cx('memori--avatar-wrapper', {
              hidden: !avatar3dVisible,
            })}
          >
            {isClient &&
              (integrationConfig.avatar === 'readyplayerme' ||
                integrationConfig.avatar === 'readyplayerme-full') && (
                <ErrorBoundary
                  fallback={
                    <div className="memori--blob-container">
                      {isClient && (
                        <Blob
                          speaking={isPlayingAudio}
                          avatar={
                            integrationConfig?.avatar === 'userAvatar' &&
                            memori.avatarURL &&
                            memori.avatarURL.length > 0
                              ? getResourceUrl({
                                  type: 'avatar',
                                  tenantID: tenant?.id,
                                  resourceURI: memori.avatarURL,
                                  baseURL: baseUrl,
                                  apiURL: apiUrl,
                                })
                              : undefined
                          }
                        />
                      )}
                    </div>
                  }
                >
                  <AvatarView
                    url={integrationConfig.avatarURL}
                    fallbackImg={getResourceUrl({
                      type: 'avatar',
                      tenantID: tenant?.id,
                      resourceURI: memori.avatarURL,
                      baseURL: baseUrl,
                      apiURL: apiUrl,
                    })}
                    headMovement
                    eyeBlink
                    halfBody={integrationConfig.avatar === 'readyplayerme'}
                    animation={animation}
                    speaking={isPlayingAudio}
                    style={
                      integrationConfig.avatar === 'readyplayerme'
                        ? {
                            width: '300px',
                            height: '300px',
                            backgroundColor: 'none',
                            borderRadius: '100%',
                            boxShadow: 'none',
                          }
                        : {
                            width: '600px',
                            height: '600px',
                            backgroundColor: 'none',
                          }
                    }
                  />
                </ErrorBoundary>
              )}
            {isClient && integrationConfig.avatar === 'customglb' && (
              <ModelViewer
                poster={getResourceUrl({
                  type: 'avatar',
                  tenantID: tenant?.id,
                  resourceURI: memori.avatarURL,
                  baseURL: baseUrl,
                  apiURL: apiUrl,
                })}
                src={integrationConfig.avatarURL}
                alt=""
              />
            )}
          </div>
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
        </>
      ) : (
        <div className="memori--blob-container">
          {isClient && (
            <Blob
              avatar={
                integrationConfig?.avatar === 'userAvatar' &&
                memori.avatarURL &&
                memori.avatarURL.length > 0
                  ? getResourceUrl({
                      type: 'avatar',
                      tenantID: tenant?.id,
                      resourceURI: memori.avatarURL,
                      baseURL: baseUrl,
                      apiURL: apiUrl,
                    })
                  : undefined
              }
            />
          )}
        </div>
      )}
      {instruct && !hasUserActivatedSpeak && memori.isGiver && tenant?.id && (
        <div className="memori--avatar-link-to-integrations">
          <a
            className="memori-button memori-button--circle memori-button--outlined"
            href={`https://${tenant.id}/${
              memori.culture === 'it-IT' ? 'it' : 'en'
            }/${memori.ownerUserName}/${memori.name}/integrations${
              integration?.integrationID
                ? `?integration=${integration.integrationID}&openAvatarModal=true`
                : ''
            }`}
          >
            <Tooltip content={t('widgetgoToIntegrationsToCustomizeAvatar')}>
              <span className="memori-button--icon">
                <Edit />
              </span>
            </Tooltip>
          </a>
        </div>
      )}
    </>
  );
};

export default memo(Avatar, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
