import React, { FC } from 'react';
import { Dialog } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import cx from 'classnames';

import './Modal.css';

export interface Props {
  open?: boolean;
  onClose: (value: boolean) => void;
  className?: string;
  title?: string | JSX.Element | React.ReactNode;
  description?: string | JSX.Element | React.ReactNode;
  children: JSX.Element | React.ReactNode;
  footer?: JSX.Element | React.ReactNode;
  loading?: boolean;
  closable?: boolean;
}

const Modal: FC<Props> = ({
  open = false,
  onClose,
  className,
  title,
  description,
  children,
  footer,
  loading = false,
  closable = true,
}: Props) => (
  <Dialog
    open={open}
    onClose={onClose}
    className={cx('memori-modal', className)}
  >
    <div className="memori-modal--backdrop" />
    <div className="memori-modal--container">
      <Dialog.Panel className="memori-modal--panel">
        {closable && (
          <div className="memori-modal--close">
            <Button
              ghost
              padded
              shape="circle"
              icon={<Close />}
              onClick={() => onClose(false)}
            />
          </div>
        )}
        <Spin spinning={loading}>
          {title && (
            <Dialog.Title className="memori-modal--title">{title}</Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="memori-modal--description">
              {description}
            </Dialog.Description>
          )}

          {children}

          {footer && <div className="memori-modal--footer">{footer}</div>}
        </Spin>
      </Dialog.Panel>
    </div>
  </Dialog>
);

export default Modal;
