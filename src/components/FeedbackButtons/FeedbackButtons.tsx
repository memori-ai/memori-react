import { Memori } from '@memori.ai/memori-api-client/dist/types';
import React, { useState } from 'react';
import {
  Tooltip,
  Button,
  Dropdown,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import { MessageSquare } from 'lucide-react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
const feedbackMsgs = {
  'it-IT': 'Non è quello che ti ho chiesto',
  'fr-FR': "Ce n'est pas ce que je t'ai demandé",
  'en-GB': "It's not what I asked",
};

const feedbackMsgsHelpers = {
  'it-IT': 'La risposta non era corretta',
  'fr-FR': "La réponse n'était pas correcte",
  'en-GB': 'The answer was not correct',
};

const dislikeMsgs = {
  'it-IT': 'Non mi è piaciuta la risposta',
  'fr-FR': "Je n'ai pas aimé la réponse",
  'en-GB': "I didn't like the answer",
};

export interface Props {
  memori: Memori;
  onNegativeClick: (msg?: string) => void;
  className?: string;
  toggle?: boolean;
  dropdown?: boolean;
}

const FeedbackButtons = ({
  memori,
  className,
  onNegativeClick,
  toggle = false,
  dropdown = false,
}: Props) => {
  const { t } = useTranslation();
  const { add } = useAlertManager();
  const [clicked, setClicked] = useState<'up' | 'down'>();
  const feedbackLabel = t('feedback') || 'Feedback';
  const feedbackThankYou =
    t('feedbackThankYou') || 'Thank you for your feedback.';

  const showFeedbackSuccessAlert = () => {
    add(
      createAlertOptions({
        description: feedbackThankYou,
        severity: 'success',
      })
    );
  };
  const culture =
    memori.culture === 'it-IT'
      ? 'it-IT'
      : memori.culture === 'fr-FR'
      ? 'fr-FR'
      : 'en-GB';
  const feedbackMsg = feedbackMsgs[culture];
  const feedbackMsgHelper = feedbackMsgsHelpers[culture];
  const dislikeMsg = dislikeMsgs[culture];

  return (
    <div className={`memori-chat--feedback${className ? ` ${className}` : ''}`}>
      {dropdown ? (
        <Tooltip placement="bottom" content={feedbackLabel}>
          <span className="memori-chat--feedback-tooltip-trigger">
            <Dropdown className="memori-chat--feedback-menu">
              <Dropdown.Trigger
                className="memori-chat--feedback-button"
                showChevron={false}
                render={(
                  props: React.ButtonHTMLAttributes<HTMLButtonElement>
                ) => (
                  <Button
                    {...props}
                    variant="ghost"
                    aria-label={feedbackLabel}
                    disabled={!!clicked}
                    icon={
                      <MessageSquare
                        className={
                          clicked ? 'memori-chat--feedback-clicked' : undefined
                        }
                      />
                    }
                  />
                )}
              />
              <Dropdown.Menu
                className="memori-chat--feedback-menu-items"
                placement="bottom"
                align="end"
              >
                <div className="memori-chat--feedback-menu-items-container">
                  <Dropdown.Item
                    key="ok"
                    className="memori-chat--feedback-menu-item"
                    onClick={() => {
                      if (clicked === 'up' && !!toggle) {
                        setClicked(undefined);
                      } else {
                        setClicked('up');
                        showFeedbackSuccessAlert();
                      }
                    }}
                  >
                    {dislikeMsg}
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="no"
                    className="memori-chat--feedback-menu-item"
                    onClick={() => {
                      if (clicked === 'down' && !!toggle) {
                        setClicked(undefined);
                      } else {
                        setClicked('down');
                        onNegativeClick(feedbackMsg);
                        showFeedbackSuccessAlert();
                      }
                    }}
                  >
                    {feedbackMsgHelper}
                  </Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </Tooltip>
      ) : (
        <Tooltip placement="bottom" content={feedbackLabel}>
          <Button
            aria-label={feedbackLabel}
            onClick={() => {
              if (clicked === 'down' && !!toggle) {
                setClicked(undefined);
              } else {
                setClicked('down');
                onNegativeClick(feedbackMsg);
                showFeedbackSuccessAlert();
              }
            }}
            variant="ghost"
            shape="circle"
            icon={
              <MessageSquare
                className={
                  clicked ? 'memori-chat--feedback-clicked' : undefined
                }
              />
            }
          />
        </Tooltip>
      )}
    </div>
  );
};

export default FeedbackButtons;
