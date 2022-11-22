import React from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import { useTranslation } from 'react-i18next';

import './BlockedMemoriBadge.css';

export interface Props {
  memoriName: string;
  blockedUntil: string;
  showGiverInfo?: boolean;
  showTitle?: boolean;
  marginLeft?: boolean;
}

const BlockedMemoriBadge = ({
  memoriName,
  blockedUntil,
  showGiverInfo = false,
  showTitle = false,
  marginLeft = false,
}: Props) => {
  const { t } = useTranslation();
  const blockedUntilDate = new Date(blockedUntil);

  return blockedUntilDate > new Date() ? (
    <Tooltip
      className="blocked-memori-badge--tooltip"
      content={
        <>
          {!showGiverInfo &&
            t('memoriBlockedAnon', {
              ns: 'common',
              name: memoriName,
              date: new Intl.DateTimeFormat('it', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(blockedUntilDate),
            })}
          {showGiverInfo &&
            t('memoriBlockedUntil', {
              ns: 'common',
              date: new Intl.DateTimeFormat('it', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(blockedUntilDate),
            })}
          {showGiverInfo &&
            ` ${t('memoriBlockedReasonExceedChats', { ns: 'common' })}`}
          {showGiverInfo && <br />}
          {showGiverInfo &&
            `\n${t('memoriBlockedGiverHelper', { ns: 'common' })}`}
        </>
      }
    >
      <div className="blocked-memori-badge--wrapper">
        <div
          className={`blocked-memori-badge ${marginLeft ? ` margin-left` : ''}`}
        >
          <Warning className="blocked-memori-badge--icon" />
        </div>
        {showTitle && (
          <span className="blocked-memori-badge--title">
            {t('memoriBlockedTitle', { ns: 'common' })}
          </span>
        )}
      </div>
    </Tooltip>
  ) : null;
};

export default BlockedMemoriBadge;
