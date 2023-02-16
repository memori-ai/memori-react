import React from 'react';

export interface Props {
  avatar?: string;
}

const ExperienceBlob = ({ avatar }: Props) => {
  return (
    <div className="memori-blob">
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
