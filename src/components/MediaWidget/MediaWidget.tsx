import {
  Medium,
  TranslatedHint,
} from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import LinkItemWidget from './LinkItemWidget';
import MediaItemWidget from './MediaItemWidget';
import { Transition } from '@headlessui/react';
import cx from 'classnames';

export interface Props {
  hints?: TranslatedHint[];
  links?: Medium[];
  media?: Medium[];
  simulateUserPrompt?: (item: string, translatedItem?: string) => void;
  sessionID?: string;
  baseUrl?: string;
  apiUrl?: string;
  translateTo?: string;
}

const MediaWidget: React.FC<Props> = ({
  hints = [],
  links = [],
  media = [],
  simulateUserPrompt = () => {},
  sessionID,
  baseUrl,
  apiUrl,
  translateTo,
}: Props) => {
  const [showHints, setShowHints] = useState(true);
  useEffect(() => {
    setShowHints(true);
  }, [hints]);

  return (
    <div className="memori-media-widget">
      {media?.length > 0 && (
        <MediaItemWidget
          items={media}
          sessionID={sessionID}
          translateTo={translateTo}
          baseURL={baseUrl}
          apiURL={apiUrl}
        />
      )}
      {links?.length > 0 && <LinkItemWidget items={links} baseUrl={baseUrl} />}
      {hints?.length > 0 && showHints && (
        <Transition appear show as="ul" className="memori-media--hints">
          {hints.map((item, index) => (
            <Transition.Child
              as="li"
              key={item.text + index}
              enter="ease-out duration-500"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-1 translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-1"
              leaveTo="opacity-0"
            >
              <Button
                key={item.text + index}
                className={cx('memori-media--hint')}
                primary
                onClick={() => {
                  simulateUserPrompt(item.originalText, item.text);
                  setShowHints(false);
                }}
                onTouchEnd={() => {
                  simulateUserPrompt(item.originalText, item.text);
                  setShowHints(false);
                }}
              >
                {item.text}
              </Button>
            </Transition.Child>
          ))}
        </Transition>
      )}
    </div>
  );
};

export default MediaWidget;
