import React from 'react';
import { Props as ChatInputProps } from '../ChatInputs/ChatInputs';
import { Mic, Square } from 'lucide-react';
import { Tooltip } from '@memori.ai/ui';
import IconButton from '../IconButton/IconButton';
import { useTranslation } from 'react-i18next';

export interface Props {
  listening?: ChatInputProps['listening'];
  stopAudio: ChatInputProps['stopAudio'];
  startListening: ChatInputProps['startListening'];
  stopListening: () => void;
  /** When true, recording cannot be started (e.g. no session yet — see ChatInputs). */
  disabled?: boolean;
}

const MicrophoneButton = ({
  listening,
  stopAudio,
  startListening,
  stopListening,
  disabled = false,
}: Props) => {
  const { t } = useTranslation();
  const isRecording = !!listening;

  const idleHint = t('write_and_speak.micButtonPopover') || 'Press to speak';
  const stopHint = t('write_and_speak.stopRecording') || 'Stop recording';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (isRecording) {
      stopListening();
      return;
    }

    stopAudio();
    startListening();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tooltip
      title={isRecording ? stopHint : idleHint}
      placement="top-end"
      className="memori-chat-inputs--mic-tooltip"
      slotProps={{
        positioner: {
          className: 'memori-chat-inputs--mic-tooltip-positioner',
        },
        popup: {
          className: 'memori-chat-inputs--mic-tooltip-popup',
        },
      }}
    >
      <div onContextMenu={handleContextMenu}>
        <IconButton
          size="sm"
          className="memori-chat-inputs--mic"
          recording={isRecording}
          aria-label={isRecording ? stopHint : idleHint}
          aria-pressed={isRecording}
          disabled={disabled}
          onClick={handleClick}
          icon={
            isRecording ? (
              <Square
                className="memori-chat-inputs--mic-stop"
                aria-hidden
                fill="currentColor"
                strokeWidth={0}
              />
            ) : (
              <Mic aria-hidden />
            )
          }
        />
      </div>
    </Tooltip>
  );
};

export default MicrophoneButton;
