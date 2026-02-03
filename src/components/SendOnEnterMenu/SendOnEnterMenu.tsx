import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from '@memori.ai/ui';

export interface Props {
  sendOnEnter: 'keypress' | 'click';
  setSendOnEnter: (value: 'keypress' | 'click') => void;
}

const SendOnEnterMenu: React.FC<Props> = ({ sendOnEnter, setSendOnEnter }) => {
  const { t } = useTranslation();

  return (
    <Dropdown className="memori-send-on-enter-menu">
      <Dropdown.Trigger
        showChevron={false}
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button'
        )}
      >
        <div className="memori-button--icon">
          <span style={{ display: 'block', width: '1rem', height: '1rem' }}>
            …
          </span>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu className="memori-menu--overlay">
        <ul>
          <li className="memori-menu--option">
            <Dropdown.Item
              className="memori-menu--button"
              onClick={() => setSendOnEnter('keypress')}
            >
              <Button
                variant={sendOnEnter === 'keypress' ? 'primary' : 'ghost'}
                className="memori-menu--button"
                icon={
                  <span className="memori-menu--icon">
                    {sendOnEnter === 'keypress' ? '✓' : ''}
                  </span>
                }
              >
                {t('widget.sendOnKeypress')}
              </Button>
            </Dropdown.Item>
          </li>
          <li className="memori-menu--option">
            <Dropdown.Item
              className="memori-menu--button"
              onClick={() => setSendOnEnter('click')}
            >
              <Button
                variant={sendOnEnter === 'click' ? 'primary' : 'ghost'}
                className="memori-menu--button"
                icon={
                  <span className="memori-menu--icon">
                    {sendOnEnter === 'click' ? '✓' : ''}
                  </span>
                }
              >
                {t('widget.sendOnClick')}
              </Button>
            </Dropdown.Item>
          </li>
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SendOnEnterMenu;
