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

const Card: FC<Props> = ({
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

export default Card;
