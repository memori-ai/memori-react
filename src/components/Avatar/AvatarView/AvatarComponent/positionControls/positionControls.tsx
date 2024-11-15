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
  halfBody: boolean;
  setAvatarHeight: (value: number) => void;
  setAvatarDepth: (value: number) => void;
  setEnablePositionControls: (value: boolean) => void;
}

// eslint-disable-next-line no-undef
const PositionControls: React.FC<PositionControlsProps> = ({
  avatarHeight,
  avatarDepth,
  setAvatarHeight,
  setAvatarDepth,
  halfBody,
  setEnablePositionControls,
}: PositionControlsProps) => {
  const normalPosition = halfBody ? { height: 80, depth: 50 } : { height: 25, depth: 25 };
  const zoomedPosition = halfBody ? { height: 55, depth: 10 } : { height: 15, depth: 5 };
  const farPosition = halfBody ? { height: 100, depth: 80 } : { height: 65, depth: 100 };
  const settingsRef = useRef<Record<string, any>>({
    height: avatarHeight,
    depth: avatarDepth,
    zoomed: false,
    normal: false,
    far: false,
  });
  const { t } = useTranslation();

  // Update settings when values change externally
  useEffect(() => {
    settingsRef.current.height = avatarHeight;
    settingsRef.current.depth = avatarDepth;
  }, [avatarHeight, avatarDepth]);

  // Keyboard controls for depth
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '-' || event.key === '_' && settingsRef.current.depth < 100) {
        const newValue = Math.min(settingsRef.current.depth + 10, 100);
        setAvatarDepth(newValue);
        setLocalConfig('avatarDepth', newValue);
      } else if (
        (event.key === '+' || event.key === '=') &&
        settingsRef.current.depth > -100
      ) {
        const newValue = Math.max(settingsRef.current.depth - 10, -100);
        setAvatarDepth(newValue);
        setLocalConfig('avatarDepth', newValue);
      }
    };

    //add event listeners for plus and minus
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setAvatarDepth]);

  useEffect(() => {
    const handleArrowUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' && settingsRef.current.height < 100) {
        const newValue = settingsRef.current.height + 5;
        setAvatarHeight(newValue);
        setLocalConfig('avatarHeight', newValue);
      }
    };

    const handleArrowDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' && settingsRef.current.height > 0) {
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
      <div className="memori--slider-container">
        <Slider
          defaultValue={settingsRef.current.height}
          min={0.5}
          max={100}
          label={<label className="memori--slider-label">{t('write_and_speak.height')}</label>}
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
          min={0.5}
          max={100}
          step={5}
          label={<label className="memori--slider-label">{t('write_and_speak.depth')}</label>}
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
            avatarHeight === (halfBody ? zoomedPosition.height : normalPosition.height) &&
            avatarDepth === (halfBody ? zoomedPosition.depth : normalPosition.depth)
          }
          onClick={() => {
            setAvatarHeight(zoomedPosition.height);
            setAvatarDepth(zoomedPosition.depth);
            setLocalConfig('avatarHeight', zoomedPosition.height);
            setLocalConfig('avatarDepth', zoomedPosition.depth);
          }}
        >
          {t('write_and_speak.zoomed')}
        </Button>
        <Button
          outlined
          isActive={
            avatarHeight === (halfBody ? normalPosition.height : zoomedPosition.height) &&
            avatarDepth === (halfBody ? normalPosition.depth : zoomedPosition.depth)
          }
          onClick={() => {
            setAvatarHeight(normalPosition.height);
            setAvatarDepth(normalPosition.depth);
            setLocalConfig('avatarHeight', normalPosition.height);
            setLocalConfig('avatarDepth', normalPosition.depth);
          }}
        >
          {t('write_and_speak.normal')}
        </Button>
        <Button
          outlined
          isActive={
            avatarHeight === (halfBody ? farPosition.height : normalPosition.height) &&
            avatarDepth === (halfBody ? farPosition.depth : normalPosition.depth)
          }
          onClick={() => {
            setAvatarHeight(farPosition.height);
            setAvatarDepth(farPosition.depth);
            setLocalConfig('avatarHeight', farPosition.height);
            setLocalConfig('avatarDepth', farPosition.depth);
          }}
        >
          {t('write_and_speak.far')}
        </Button>
      </div>
    </div>
  );
};

export default PositionControls;
