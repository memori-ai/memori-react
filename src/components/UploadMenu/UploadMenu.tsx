import React from 'react';
import { Menu } from '@headlessui/react';
import cx from 'classnames';
import Button from '../ui/Button';
import Link from '../icons/Link';
import Picture from '../icons/Picture';
import PaperClip from '../icons/PaperClip';

export interface Props {
  attachmentsMenuOpen?: 'link' | 'media';
  setAttachmentsMenuOpen: (value: 'link' | 'media') => void;
  disabled?: boolean;
  authToken?: string;
}

const UploadMenu: React.FC<Props> = ({
  attachmentsMenuOpen,
  setAttachmentsMenuOpen,
  disabled = false,
  authToken,
}) => {
  return (
    <Menu as="div" className="memori-upload-menu">
      <Menu.Button
        disabled={disabled}
        className={cx(
          'memori-button',
          'memori-button--circle',
          'memori-button--icon-only',
          'memori-share-button--button',
          'memori--conversation-button'
        )}
      >
        <div className="memori-button--icon">
          <PaperClip />
        </div>
      </Menu.Button>
      <Menu.Items as="ul" className="memori-menu--overlay">
        <Menu.Item as="li" className="memori-menu--li">
          <Button
            className="memori-menu--button"
            ghost
            icon={<Link />}
            outlined={attachmentsMenuOpen === 'link'}
            onClick={() => setAttachmentsMenuOpen('link')}
          >
            Link
          </Button>
        </Menu.Item>
        {!!authToken?.length && (
          <Menu.Item>
            <Button
              className="memori-menu--button"
              ghost
              icon={<Picture />}
              outlined={attachmentsMenuOpen === 'media'}
              onClick={() => setAttachmentsMenuOpen('media')}
            >
              Media
            </Button>
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  );
};

export default UploadMenu;
