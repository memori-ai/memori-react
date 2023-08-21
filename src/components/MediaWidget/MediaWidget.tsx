import {
  Medium,
  TranslatedHint,
} from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState, memo } from 'react';
import Button from '../ui/Button';
import LinkItemWidget from './LinkItemWidget';
import MediaItemWidget, { Props as MediaItemProps } from './MediaItemWidget';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

export interface Props {
  hints?: TranslatedHint[];
  links?: Medium[];
  media?: Medium[];
  simulateUserPrompt?: (item: string, translatedItem?: string) => void;
  sessionID?: string;
  baseUrl?: string;
  apiUrl?: string;
  translateTo?: string;
  customMediaRenderer?: MediaItemProps['customMediaRenderer'];
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
  customMediaRenderer,
}: Props) => {
  const { t } = useTranslation();
  const [showHints, setShowHints] = useState(true);
  const [hintsPagination, setHintsPagination] = useState(6);

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
          customMediaRenderer={customMediaRenderer}
        />
      )}
      {links?.length > 0 && <LinkItemWidget items={links} baseUrl={baseUrl} />}
      {hints?.length > 0 && showHints && (
        <>
          <Transition appear show as="ul" className="memori-media--hints">
            {hints.slice(0, hintsPagination).map((item, index) => (
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
          {hints.length > hintsPagination && (
            <div className="memori-hints--show-more">
              <Button
                className="memori-hints--show-more-button"
                id="showMoreHints"
                onClick={() => setHintsPagination(hintsPagination + 6)}
              >
                {t('expand') || 'Expand'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(MediaWidget);
