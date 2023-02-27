import React from 'react';
import cx from 'classnames';

export interface Props {
  avatar?: string;
  speaking?: boolean;
}

const ExperienceBlob = ({ avatar, speaking = false }: Props) => {
  return (
    <div className={cx('memori-blob', { 'memori-blob--speaking': speaking })}>
      {avatar && (
        <figure>
          <img src={avatar} alt="" role="presentation" />
        </figure>
      )}
      <div className="mainDiv"></div>
      <div className="mainDiv"></div>
      <div className="mainDiv"></div>
      <div className="mainDiv"></div>
      <div className="mainDiv"></div>
    </div>
  );
};

export default ExperienceBlob;
