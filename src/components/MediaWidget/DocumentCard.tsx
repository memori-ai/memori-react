import React from 'react';
import cx from 'classnames';
import type { DocumentCardProps } from './MediaItemWidget.types';

export function DocumentCard({
  title,
  badge,
  meta,
  icon,
}: DocumentCardProps): React.ReactElement {
  const badgeKey = badge?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '') || 'file';

  return (
    <div className="memori-media-item--document">
      <div className="memori-media-item--document-header">
        <div
          className={cx(
            'memori-media-item--document-icon',
            `memori-media-item--document-icon--${badgeKey}`
          )}
          aria-hidden
        >
          {badge?.trim() ? badge : icon}
        </div>
        <div className="memori-media-item--document-body">
          <div className="memori-media-item--document-title">{title}</div>
          {meta ? (
            <div className="memori-media-item--document-meta">{meta}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
