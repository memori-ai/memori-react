import React, { FC, useEffect, useState, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

export interface Props {
  title?: string | React.ReactNode;
  open?: boolean;
  data?: any;
  onClose?: () => void;
  width?: number | string;
  children?: React.ReactNode;
  footer?: {
    leftAction?: React.ReactNode;
    leftActionClassName?: string;
    onSubmit?: () => void;
    loading?: boolean;
  };
  extra?: React.ReactNode;
  className?: string;
  placement?: 'left' | 'right';
  description?: string | JSX.Element | React.ReactNode;
  loading?: boolean;
  animated?: boolean;
  closable?: boolean;
  widthMd?: string;
  widthLg?: string;
}

// Custom confirm dialog component
const ConfirmDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="memori-confirm-dialog" onClose={onClose}>
        <div className="memori-confirm-dialog--backdrop" />
        <div className="memori-confirm-dialog--container">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="memori-confirm-dialog--panel">
              <Dialog.Title className="memori-confirm-dialog--title">{title}</Dialog.Title>
              <Dialog.Description className="memori-confirm-dialog--message">
                {message}
              </Dialog.Description>
              <div className="memori-confirm-dialog--actions">
                <Button outlined onClick={onClose}>
                  {cancelText}
                </Button>
                <Button onClick={onConfirm}>
                  {confirmText}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const Drawer: FC<Props> = ({
  title,
  open = false,
  data,
  onClose = () => {},
  children,
  width = '80%',
  footer,
  extra,
  className,
  placement = 'right',
  description,
  loading = false,
  animated = true,
  closable = true,
  widthMd = '80%',
  widthLg = '60%',
}: Props) => {
  const [originalData, setOriginalData] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { t } = useTranslation(['admin', 'common']);
  
  // Track if the drawer has been opened to handle data initialization correctly
  const drawerOpenedRef = useRef(false);
  // Reset original data when drawer opens
  useEffect(() => {
    if (open && !drawerOpenedRef.current && data) {
      try {
        const dataCopy = JSON.parse(JSON.stringify(data));
        setOriginalData(dataCopy);
      } catch (e) {
        setOriginalData(data);
      }
      drawerOpenedRef.current = true;
    } else if (!open) {
      setOriginalData(null);
      drawerOpenedRef.current = false;
    }
  }, [open, data]);

  // Memoize the check changes function to avoid recreating it on every render
  const checkChanges = useCallback(() => {
    try {
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return onClose();
      }

      if (!originalData) {
        return onClose();
      }

      let hasChanges = false;
      try {
        const dataStr = JSON.stringify(data);
        const originalDataStr = JSON.stringify(originalData);
        hasChanges = dataStr !== originalDataStr;
      } catch (e) {
        hasChanges = data !== originalData;
      }

      if (hasChanges) {
        setConfirmDialogOpen(true);
        onClose();
      } else {
        onClose();
      }
    } catch (error) {
      onClose();
    }
  }, [data, originalData, onClose]);

  // Use the callback consistently
  const handleClose = useCallback(() => {
    if (data) {
      checkChanges();
    } else {
      onClose();
    }
  }, [data, checkChanges, onClose]);

  // Handle the confirmation of unsaved changes
  const handleConfirmUnsavedChanges = useCallback(() => {
    setConfirmDialogOpen(false);
    onClose();
  }, [onClose]);

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmUnsavedChanges}
        title={t('confirmDialog.title', { ns: 'common' })}
        message={t('confirmDialog.message', { ns: 'common' })}
        confirmText={t('confirmDialog.confirm', { ns: 'common' })}
        cancelText={t('confirmDialog.cancel', { ns: 'common' })}
      />
      
      <Transition appear show={open} as={React.Fragment}>
        <Dialog
          open={open}
          onClose={handleClose}
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
                    'memori-drawer--panel-left': placement === 'left',
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
                        onClick={handleClose}
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
                      <div className="memori-drawer--footer">
                        {footer.leftAction && (
                          <div
                            className={
                              'memori-drawer--footer-left-action ' +
                              (footer.leftActionClassName || '')
                            }
                          >
                            {footer.leftAction}
                          </div>
                        )}
                        {footer.onSubmit && (
                          <div className="memori-drawer--footer-actions">
                            <Button outlined onClick={handleClose}>
                              {t('cancel', { ns: 'common' })}
                            </Button>
                            <Button
                              htmlType="submit"
                              onClick={footer.onSubmit}
                              loading={footer.loading}
                              className="memori-drawer--footer-confirm"
                            >
                              {t('confirm', { ns: 'common' })}
                            </Button>
                          </div>
                        )}
                        {extra && <div className="memori-drawer--extra">{extra}</div>}
                      </div>
                    )}
                  </Spin>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Drawer;