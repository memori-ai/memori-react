import React, { FC } from 'react';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import Close from '../icons/Close';
import Button from './Button';
import { useTranslation } from 'react-i18next';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export interface Props {
  open?: boolean;
  onClose: (value: boolean) => void;
  className?: string;
  title?: string | JSX.Element | React.ReactNode;
  description?: string | JSX.Element | React.ReactNode;
  children?: JSX.Element | React.ReactNode;
  type?: AlertType;
  icon?: JSX.Element | React.ReactNode;
  closable?: boolean;
  duration?: number | null;
  action?: JSX.Element | React.ReactNode;
  width?: string;
}

const Alert: FC<Props> = ({
  open = false,
  onClose,
  className,
  title,
  description,
  children,
  type = 'info',
  icon,
  closable = true,
  duration = null,
  action,
  width = '400px',
}: Props) => {
  const { t } = useTranslation();

  // Auto-close functionality
  React.useEffect(() => {
    if (duration && open) {
      const timer = setTimeout(() => {
        onClose(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, open, onClose]);

  const getTypeStyles = (type: AlertType) => {
    switch (type) {
      case 'success':
        return 'memori-alert--success';
      case 'warning':
        return 'memori-alert--warning';
      case 'error':
        return 'memori-alert--error';
      default:
        return 'memori-alert--info';
    }
  };

  return (
    <Transition
      show={open}
      as={React.Fragment}
      appear
    >
      <div className={cx('memori-alert', getTypeStyles(type), className)}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .memori-alert {
                --memori-alert--width: ${width};
              }
            `,
          }}
        />
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <div className="memori-alert--container">
            {icon && <div className="memori-alert--icon">{icon}</div>}
            
            <div className="memori-alert--content">
              {title && (
                <div className="memori-alert--title">{title}</div>
              )}
              {description && (
                <div className="memori-alert--description">{description}</div>
              )}
              {children}
            </div>

            <div className="memori-alert--actions">
              {action && <div className="memori-alert--action">{action}</div>}
              {closable && (
                <Button
                  ghost
                  padded
                  shape="circle"
                  icon={<Close />}
                  title={t('close') || 'Close'}
                  onClick={() => onClose(false)}
                  className="memori-alert--close"
                />
              )}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Alert;