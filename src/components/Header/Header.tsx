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
import MapMarker from '../icons/MapMarker';
import SoundDeactivated from '../icons/SoundDeactivated';
import Sound from '../icons/Sound';
import { useTranslation } from 'react-i18next';
import ExportHistoryButton from '../ExportHistoryButton/ExportHistoryButton';
import Setting from '../icons/Setting';
import ShareButton from '../ShareButton/ShareButton';
import FullscreenExit from '../icons/FullscreenExit';
import Fullscreen from '../icons/Fullscreen';
import Refresh from '../icons/Refresh';
import Clear from '../icons/Clear';
import DeepThought from '../icons/DeepThought';
import Group from '../icons/Group';
import UserIcon from '../icons/User';

export interface Props {
  className?: string;
  memori: Memori;
  tenant?: Tenant;
  history: Message[];
  position?: Venue;
  setShowPositionDrawer: (show: boolean) => void;
  setShowSettingsDrawer: (show: boolean) => void;
  setShowKnownFactsDrawer: (show: boolean) => void;
  setShowExpertsDrawer: (show: boolean) => void;
  enableAudio?: boolean;
  speakerMuted: boolean;
  setSpeakerMuted: (mute: boolean) => void;
  hasUserActivatedSpeak?: boolean;
  showShare?: boolean;
  showSettings?: boolean;
  showSpeaker?: boolean;
  showReload?: boolean;
  showClear?: boolean;
  showLogin?: boolean;
  setShowLoginDrawer: (show: boolean) => void;
  clearHistory: () => void;
  loginToken?: string;
  user?: User;
  sessionID?: string;
}

const Header: React.FC<Props> = ({
  className,
  memori,
  tenant,
  history,
  position,
  setShowPositionDrawer,
  setShowSettingsDrawer,
  setShowKnownFactsDrawer,
  setShowExpertsDrawer,
  enableAudio = true,
  speakerMuted,
  setSpeakerMuted,
  hasUserActivatedSpeak = false,
  showShare = true,
  showSettings = true,
  showSpeaker = true,
  showReload = false,
  showClear = false,
  showLogin = true,
  setShowLoginDrawer,
  clearHistory,
  loginToken,
  user,
  sessionID,
}) => {
  const { t } = useTranslation();
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  useEffect(() => {
    if (document.fullscreenEnabled) {
      setFullScreenAvailable(true);
    }
  }, []);

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
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
              setFullScreen(true);
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
              setFullScreen(false);
            }
          }}
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
      {enableAudio && showSpeaker && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button--speaker"
          icon={speakerMuted ? <SoundDeactivated /> : <Sound />}
          onClick={() => setSpeakerMuted(!speakerMuted)}
          title={t('widget.sound') || 'Sound'}
        />
      )}
      <ExportHistoryButton
        history={history}
        memori={memori}
        className="memori-header--button memori-header--button--export"
        disabled={!hasUserActivatedSpeak || history.length === 0}
      />
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
          tenant={tenant}
          showQrCode
          align="left"
        />
      )}
      {showLogin && (
        <Button
          primary
          shape="circle"
          className="memori-header--button memori-header--button-login"
          icon={<UserIcon />}
          onClick={() => setShowLoginDrawer(true)}
          title={
            loginToken ? t('login.user') || 'User' : t('login.login') || 'Login'
          }
        />
      )}
    </div>
  );
};

export default Header;
