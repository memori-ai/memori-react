import React, { FC } from 'react';
import cx from 'classnames';
import Spin from './Spin';

export interface Props {
  children?: React.ReactChild;
  loading?: boolean;
  className?: string;
  title?: string;
  description?: string;
  cover?: JSX.Element | React.ReactNode | string;
  hoverable?: boolean;
}

export const Card: FC<Props> = ({
  loading = false,
  className,
  title,
  description,
  cover,
  hoverable = false,
  children,
}) => (
  <div
    className={cx('memori-card', className, {
      'memori-card--loading': loading,
      'memori-card--with-cover': cover,
      'memori-card--hoverable': hoverable,
    })}
  >
    <Spin spinning={loading}>
      {cover && <div className="memori-card--cover">{cover}</div>}
      <div className="memori-card--content">
        {title && <h3 className="memori-card--title">{title}</h3>}
        {description && (
          <p className="memori-card--description">{description}</p>
        )}
        <div className="memori-card--children">{children}</div>
      </div>
    </Spin>
  </div>
);

export interface MetaProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export const Meta: FC<MetaProps> = ({ title, description, className }) => (
  <div className={cx('memori-card--meta', className)}>
    {title && <div className="memori-card--meta-title">{title}</div>}
    {description && <div className="memori-card--meta-description">{description}</div>}
  </div>
);

Meta.displayName = 'Card.Meta';