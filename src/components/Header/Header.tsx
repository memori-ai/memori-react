import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
  Memori,
  Message,
  Tenant,
  Venue,
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

export interface Props {
  className?: string;
  memori: Memori;
  tenant?: Tenant;
  history: Message[];
  position?: Venue;
  setShowPositionDrawer: (show: boolean) => void;
  setShowSettingsDrawer: (show: boolean) => void;
  setShowKnownFactsDrawer: (show: boolean) => void;
  speakerMuted: boolean;
  setSpeakerMuted: (mute: boolean) => void;
  hasUserActivatedSpeak?: boolean;
  showShare?: boolean;
  showSettings?: boolean;
  showSpeaker?: boolean;
  showReload?: boolean;
  showClear?: boolean;
  clearHistory: () => void;
  loginToken?: string;
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
  speakerMuted,
  setSpeakerMuted,
  hasUserActivatedSpeak = false,
  showShare = true,
  showSettings = true,
  showSpeaker = true,
  showReload = false,
  showClear = false,
  clearHistory,
  loginToken,
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
      {memori.needsPosition && position && (
        <div className="memori-header--position">
          <span className="memori-header--position-placeName">
            {position.placeName}
          </span>
          <Button
            icon={<MapMarker />}
            shape="circle"
            className="memori-header--button memori-header--button--position"
            onClick={() => setShowPositionDrawer(true)}
          />
        </div>
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
      {memori.enableDeepThought && !!loginToken && (
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
      {showSpeaker && (
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
    </div>
  );
};

export default Header;
