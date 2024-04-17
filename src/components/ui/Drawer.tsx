import React, { FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import cx from 'classnames';

export interface Props {
  open?: boolean;
  onClose: (value: boolean) => void;
  className?: string;
  title?: string | JSX.Element | React.ReactNode;
  description?: string | JSX.Element | React.ReactNode;
  children: JSX.Element | React.ReactNode;
  footer?: JSX.Element | React.ReactNode;
  loading?: boolean;
  animated?: boolean;
  closable?: boolean;
  side?: 'left' | 'right';
  width?: string;
  widthMd?: string;
  widthLg?: string;
}

const Drawer: FC<Props> = ({
  open = false,
  onClose,
  className,
  title,
  description,
  children,
  footer,
  loading = false,
  animated = true,
  side = 'right',
  closable = true,
  width = '100%',
  widthMd = '80%',
  widthLg = '60%',
}: Props) => (
  <Transition appear show={open} as={React.Fragment}>
    <Dialog
      open={open}
      onClose={onClose}
      className={cx('memori-drawer', className)}
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
        <div className="memori-drawer--backdrop" />
      </Transition.Child>
      <div className="memori-drawer--container">
        <div className="memori-drawer--container-scrollable">
          <Transition.Child
            static
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom={animated ? 'max-w-0 opacity-0' : 'opacity-0'}
            enterTo="max-w-80 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="max-w-80 opacity-100"
            leaveTo={animated ? 'max-w-0 opacity-0' : 'opacity-0'}
          >
            <Dialog.Panel
              className={cx('memori-drawer--panel', {
                'memori-drawer--panel-left': side === 'left',
                'memori-drawer--with-footer': !!footer,
              })}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    .memori-drawer--panel {
                      --memori-drawer--width: ${width};
                      --memori-drawer--width-lg: ${widthLg};
                      --memori-drawer--width-md: ${widthMd};
                    }
                  `,
                }}
              />
              {closable && (
                <div className="memori-drawer--close">
                  <Button
                    shape="circle"
                    outlined
                    icon={<Close />}
                    onClick={() => onClose(false)}
                  />
                </div>
              )}
              <Spin spinning={loading}>
                {title && (
                  <Dialog.Title className="memori-drawer--title">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="memori-drawer--description">
                    {description}
                  </Dialog.Description>
                )}

                {children}

                {footer && (
                  <div className="memori-drawer--footer">{footer}</div>
                )}
              </Spin>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default Drawer;
