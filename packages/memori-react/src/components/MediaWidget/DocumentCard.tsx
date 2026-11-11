import React from 'react';
import type { DocumentCardProps } from './MediaItemWidget.types';

export function DocumentCard({
  title,
  badge,
}: DocumentCardProps): React.ReactElement {
  return (
    <div className="memori-media-item--document">
      <div className="memori-media-item--document-header">
        {/* <div className="memori-media-item--document-icon" aria-hidden>
          {icon}
        </div> */}
        <div className="memori-media-item--document-title">{title}</div>
      </div>
      <span className="memori-media-item--document-badge">{badge}</span>
    </div>
  );
}
