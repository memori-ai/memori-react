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
      <Dropdown.Trigger
        showChevron={false}
        render={(props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
          <Button {...props} variant="ghost" icon={<EllipsisVertical />} />
        )}
      />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => setSendOnEnter('keypress')}
          {...({ icon: sendOnEnter === 'keypress' ? <Check /> : undefined } as React.ComponentProps<typeof Dropdown.Item>)}
        >
          {t('widget.sendOnKeypress')}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setSendOnEnter('click')}
          {...({ icon: sendOnEnter === 'click' ? <Check /> : undefined } as React.ComponentProps<typeof Dropdown.Item>)}
        >
          {t('widget.sendOnClick')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SendOnEnterMenu;
