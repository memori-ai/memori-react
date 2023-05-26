import { Memori } from '@memori.ai/memori-api-client/dist/types';
import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Tooltip from '../ui/Tooltip';
import Button from '../ui/Button';
import Feedback from '../icons/Feedback';

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
  const [clicked, setClicked] = useState<'up' | 'down'>();
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
        <Menu as="div" className="memori-chat--feedback-menu">
          <Menu.Button as={React.Fragment}>
            <Button
              ghost
              shape="circle"
              title="Feedback"
              className="memori-chat--feedback-menu-button"
              disabled={!!clicked}
              icon={
                <Feedback
                  className={
                    clicked ? 'memori-chat--feedback-clicked' : undefined
                  }
                />
              }
            />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="memori-chat--feedback-menu-items">
              <div className="memori-chat--feedback-menu-items-container">
                <Menu.Item key="ok">
                  {({ active }) => (
                    <button
                      className={`memori-chat--feedback-menu-item${
                        active ? ' memori-chat--feedback-menu-item-active' : ''
                      }`}
                      onClick={() => {
                        if (clicked === 'up' && !!toggle) {
                          setClicked(undefined);
                        } else {
                          setClicked('up');
                        }
                      }}
                    >
                      {dislikeMsg}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item key="no">
                  {({ active }) => (
                    <button
                      className={`memori-chat--feedback-menu-item${
                        active ? ' memori-chat--feedback-menu-item-active' : ''
                      }`}
                      onClick={() => {
                        if (clicked === 'down' && !!toggle) {
                          setClicked(undefined);
                        } else {
                          setClicked('down');
                        }
                        onNegativeClick(feedbackMsg);
                      }}
                    >
                      {feedbackMsgHelper}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <Tooltip align="left" content="Feedback">
          <Button
            title="Feedback"
            onClick={() => {
              if (clicked === 'down' && !!toggle) {
                setClicked(undefined);
              } else {
                setClicked('down');
              }
              onNegativeClick(feedbackMsg);
            }}
            ghost
            shape="circle"
            icon={
              <Feedback
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
