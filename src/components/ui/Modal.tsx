import React, { FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

export interface Props {
  open?: boolean;
  onClose: (value: boolean) => void;
  className?: string;
  title?: string | JSX.Element | React.ReactNode;
  description?: string | JSX.Element | React.ReactNode;
  children?: JSX.Element | React.ReactNode;
  footer?: JSX.Element | React.ReactNode;
  loading?: boolean;
  closable?: boolean;
  width?: string;
  widthMd?: string;
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
  width = '100%',
  widthMd = '100%',
}: Props) => {
  const { t } = useTranslation();

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
        open={open}
        onClose={onClose}
        className={cx('memori-modal', className)}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="memori-modal--backdrop" />
        </Transition.Child>
        <div className="memori-modal--container">
          <div className="memori-modal--container-scrollable">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="memori-modal--panel">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    .memori-modal--panel {
                      --memori-modal--width: ${width};
                      --memori-modal--width-md: ${widthMd};
                    }
                  `,
                  }}
                />
                {closable && (
                  <div className="memori-modal--close">
                    <Button
                      ghost
                      padded
                      shape="circle"
                      icon={<Close />}
                      title={t('close') || 'Close'}
                      onClick={() => onClose(false)}
                    />
                  </div>
                )}
                <Spin spinning={loading}>
                  {title && (
                    <Dialog.Title className="memori-modal--title">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="memori-modal--description">
                      {description}
                    </Dialog.Description>
                  )}

                  {children}

                  {footer && (
                    <div className="memori-modal--footer">{footer}</div>
                  )}
                </Spin>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
