import {
  Medium,
  TranslatedHint,
} from '@memori.ai/memori-api-client/dist/types';
import React, { useEffect, useState, memo } from 'react';
import { Button } from '@memori.ai/ui';
import MediaItemWidget, { Props as MediaItemProps } from './MediaItemWidget';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

export interface Props {
  hints?: TranslatedHint[];
  links?: Medium[];
  media?: (Medium & { type?: string })[];
  simulateUserPrompt?: (item: string, translatedItem?: string) => void;
  sessionID?: string;
  baseUrl?: string;
  apiUrl?: string;
  translateTo?: string;
  customMediaRenderer?: MediaItemProps['customMediaRenderer'];
  fromUser?: boolean;
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
  fromUser = false,
}: Props) => {
  const { t } = useTranslation();
  const [showHints, setShowHints] = useState(true);
  const [hintsPagination, setHintsPagination] = useState(6);

  useEffect(() => {
    setShowHints(true);
  }, [hints]);

  return (
    <div className="memori-media-widget">
      {(media?.length > 0 || links?.length > 0) && (
        <MediaItemWidget
          items={[...(media || []), ...(links || [])]}
          sessionID={sessionID}
          translateTo={translateTo}
          baseURL={baseUrl}
          apiURL={apiUrl}
          customMediaRenderer={customMediaRenderer}
          fromUser={fromUser}
        />
      )}
      {hints?.length > 0 && showHints && (
        <>
          <ul className="memori-media--hints">
            {hints.slice(0, hintsPagination).map((item, index) => (
              <li key={item.text + index}>
                <Button
                  key={item.text + index}
                  className={cx('memori-media--hint')}
                  variant="primary"
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
              </li>
            ))}
          </ul>
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
