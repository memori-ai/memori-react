import React from 'react';
import cx from 'classnames';
import {
  Memori,
  Message,
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

export interface Props {
  className?: string;
  memori: Memori;
  history: Message[];
  position?: Venue;
  setShowPositionDrawer: (show: boolean) => void;
  setShowSettingsDrawer: (show: boolean) => void;
  speakerMuted: boolean;
  setSpeakerMuted: (mute: boolean) => void;
  hasUserActivatedSpeak?: boolean;
  showShare?: boolean;
  showSettings?: boolean;
  showSpeaker?: boolean;
}

const Header: React.FC<Props> = ({
  className,
  memori,
  history,
  position,
  setShowPositionDrawer,
  setShowSettingsDrawer,
  speakerMuted,
  setSpeakerMuted,
  hasUserActivatedSpeak = false,
  showShare = true,
  showSettings = true,
  showSpeaker = true,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cx('memori-header', className)}>
      {memori.needsPosition && position && (
        <div className="memori-header--position">
          <span className="memori-header--position-placeName">
            {position.placeName}
          </span>
          <Button
            icon={<MapMarker />}
            shape="circle"
            className="memori-header--button"
            onClick={() => setShowPositionDrawer(true)}
          />
        </div>
      )}
      {showSpeaker && (
        <Button
          primary
          shape="circle"
          className="memori-header--button"
          icon={speakerMuted ? <SoundDeactivated /> : <Sound />}
          onClick={() => setSpeakerMuted(!speakerMuted)}
          title={t('widget.sound') || 'Sound'}
        />
      )}
      <ExportHistoryButton
        history={history}
        memori={memori}
        className="memori-header--button"
        disabled={!hasUserActivatedSpeak || history.length === 0}
      />
      {showSettings && (
        <Button
          primary
          shape="circle"
          className="memori-header--button"
          icon={<Setting />}
          onClick={() => setShowSettingsDrawer(true)}
          title={t('widget.settings') || 'Settings'}
        />
      )}
      {showShare && (
        <ShareButton
          className="memori-header--button"
          title={memori.name}
          showQrCode
          align="left"
        />
      )}
    </div>
  );
};

export default Header;
