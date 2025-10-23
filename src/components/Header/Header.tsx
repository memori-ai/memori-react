import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
  Memori,
  Message,
  Tenant,
  Venue,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import MapMarker from '../icons/MapMarker';
import SoundDeactivated from '../icons/SoundDeactivated';
import Sound from '../icons/Sound';
import { useTranslation } from 'react-i18next';
import Setting from '../icons/Setting';
import ShareButton from '../ShareButton/ShareButton';
import FullscreenExit from '../icons/FullscreenExit';
import Fullscreen from '../icons/Fullscreen';
import Refresh from '../icons/Refresh';
import Clear from '../icons/Clear';
import DeepThought from '../icons/DeepThought';
import Group from '../icons/Group';
import UserIcon from '../icons/User';
import MessageIcon from '../icons/Message';
import Logout from '../icons/Logout';
import { getErrori18nKey } from '../../helpers/error';
import toast from 'react-hot-toast';
import memoriApiClient from '@memori.ai/memori-api-client';

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
}

const Header: React.FC<Props> = ({
  className,
  memori,
  tenant,
  // history,
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
}) => {
  const { t } = useTranslation();
  const { uploadAsset, pwlUpdateUser } = apiClient.backend;
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  useEffect(() => {
    if (document.fullscreenEnabled) {
      setFullScreenAvailable(true);
    }
  }, []);

  const updateAvatar = async (avatar: Blob) => {
    console.log('[updateAvatar] Starting avatar update', { avatar });
    if (avatar && loginToken) {
      const reader = new FileReader();
      reader.onload = async e => {
        console.log('[updateAvatar] FileReader loaded', {
          result: e.target?.result,
        });
        try {
          console.log('[updateAvatar] Uploading asset...');
          const { asset: avatarAsset, ...resp } = await uploadAsset(
            avatar.name ?? 'avatar',
            e.target?.result as string,
            loginToken ?? ''
          );
          console.log('[updateAvatar] Upload response:', { avatarAsset, resp });

          if (resp.resultCode !== 0) {
            console.error('[updateAvatar] Upload failed:', resp);
            toast.error(t(getErrori18nKey(resp.resultCode)));
          } else if (avatarAsset) {
            console.log('[updateAvatar] Upload successful, updating user...');
            let newUser: Partial<User> = {
              userID: user?.userID,
              avatarURL: avatarAsset.assetURL,
            };

            const { user: patchedUser, ...resp } = await pwlUpdateUser(
              loginToken ?? '',
              user?.userID ?? '',
              newUser
            );
            console.log('[updateAvatar] User update complete', {
              patchedUser,
              resp,
            });
          }
        } catch (e) {
          let err = e as Error;
          console.error('[updateAvatar] Error:', err);

          if (err?.message) toast.error(err.message);
        }
      };
      reader.readAsDataURL(avatar as Blob);
    } else {
      console.error('[updateAvatar] Missing avatar or login token', {
        avatar,
        loginToken,
      });
      toast.error(t('login.avatarUploadError'));
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
            primary
            shape="circle"
            className="memori-header--button memori-header--button--position"
            title={t('widget.position') || 'Position'}
            icon={<MapMarker />}
            onClick={() => setShowPositionDrawer(true)}
          />
        </div>
      )}
      {showReload && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button--reload"
          title={t('reload') || 'Reload'}
          icon={<Refresh />}
          onClick={() => {
            window.location.reload();
          }}
        />
      )}
      {showClear && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button--clear"
          title={t('clearHistory') || 'Clear chat'}
          icon={<Clear />}
          onClick={clearHistory}
        />
      )}
      {showChatHistory && !!loginToken && (
        <Button
          primary
          disabled={!loginToken}
          shape="circle"
          className="memori-header--button memori-header--button--chat-history"
          title={t('write_and_speak.chatHistory') || 'Chat history'}
          icon={<MessageIcon />}
          onClick={() => setShowChatHistoryDrawer(true)}
        />
      )}
      {fullScreenAvailable && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button--fullscreen"
          title={
            fullScreen
              ? t('fullscreenExit') || 'Exit fullscreen'
              : t('fullscreenEnter') || 'Enter fullscreen'
          }
          icon={fullScreen ? <FullscreenExit /> : <Fullscreen />}
          onClick={
            fullScreenHandler ||
            (() => {
              if (!document.fullscreenElement) {
                const memoriWidget = document.querySelector('.memori-widget');
                if (memoriWidget) {
                  // Set white background before entering fullscreen
                  (memoriWidget as HTMLElement).style.backgroundColor = '#FFFFFF';
                  
                  memoriWidget.requestFullscreen().then(() => {
                    // Move portals inside fullscreen element
                    const portals = document.querySelectorAll('[data-headlessui-portal]');
                    portals.forEach(portal => {
                      memoriWidget.appendChild(portal);
                    });
                  }).catch(err => {
                    console.warn('Error attempting to enable fullscreen:', err);
                  });
                }
                setFullScreen(true);
              } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => {
                  console.warn('Error attempting to exit fullscreen:', err);
                });
                setFullScreen(false);
              }
            })
          }
        />
      )}
      {memori.enableDeepThought && !!loginToken && user?.pAndCUAccepted && (
        <Button
          primary={!!sessionID && !!hasUserActivatedSpeak}
          shape="circle"
          icon={<DeepThought />}
          className="memori-header--button memori-header--button--knownfacts"
          disabled={!hasUserActivatedSpeak || !sessionID}
          onClick={() => setShowKnownFactsDrawer(true)}
          title={t('knownFacts.title') || 'Known facts'}
        />
      )}
      {memori.enableBoardOfExperts && (
        <Button
          primary
          shape="circle"
          icon={<Group />}
          className="memori-header--button memori-header--button--experts"
          disabled={!hasUserActivatedSpeak || !sessionID}
          onClick={() => setShowExpertsDrawer(true)}
          title={t('widget.showExpertsInTheBoard') || 'Experts in this board'}
        />
      )}
      {enableAudio && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button--speaker"
          icon={speakerMuted ? <SoundDeactivated /> : <Sound />}
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
      {showSettings && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button-settings"
          icon={<Setting />}
          onClick={() => setShowSettingsDrawer(true)}
          title={t('widget.settings') || 'Settings'}
        />
      )}
      {showShare && (
        <ShareButton
          className="memori-header--button memori-header--button-share"
          title={memori.name}
          memori={memori}
          sessionID={sessionID}
          tenant={tenant}
          showQrCode
          align="left"
          baseUrl={baseUrl}
        />
      )}
      {showLogin && (
        <>
          {loginToken && user ? (
            <Dropdown
              placement="bottom-right"
              trigger={
                <Button
                  primary
                  shape="circle"
                  className="memori-header--button memori-header--button-login"
                  icon={<UserIcon />}
                  title={t('login.user') || 'User'}
                />
              }
            >
              <div className="memori-dropdown--user-profile">
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
                    <p className="memori-dropdown--user-email">{user.eMail}</p>
                    <div className="memori-dropdown--user-badge">
                      {user.birthDate
                        ? new Date(user.birthDate).toLocaleDateString()
                        : t('login.notSet')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="memori-dropdown--actions">
                <button
                  className="memori-dropdown--action-button memori-dropdown--action-button--logout"
                  onClick={onLogout}
                >
                  <Logout className="memori-dropdown--action-icon" />
                  {t('login.logout') || 'Logout'}
                </button>
              </div>
            </Dropdown>
          ) : (
            <Button
              primary
              shape="circle"
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
