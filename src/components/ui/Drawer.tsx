import React, {
  FC,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
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
  confirmDialogTitle?: string;
  confirmDialogMessage?: string;
  showBackdrop?: boolean;
}

const Drawer: FC<Props> = ({
  title,
  open = false,
  data,
  onClose = () => {},
  children,
  width = '80%',
  footer,
  showBackdrop = true,
  extra,
  className,
  placement = 'right',
  description,
  loading = false,
  animated = true,
  closable = true,
  widthMd = '80%',
  widthLg = '60%',
  confirmDialogTitle,
  confirmDialogMessage,
}: Props) => {
  const [originalData, setOriginalData] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { t } = useTranslation();

  // Set original data when drawer opens and data is available
  useEffect(() => {
    if (open && data && !originalData) {
      setOriginalData(data);
    }

    // Reset original data when drawer closes
    if (!open) {
      setOriginalData(null);
    }
  }, [open, data, originalData]);

  // Check if data has changed
  const checkChanges = useCallback(() => {
    if (!data || Object.keys(data).length === 0) {
      return onClose();
    }

    // Compare current data with original data
    if (originalData && JSON.stringify(originalData) !== JSON.stringify(data)) {
      setConfirmDialogOpen(true);
    } else {
      onClose();
    }
  }, [data, originalData, onClose]);

  // Handle drawer close
  const handleClose = useCallback(() => {
    checkChanges();
  }, [checkChanges]);

  // Confirm unsaved changes
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
        title={confirmDialogTitle || t('confirmDialog.title')}
        message={confirmDialogMessage || t('confirmDialog.message')}
        confirmText={t('confirm') || 'Confirm'}
        cancelText={t('cancel') || 'Cancel'}
      />

      <Transition appear show={open} as={React.Fragment}>
        <Dialog
          open={open}
          onClose={handleClose}
          className={cx('memori-drawer', className)}
        >
          {showBackdrop && (
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
          )}
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
                  style={
                    {
                      '--memori-drawer--width': width,
                      '--memori-drawer--width--lg': widthLg,
                      '--memori-drawer--width--md': widthMd,
                    } as React.CSSProperties
                  }
                >
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
                            {t('cancel')}
                          </Button>
                          <Button
                            htmlType="submit"
                            onClick={footer.onSubmit}
                            loading={footer.loading}
                            className="memori-drawer--footer-confirm"
                          >
                            {t('confirm')}
                          </Button>
                        </div>
                      )}
                      {extra && (
                        <div className="memori-drawer--extra">{extra}</div>
                      )}
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

Drawer.displayName = 'Drawer';

export default Drawer;
