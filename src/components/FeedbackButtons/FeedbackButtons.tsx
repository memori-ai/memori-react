import { Memori } from '@memori.ai/memori-api-client/dist/types';
import React, { useState } from 'react';
import Tooltip from '../ui/Tooltip';
import Button from '../ui/Button';
import ThumbUp from '../icons/ThumbUp';
import ThumbDown from '../icons/ThumbDown';

import './FeedbackButtons.css';

const feedbackMsgs = {
  'it-IT': 'Non è quello che ti ho chiesto',
  'fr-FR': "Ce n'est pas ce que je t'ai demandé",
  'en-GB': "It's not what I asked",
};

export interface Props {
  memori: Memori;
  simulateUserPrompt: (msg: string) => void;
}

const FeedbackButtons = ({ memori, simulateUserPrompt }: Props) => {
  const [clicked, setClicked] = useState<'up' | 'down'>();
  const feedbackMsg =
    memori.culture === 'it-IT'
      ? feedbackMsgs['it-IT']
      : memori.culture === 'fr-FR'
      ? feedbackMsgs['fr-FR']
      : feedbackMsgs['en-GB'];

  return (
    <div className="memori-chat--feedback">
      <Button
        ghost
        shape="circle"
        onClick={() => {
          if (clicked === 'up') {
            setClicked(undefined);
          } else {
            setClicked('up');
          }
        }}
        icon={
          <ThumbUp
            className={
              clicked === 'up' ? 'memori-chat--feedback-clicked' : undefined
            }
          />
        }
      />
      <Tooltip content={feedbackMsg}>
        <Button
          ghost
          shape="circle"
          onClick={() => {
            if (clicked === 'down') {
              setClicked(undefined);
            } else {
              setClicked('down');
            }
            simulateUserPrompt(feedbackMsg);
          }}
          icon={
            <ThumbDown
              className={
                clicked === 'down' ? 'memori-chat--feedback-clicked' : undefined
              }
            />
          }
        />
      </Tooltip>
    </div>
  );
};

export default FeedbackButtons;
