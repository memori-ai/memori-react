import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from '@memori.ai/ui';
import { Check, EllipsisVertical } from 'lucide-react';

export interface Props {
  sendOnEnter: 'keypress' | 'click';
  setSendOnEnter: (value: 'keypress' | 'click') => void;
}

const SendOnEnterMenu: React.FC<Props> = ({ sendOnEnter, setSendOnEnter }) => {
  const { t } = useTranslation();

  return (
    <Dropdown>
      <Dropdown.Trigger showChevron={false}>
        <EllipsisVertical />
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => setSendOnEnter('keypress')}
        >
          <Button
            variant={sendOnEnter === 'keypress' ? 'primary' : 'ghost'}
            icon={
              sendOnEnter === 'keypress' ? <Check /> : null
            }
          >
            {t('widget.sendOnKeypress')}
          </Button>
          </Dropdown.Item>
          <Dropdown.Item
          onClick={() => setSendOnEnter('click')}
        >
          <Button
            variant={sendOnEnter === 'click' ? 'primary' : 'ghost'}
            icon={
              sendOnEnter === 'click' ? <Check /> : null
            }
          >
            {t('widget.sendOnClick')}
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SendOnEnterMenu;
