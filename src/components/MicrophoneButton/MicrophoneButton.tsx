import React, { useState, useEffect, useRef } from 'react';
import { Props as ChatInputProps } from '../ChatInputs/ChatInputs';
import Microphone from '../icons/Microphone';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

export interface Props {
  listening?: ChatInputProps['listening'];
  stopAudio: ChatInputProps['stopAudio'];
  startListening: ChatInputProps['startListening'];
  stopListening: ChatInputProps['stopListening'];
}

const MicrophoneButton = ({
  listening,
  stopAudio,
  startListening,
  stopListening,
}: Props) => {
  const { t } = useTranslation();
  const [micBtnTooltip, setMicBtnTooltip] = useState<string | undefined>();

  const intervalRef = useRef<any>(null);

  const startHold = (
    e:
      | React.TouchEvent<HTMLButtonElement>
      | React.MouseEvent<Element, MouseEvent>
  ) => {
    e.preventDefault();

    setMicBtnTooltip(t('write_and_speak.holdToSpeak') || 'Hold to record');

    if (intervalRef.current) return;
    intervalRef.current = setTimeout(() => {
      stopAudio();
      setMicBtnTooltip(
        t('write_and_speak.releaseToEndListening') || 'Release to end listening'
      );
      startListening();
    }, 300);
  };

  const stopHold = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    stopListening();
    setMicBtnTooltip(undefined);
  };

  useEffect(() => {
    return () => stopHold();
  }, []);

  return (
    <Tooltip
      visible={!!micBtnTooltip}
      content={
        <span>
          {micBtnTooltip ||
            t('write_and_speak.pressAndHoldToSpeak') ||
            'Press and hold to speak'}
        </span>
      }
      align="topLeft"
      className="memori-mic-btn-tooltip"
    >
      <Button
        primary
        className={cx('memori-chat-inputs--mic', {
          'memori-chat-inputs--mic--listening': listening,
        })}
        title={
          listening
            ? t('write_and_speak.micButtonPopoverListening') || 'Listening'
            : t('write_and_speak.micButtonPopover') || 'Start listening'
        }
        onMouseDown={startHold}
        onTouchStart={startHold}
        onMouseUp={stopHold}
        onTouchEnd={stopHold}
        shape="circle"
        icon={<Microphone />}
      />
    </Tooltip>
  );
};

export default MicrophoneButton;
