import React from 'react';
import Tooltip from '../ui/Tooltip';
import Warning from '../icons/Warning';
import { useTranslation } from 'react-i18next';

export interface Props {
  memoriName: string;
  blockedUntil?: string;
  notEnoughCredits?: boolean;
  showGiverInfo?: boolean;
  showTitle?: boolean;
  marginLeft?: boolean;
}

const BlockedMemoriBadge = ({
  memoriName,
  blockedUntil,
  notEnoughCredits = false,
  showGiverInfo = false,
  showTitle = false,
  marginLeft = false,
}: Props) => {
  const { t } = useTranslation();
  const blockedUntilDate = new Date(blockedUntil || Date.now());

  return notEnoughCredits || blockedUntilDate > new Date(Date.now()) ? (
    <Tooltip
      className="blocked-memori-badge--tooltip"
      content={
        notEnoughCredits ? (
          <>{t('notEnoughCredits')}</>
        ) : (
          <>
            {!showGiverInfo &&
              t('memoriBlockedAnon', {
                name: memoriName,
                date: new Intl.DateTimeFormat('it', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(blockedUntilDate),
              })}
            {showGiverInfo &&
              t('memoriBlockedUntil', {
                date: new Intl.DateTimeFormat('it', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(blockedUntilDate),
              })}
            {showGiverInfo && ` ${t('memoriBlockedReasonExceedChats')}`}
            {showGiverInfo && <br />}
            {showGiverInfo && `\n${t('memoriBlockedGiverHelper')}`}
          </>
        )
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
            {t('memoriBlockedTitle')}
          </span>
        )}
      </div>
    </Tooltip>
  ) : null;
};

export default BlockedMemoriBadge;
