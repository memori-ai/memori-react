import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import {
  Memori,
  Message,
  Tenant,
  Venue,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import { Button, Dropdown, useAlertManager, createAlertOptions } from '@memori.ai/ui';
import {
  MapPin,
  VolumeX,
  Volume2,
  Settings,
  Minimize,
  Maximize,
  RefreshCw,
  X,
  Brain,
  Users,
  User as UserIcon,
  MessageCircle,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ShareButton from '../ShareButton/ShareButton';
import { getErrori18nKey } from '../../helpers/error';
import memoriApiClient from '@memori.ai/memori-api-client';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';

const imgMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

export interface Props {
  className?: string;
  memori: Memori;
  tenant?: Tenant;
  history: Message[];
  position?: Venue;
  setShowPositionDrawer: (show: boolean) => void;
  setShowSettingsDrawer: (show: boolean) => void;
  setShowChatHistoryDrawer: (show: boolean) => void;
  setShowKnownFactsDrawer: (show: boolean) => void;
  setShowExpertsDrawer: (show: boolean) => void;
  enableAudio?: boolean;
  speakerMuted: boolean;
  setSpeakerMuted: (mute: boolean) => void;
  hasUserActivatedSpeak?: boolean;
  showShare?: boolean;
  showSettings?: boolean;
  showChatHistory?: boolean;
  showReload?: boolean;
  showClear?: boolean;
  showLogin?: boolean;
  setShowLoginDrawer: (show: boolean) => void;
  clearHistory: () => void;
  loginToken?: string;
  user?: User;
  sessionID?: string;
  baseUrl?: string;
  fullScreenHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLogout?: () => void;
  apiClient: ReturnType<typeof memoriApiClient>;
  layout?: WidgetProps['layout'];
  additionalSettings?: WidgetProps['additionalSettings'];
}

const Header: React.FC<Props> = ({
  className,
  memori,
  tenant,
  history,
  position,
  setShowPositionDrawer,
  setShowSettingsDrawer,
  setShowChatHistoryDrawer,
  setShowKnownFactsDrawer,
  setShowExpertsDrawer,
  enableAudio = true,
  speakerMuted,
  setSpeakerMuted,
  hasUserActivatedSpeak = false,
  showShare = true,
  showSettings = true,
  showReload = false,
  showClear = false,
  showLogin = true,
  setShowLoginDrawer,
  clearHistory,
  loginToken,
  user,
  sessionID,
  showChatHistory = true,
  fullScreenHandler,
  baseUrl,
  onLogout,
  apiClient,
  layout,
  additionalSettings,
}) => {
  const { t } = useTranslation();
  const { add } = useAlertManager();
  const { uploadAsset, pwlUpdateUser } = apiClient.backend;
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  useEffect(() => {
    if (document.fullscreenEnabled) {
      setFullScreenAvailable(true);
    }
  }, []);

  // Helper function to determine if settings drawer has content
  const hasSettingsContent = useCallback(
    (
      layout?: WidgetProps['layout'],
      additionalSettings?: WidgetProps['additionalSettings']
    ): boolean => {
      return (
        layout === 'TOTEM' ||
        (additionalSettings && Object.keys(additionalSettings).length > 0) ||
        false
      );
    },
    [layout, additionalSettings]
  );

  const updateAvatar = async (avatar: any) => {
    if (avatar && loginToken) {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const { asset: avatarAsset, ...resp } = await uploadAsset(
            avatar.name ?? 'avatar',
            e.target?.result as string,
            loginToken ?? ''
          );

          if (resp.resultCode !== 0) {
            console.error('[updateAvatar] Upload failed:', resp);
            add(createAlertOptions({ description: t(getErrori18nKey(resp.resultCode)), severity: 'error' }));
          } else if (avatarAsset) {
            let newUser: Partial<User> = {
              userID: user?.userID,
              avatarURL: avatarAsset.assetURL,
            };

            const { user: patchedUser, ...resp } = await pwlUpdateUser(
              loginToken ?? '',
              user?.userID ?? '',
              newUser
            );
          }
        } catch (e) {
          let err = e as Error;
          console.error('[updateAvatar] Error:', err);

          if (err?.message) add(createAlertOptions({ description: err.message, severity: 'error' }));
        }
      };
      reader.readAsDataURL(avatar as Blob);
    } else {
      console.error('[updateAvatar] Missing avatar or login token', {
        avatar,
        loginToken,
      });
      add(createAlertOptions({ description: t('login.avatarUploadError'), severity: 'error' }));
    }
  };

  return (
    <div className={cx('memori-header', className)}>
      {memori.needsPosition && position && (
        <div className="memori-header--position">
          {position.latitude !== 0 && position.longitude !== 0 && (
            <span className="memori-header--position-placeName">
              {position.placeName}
            </span>
          )}
          <Button
            variant="primary"
            className="memori-header--button memori-header--button--position"
            title={t('widget.position') || 'Position'}
            icon={<MapPin />}
            onClick={() => setShowPositionDrawer(true)}
          />
        </div>
      )}
      {showReload && (
        <Button
          variant="primary"
          title={t('reload') || 'Reload'}
          icon={<RefreshCw />}
          onClick={() => {
            window.location.reload();
          }}
        />
      )}
      {showClear && (
        <Button
          variant="primary"
          title={t('clearHistory') || 'Clear chat'}
          icon={<Trash2 />}
          onClick={clearHistory}
        />
      )}
      {showChatHistory && !!loginToken && (
        <Button
          variant="primary"
          disabled={!loginToken}
          title={t('write_and_speak.chatHistory') || 'Chat history'}
          icon={<MessageCircle />}
          onClick={() => setShowChatHistoryDrawer(true)}
        />
      )}
      {fullScreenAvailable && (
        <Button
          variant="primary"
          title={
            fullScreen
              ? t('fullscreenExit') || 'Exit fullscreen'
              : t('fullscreenEnter') || 'Enter fullscreen'
          }
          icon={fullScreen ? <Maximize /> : <Minimize />}
          onClick={
            fullScreenHandler ||
            (() => {
              if (!document.fullscreenElement) {
                const body =
                  layout !== 'HIDDEN_CHAT' && layout !== 'WEBSITE_ASSISTANT'
                    ? document.body
                    : document.querySelector('.memori-widget');
                if (body) {
                  //set the .memori-react div to white backg
                  const memoriReact = document.querySelector('.memori-widget');
                  if (memoriReact) {
                    (memoriReact as HTMLElement).style.backgroundColor =
                      '#FFFFFF';
                  }
                  body
                    .requestFullscreen()
                    .then(() => setFullScreen(true))
                    .catch(err => {
                      console.warn(
                        'Error attempting to enable fullscreen:',
                        err
                      );
                    });
                }
              } else {
                if (document.exitFullscreen) {
                  document
                    .exitFullscreen()
                    .then(() => setFullScreen(false))
                    .catch(err => {
                      console.warn('Error attempting to exit fullscreen:', err);
                    });
                }
              }
            })
          }
        />
      )}
      {memori.enableDeepThought && !!loginToken && user?.pAndCUAccepted && (
        <Button
          variant={
            !!sessionID && !!hasUserActivatedSpeak ? 'primary' : 'outline'
          }
          icon={<Brain />}
          disabled={!hasUserActivatedSpeak || !sessionID}
          onClick={() => setShowKnownFactsDrawer(true)}
          title={t('knownFacts.title') || 'Known facts'}
        />
      )}
      {memori.enableBoardOfExperts && (
        <Button
          variant="primary"
          icon={<Users />}
          disabled={!hasUserActivatedSpeak || !sessionID}
          onClick={() => setShowExpertsDrawer(true)}
          title={t('widget.showExpertsInTheBoard') || 'Experts in this board'}
        />
      )}
      {enableAudio && (
        <Button
          variant="primary"
          icon={speakerMuted ? <VolumeX /> : <Volume2 />}
          onClick={() => setSpeakerMuted(!speakerMuted)}
          title={t('widget.sound') || 'Sound'}
        />
      )}
      {/* <ExportHistoryButton
        history={history}
        memori={memori}
        className="memori-header--button memori-header--button--export"
        disabled={!hasUserActivatedSpeak || history.length === 0}
      /> */}
      {showSettings && hasSettingsContent(layout, additionalSettings) && (
        <Button
          variant="primary"
          icon={<Settings />}
          onClick={() => setShowSettingsDrawer(true)}
          title={t('widget.settings') || 'Settings'}
        />
      )}
      {showShare && (
        <ShareButton
          title={memori.name}
          memori={memori}
          sessionID={sessionID}
          tenant={tenant}
          showQrCode
          align="left"
          baseUrl={baseUrl}
          history={history}
        />
      )}
      {showLogin && (
        <>
          {loginToken && user ? (
            <Dropdown className="memori-header--dropdown">
              <Dropdown.Trigger
                showChevron={false}
                className="memori-dropdown--user-trigger"
                render={(props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
                  <Button
                    {...props}
                    variant="primary"
                    icon={<UserIcon />}
                    title={t('login.user') || 'User'}
                  />
                )}
              />
              <Dropdown.Menu>
                <Dropdown.Item>
                  <div className="memori-dropdown--user-info">
                    {user.avatarURL ? (
                      <>
                        <img
                          src={user.avatarURL}
                          alt={user.userName || user.eMail}
                          className="memori-dropdown--avatar"
                        />
                        <input
                          type="file"
                          name="avatar"
                          id="avatar"
                          className="memori-dropdown--avatar-input"
                          onChange={e =>
                            updateAvatar(
                              e.target.files?.[0] ?? (null as unknown as Blob)
                            )
                          }
                          accept={imgMimeTypes.join(', ')}
                        />
                      </>
                    ) : (
                      <div className="memori-dropdown--avatar-placeholder">
                        <span>
                          {(user.userName || user.eMail || 'U')
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <input
                          type="file"
                          name="avatar"
                          id="avatar"
                          className="memori-dropdown--avatar-input"
                          onChange={e =>
                            updateAvatar(
                              e.target.files?.[0] ?? (null as unknown as Blob)
                            )
                          }
                          accept={imgMimeTypes.join(', ')}
                        />
                      </div>
                    )}

                    <div className="memori-dropdown--user-details">
                      <h3 className="memori-dropdown--user-name">
                        {user.userName || t('login.welcomeUser')}
                      </h3>
                      <p className="memori-dropdown--user-email">
                        {user.eMail}
                      </p>
                      <div className="memori-dropdown--user-badge">
                        {user.birthDate
                          ? new Date(user.birthDate).toLocaleDateString()
                          : t('login.notSet')}
                      </div>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  onClick={onLogout}
                  className="memori-dropdown--action-button memori-dropdown--action-button--logout"
                  {...({ icon: <LogOut /> } as React.ComponentProps<typeof Dropdown.Item>)}
                >
                  {t('login.logout') || 'Logout'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              variant="primary"
              className="memori-header--button memori-header--button-login"
              icon={<UserIcon />}
              onClick={() => setShowLoginDrawer(true)}
              title={t('login.login') || 'Login'}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
