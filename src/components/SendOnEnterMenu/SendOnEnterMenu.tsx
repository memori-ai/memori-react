import React from 'react';
import { Menu, RadioGroup } from '@headlessui/react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

export interface Props {
  sendOnEnter: 'keypress' | 'click';
  setSendOnEnter: (value: 'keypress' | 'click') => void;
}

const SendOnEnterMenu: React.FC<Props> = ({ sendOnEnter, setSendOnEnter }) => {
  const { t } = useTranslation();

  return (
    <Menu as="div" className="memori-send-on-enter-menu">
      <Menu.Button
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button'
        )}
      >
        <div className="memori-button--icon">
          <span
            style={{
              display: 'block',
              width: '1rem',
              height: '1rem',
            }}
          >
            …
          </span>
        </div>
      </Menu.Button>
      <Menu.Items className="memori-menu--overlay">
        <RadioGroup value={sendOnEnter} onChange={setSendOnEnter}>
          <RadioGroup.Option value="keypress" className="memori-menu--option">
            {({ checked }) => (
              <Menu.Item>
                <Button
                  className="memori-menu--button"
                  ghost
                  outlined={checked}
                  icon={
                    <span className="memori-menu--icon">
                      {checked ? '✓' : ''}
                    </span>
                  }
                >
                  {t('widget.sendOnKeypress')}
                </Button>
              </Menu.Item>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="click" className="memori-menu--option">
            {({ checked }) => (
              <Menu.Item>
                <Button
                  className="memori-menu--button"
                  ghost
                  outlined={checked}
                  icon={
                    <span className="memori-menu--icon">
                      {checked ? '✓' : ''}
                    </span>
                  }
                >
                  {t('widget.sendOnClick')}
                </Button>
              </Menu.Item>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </Menu.Items>
    </Menu>
  );
};

export default SendOnEnterMenu;
