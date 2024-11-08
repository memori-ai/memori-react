import { useEffect, useRef } from 'react';
import { setLocalConfig } from '../../../../../helpers/configuration';
import { useTranslation } from 'react-i18next';
import Slider from '../../../../../components/ui/Slider';
import './positionControls.css';
import Button from '../../../../ui/Button';
import Close from '../../../../icons/Close';

interface PositionControlsProps {
  avatarHeight: number;
  avatarDepth: number;
  setAvatarHeight: (value: number) => void;
  setAvatarDepth: (value: number) => void;
  isZoomed?: boolean;
  setEnablePositionControls: (value: boolean) => void;
}

export const normalPosition = { height: 75, depth: -45 };
export const zoomedPosition = { height: 65, depth: -80 };
export const farPosition = { height: 100, depth: 50 };

// eslint-disable-next-line no-undef
const PositionControls: React.FC<PositionControlsProps> = ({
  avatarHeight,
  avatarDepth,
  setAvatarHeight,
  setAvatarDepth,
  isZoomed = false,
  setEnablePositionControls,
}: PositionControlsProps) => {
  const { t } = useTranslation();
  const settingsRef = useRef<Record<string, any>>({
    height: avatarHeight,
    depth: avatarDepth,
    zoomed: false,
    normal: false,
    far: false,
  });

  // Update settings when values change externally
  // useEffect(() => {
  //   settingsRef.current.height = avatarHeight;
  //   settingsRef.current.depth = avatarDepth;
  // }, [avatarHeight, avatarDepth]);

  // Keyboard controls for depth
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '-' || event.key === '_') {
        const newValue = Math.min(settingsRef.current.depth + 10, 100);
        setAvatarDepth(newValue);
        setLocalConfig('avatarDepth', newValue);
      } else if (event.key === '+' || event.key === '=') {
        const newValue = Math.max(settingsRef.current.depth - 10, -100);
        setAvatarDepth(newValue);
        setLocalConfig('avatarDepth', newValue);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setAvatarDepth]);

  useEffect(() => {
    const handleArrowUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        const newValue = settingsRef.current.height + 5;
        setAvatarHeight(newValue);
        setLocalConfig('avatarHeight', newValue);
      }
    };

    const handleArrowDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        const newValue = settingsRef.current.height - 5;
        setAvatarHeight(newValue);
        setLocalConfig('avatarHeight', newValue);
      }
    };

    window.addEventListener('keydown', handleArrowUp);
    window.addEventListener('keydown', handleArrowDown);

    return () => {
      window.removeEventListener('keydown', handleArrowUp);
      window.removeEventListener('keydown', handleArrowDown);
    };
  }, [setAvatarHeight]);

  console.log(avatarHeight, avatarDepth);

  return (
    <div className="memori--position-controls">
      <div className="memori--position-controls-close">
        <Button
          ghost
          icon={<Close />}
          outlined
          danger
          shape="circle"
          className="memori--position-controls-close-button"
          onClick={() => {
            setEnablePositionControls(false);
          }}
        />
      </div>
      <div className="memori--position-controls-helper">
        <p className="memori--position-controls-helper-text">
          {t('Use the arrow keys to adjust the avatar height')}
          <br />
          {t('Use +/- to adjust the avatar depth')}
        </p>
      </div>
      <div className="memori--slider-container">
        <Slider
          defaultValue={settingsRef.current.height}
          min={0}
          max={100}
          label={<label className="memori--slider-label">{t('Height')}</label>}
          step={1}
          onChange={(value: number) => {
            setAvatarHeight(value);
            setLocalConfig('avatarHeight', value);
          }}
        />
      </div>
      <div className="memori--slider-container">
        <Slider
          defaultValue={settingsRef.current.depth}
          min={isZoomed ? -50 : -100}
          max={isZoomed ? 50 : 100}
          step={5}
          label={<label className="memori--slider-label">{t('Depth')}</label>}
          onChange={(value: number) => {
            setAvatarDepth(value);
            setLocalConfig('avatarDepth', value);
          }}
        />
      </div>
      <div className="memori--preset-buttons">
        <Button
          outlined
          isActive={
            avatarHeight === zoomedPosition.height &&
            avatarDepth === zoomedPosition.depth
          }
          onClick={() => {
            setAvatarHeight(zoomedPosition.height);
            setAvatarDepth(zoomedPosition.depth);
            setLocalConfig('avatarHeight', zoomedPosition.height);
            setLocalConfig('avatarDepth', zoomedPosition.depth);
          }}
        >
          {t('Zoomed')}
        </Button>
        <Button
          outlined
          isActive={
            avatarHeight === normalPosition.height &&
            avatarDepth === normalPosition.depth
          }
          onClick={() => {
            setAvatarHeight(normalPosition.height);
            setAvatarDepth(normalPosition.depth);
            setLocalConfig('avatarHeight', normalPosition.height);
            setLocalConfig('avatarDepth', normalPosition.depth);
          }}
        >
          {t('Normal')}
        </Button>
        <Button
          outlined
          isActive={
            avatarHeight === farPosition.height &&
            avatarDepth === farPosition.depth
          }
          onClick={() => {
            setAvatarHeight(farPosition.height);
            setAvatarDepth(farPosition.depth);
            setLocalConfig('avatarHeight', farPosition.height);
            setLocalConfig('avatarDepth', farPosition.depth);
          }}
        >
          {t('Far')}
        </Button>
      </div>
    </div>
  );
};

export default PositionControls;
