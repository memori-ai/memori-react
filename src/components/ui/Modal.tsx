import React, { FC, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

export interface ModalProps {
  // Core props from your custom Modal
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
  
  // Additional props from Ant Design Modal
  visible?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  okButtonProps?: any;
  cancelButtonProps?: any;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
}

const Modal: FC<ModalProps> = ({
  // Handle both naming conventions
  open = false,
  visible = false,
  onClose,
  onCancel,
  onOk,
  
  // Text props
  className,
  title,
  description,
  children,
  
  // Style/behavior props
  loading = false,
  closable = true,
  width = '100%',
  widthMd = '100%',
  maskClosable = true,
  
  // Footer props
  footer,
  okText,
  cancelText,
  okButtonProps = {},
  cancelButtonProps = {},
  
  // Not used but included for compatibility
  destroyOnClose,
}) => {
  const { t } = useTranslation();
  
  // Use either visible or open prop
  const isOpen = visible || open;
  
  // Handle closing with compatibility for both API styles
  const handleClose = (value: boolean) => {
    if (onClose) onClose(value);
    if (!value && onCancel) onCancel();
  };
  
  // Only close on backdrop click if maskClosable is true
  const handleBackdropClick = () => {
    if (maskClosable) {
      handleClose(false);
    }
    return false; // Prevent closing if maskClosable is false
  };
  
  // Generate default footer if okText/cancelText are provided and no custom footer
  const renderFooter = () => {
    if (footer) return footer;
    
    if (okText || cancelText || onOk) {
      return (
        <div className="memori-modal--footer">
          {(cancelText || onCancel) && (
            <Button 
              onClick={() => {
                if (onCancel) onCancel();
                handleClose(false);
              }}
              {...cancelButtonProps}
            >
              {cancelText || t('cancel', { ns: 'common' })}
            </Button>
          )}
          {(okText || onOk) && (
            <Button 
              primary 
              onClick={() => {
                if (onOk) onOk();
              }}
              {...okButtonProps}
            >
              {okText || t('ok', { ns: 'common' })}
            </Button>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        open={isOpen}
        onClose={handleBackdropClick}
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
                      onClick={() => handleClose(false)}
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
                  <div className="memori-modal--content">{children}</div>
                  {renderFooter()}
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