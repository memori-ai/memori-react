import React, { FC, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Spin from './Spin';
import Button from './Button';
import Close from '../icons/Close';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from './ConfirmDialog';

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
  const { t } = useTranslation();
  
  // Track if the drawer has been opened to handle data initialization correctly
  const drawerOpenedRef = useRef(false);
  
  // Memoize data comparison to avoid unnecessary recalculations
  const dataString = useMemo(() => {
    if (!data) return null;
    try {
      return JSON.stringify(data);
    } catch (e) {
      return null;
    }
  }, [data]);

  // Reset original data when drawer opens
  useEffect(() => {
    if (open && !drawerOpenedRef.current && data) {
      setOriginalData(dataString);
      drawerOpenedRef.current = true;
    } else if (!open) {
      setOriginalData(null);
      drawerOpenedRef.current = false;
    }
  }, [open, dataString]);

  // Memoize the check changes function to avoid recreating it on every render
  const checkChanges = useCallback(() => {
    try {
      if (!data || !originalData) {
        return onClose();
      }

      // Compare strings instead of objects for better performance
      const currentDataString = dataString;
      const hasChanges = currentDataString !== originalData;

      if (hasChanges) {
        setConfirmDialogOpen(true);
      } else {
        onClose();
      }
    } catch (error) {
      onClose();
    }
  }, [data, dataString, originalData, onClose]);

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
        title={t('confirmDialog.title')}
        message={t('confirmDialog.message')}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
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
                        --memori-drawer--width--lg: ${widthLg};
                        --memori-drawer--width--md: ${widthMd};
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
                    <div className="memori-drawer--content">
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
                      <div className="memori-drawer--content--scrollable">
                        {children}
                      </div>
                    </div>
                  </Spin>
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