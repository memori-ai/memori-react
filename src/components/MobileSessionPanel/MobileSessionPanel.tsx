import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Brain,
  Camera,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Button, createAlertOptions, useAlertManager } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import { Message, User, Venue } from '@memori.ai/memori-api-client/dist/types';
import { getErrori18nKey } from '../../helpers/error';
import { imgMimeTypes } from '../../helpers/utils';
import GasStation from '../icons/GasStation';
import { ChatConsumptionContent } from '../Header/ChatConsumptionDropdown';
import { PositionPopoverContent } from '../PositionPopover/PositionPopover';
type SessionAction = {
  key: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  view?: 'location' | 'knownFacts' | 'share';
  disabled?: boolean;
};

export interface MobileSessionPanelProps {
  open: boolean;
  onClose: () => void;
  presentation?: 'sheet' | 'popover';
  title: string;
  loginToken?: string;
  userName: string;
  userInitial?: string;
  user?: User;
  apiClient?: {
    backend?: {
      uploadAsset?: (
        name: string,
        payload: string,
        token: string
      ) => Promise<any>;
      pwlUpdateUser?: (
        token: string,
        userID: string,
        user: Partial<User>
      ) => Promise<any>;
    };
  };
  userEmail?: string;
  birthDate?: string;
  avatarURL?: string;
  actions: SessionAction[];
  logoutLabel?: string;
  onLogout?: () => void;
  onKnownFactsOpen?: () => void;
  onLocationEnable?: () => void;
  onLocationDisable?: () => void;
  knownFactsPageTitle?: string;
  sharePageTitle?: string;
  locationPageTitle?: string;
  backLabel?: string;
  locationStatusLabel?: string;
  locationPlace?: string;
  locationUnknownLabel?: string;
  locationEnableLabel?: string;
  locationDisableLabel?: string;
  venue?: Venue;
  setVenue?: (venue?: Venue) => void;
  knownFactsDescription?: string;
  knownFactsCtaLabel?: string;
  knownFactsCountLabel?: string;
  shareContent?: React.ReactNode;
  knownFactsDisabled?: boolean;
  knownFactsHint?: string;
  showSessionInfo?: boolean;
  history?: Message[];
  aiUsageTitle?: string;
  isLoggedIn?: boolean;
  loginLabel?: string;
  onLogin?: () => void;
}

type ImpactMetricType = 'energy' | 'co2' | 'water';

type LlmUsageEnergyImpact = {
  energy?: number | { source?: string; parsedValue?: number };
  gwp?: number | { source?: string; parsedValue?: number };
  wcf?: number | { source?: string; parsedValue?: number };
};

const getMetricValue = (
  metric?: number | { source?: string; parsedValue?: number }
): number | undefined => {
  if (typeof metric === 'number' && Number.isFinite(metric)) return metric;
  if (!metric || typeof metric !== 'object') return undefined;
  if (
    typeof metric.parsedValue === 'number' &&
    Number.isFinite(metric.parsedValue)
  ) {
    return metric.parsedValue;
  }
  if (typeof metric.source === 'string') {
    const parsed = Number(metric.source);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const formatMetricValue = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(value) >= 1 ? 3 : 4,
  }).format(value);

const formatImpactInReadableUnit = (
  value: number,
  metricType: ImpactMetricType,
  locale: string
): string => {
  const absValue = Math.abs(value);

  if (metricType === 'energy') {
    if (absValue >= 1) return `${formatMetricValue(value, locale)} kWh`;
    const wh = value * 1000;
    if (Math.abs(wh) >= 1) return `${formatMetricValue(wh, locale)} Wh`;
    return `${formatMetricValue(wh * 1000, locale)} mWh`;
  }

  if (metricType === 'co2') {
    if (absValue >= 1) return `${formatMetricValue(value, locale)} kg`;
    const g = value * 1000;
    if (Math.abs(g) >= 1) return `${formatMetricValue(g, locale)} g`;
    return `${formatMetricValue(g * 1000, locale)} mg`;
  }

  if (absValue >= 1) return `${formatMetricValue(value, locale)} L`;
  const ml = value * 1000;
  if (Math.abs(ml) >= 1) return `${formatMetricValue(ml, locale)} mL`;
  return `${formatMetricValue(ml * 1000, locale)} μL`;
};

const MobileSessionPanel: React.FC<MobileSessionPanelProps> = ({
  open,
  onClose,
  presentation = 'sheet',
  title,
  loginToken,
  userName,
  user,
  apiClient,
  userEmail,
  birthDate,
  avatarURL,
  actions,
  logoutLabel = 'Log out',
  onLogout,
  onKnownFactsOpen,
  onLocationEnable,
  onLocationDisable,
  knownFactsPageTitle = 'Known facts',
  sharePageTitle = 'Share',
  locationPageTitle = 'Location tracking',
  backLabel = 'Back',
  locationStatusLabel = 'Status',
  locationPlace,
  locationUnknownLabel = 'Unknown position',
  locationEnableLabel = 'Use current position',
  locationDisableLabel = 'Disable location sharing',
  knownFactsDescription,
  knownFactsCtaLabel = 'Open full known facts',
  knownFactsCountLabel,
  shareContent,
  knownFactsDisabled = false,
  knownFactsHint,
  showSessionInfo = false,
  history = [],
  aiUsageTitle,
  isLoggedIn = false,
  loginLabel = 'Log in',
  onLogin,
  venue,
  setVenue,
}) => {
  const panelRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelTitleId = 'mobile-session-panel-title';
  const touchStartYRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [activeView, setActiveView] = useState<
    'session' | 'location' | 'knownFacts' | 'share' | 'aiUsage'
  >('session');
  const { uploadAsset, pwlUpdateUser } = apiClient?.backend || {};
  const { add } = useAlertManager();
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language || navigator.language || 'en';
  const sustainabilityTotals = useMemo(() => {
    const totals = { energy: 0, gwp: 0, wcf: 0 };
    history.forEach(line => {
      const energyImpact = (
        line as Message & {
          llmUsage?: { energyImpact?: LlmUsageEnergyImpact };
        }
      ).llmUsage?.energyImpact;
      if (!energyImpact) return;
      totals.energy += getMetricValue(energyImpact.energy) ?? 0;
      totals.gwp += getMetricValue(energyImpact.gwp) ?? 0;
      totals.wcf += getMetricValue(energyImpact.wcf) ?? 0;
    });
    return totals;
  }, [history]);
  const hasSustainabilityData = useMemo(
    () =>
      history.some(
        line =>
          !!(
            line as Message & {
              llmUsage?: { energyImpact?: LlmUsageEnergyImpact };
            }
          ).llmUsage?.energyImpact
      ),
    [history]
  );
  const hasChatConsumptionData = useMemo(
    () =>
      history.some(
        line =>
          !!(
            line as Message & {
              llmUsage?: {
                energyImpact?: LlmUsageEnergyImpact;
              };
            }
          ).llmUsage
      ),
    [history]
  );
  const aiUsageSubtitle = hasSustainabilityData
    ? `${formatImpactInReadableUnit(
        sustainabilityTotals.energy,
        'energy',
        currentLocale
      )} • ${formatImpactInReadableUnit(
        sustainabilityTotals.gwp,
        'co2',
        currentLocale
      )}`
    : t('widget.noData', { defaultValue: 'Nessun dato disponibile' });
  const resolvedKnownFactsHint =
    knownFactsHint || t('widget.knownFactsHint') || 'What I remember about you';
  const resolvedAiUsageTitle =
    aiUsageTitle || t('widget.aiConsumption') || 'AI usage';
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    if (!root) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open) setActiveView('session');
  }, [open]);

  if (!open) return null;

  const updateAvatar = async (avatar: any) => {
    if (!uploadAsset || !pwlUpdateUser) {
      add(
        createAlertOptions({
          description: t('login.avatarUploadError'),
          severity: 'error',
        })
      );
      return;
    }
    if (avatar && loginToken) {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const { asset: avatarAsset, ...resp } = await uploadAsset(
            avatar.name ?? 'avatar',
            e.target?.result as string,
            loginToken ?? ''
          );

          if (resp.resultCode !== 0) {
            console.error('[updateAvatar] Upload failed:', resp);
            add(
              createAlertOptions({
                description: t(getErrori18nKey(resp.resultCode)),
                severity: 'error',
              })
            );
          } else if (avatarAsset) {
            let newUser: Partial<User> = {
              userID: user?.userID ?? '',
              avatarURL: avatarAsset.assetURL,
            };

            const { ...updateResp } = await pwlUpdateUser(
              loginToken ?? '',
              user?.userID ?? '',
              newUser
            );

            if (updateResp.resultCode !== 0) {
              add(
                createAlertOptions({
                  description: t(getErrori18nKey(updateResp.resultCode)),
                  severity: 'error',
                })
              );
            } else {
              add(
                createAlertOptions({
                  description: t('login.avatarUploadSuccess'),
                  severity: 'success',
                })
              );
            }
          }
        } catch (e) {
          let err = e as Error;
          console.error('[updateAvatar] Error:', err);

          if (err?.message)
            add(
              createAlertOptions({
                description: err.message,
                severity: 'error',
              })
            );
        }
      };
      reader.readAsDataURL(avatar as Blob);
    } else {
      console.error('[updateAvatar] Missing avatar or login token', {
        avatar,
        loginToken,
      });
      add(
        createAlertOptions({
          description: t('login.avatarUploadError'),
          severity: 'error',
        })
      );
    }
  };

  const isPopover = presentation === 'popover';
  const isLocationEnabled = Boolean(
    locationPlace &&
      locationPlace.trim().length > 0 &&
      locationPlace !== locationUnknownLabel
  );
  const visibleActions = actions.filter(action => {
    const normalizedKey = action.key.toLowerCase();
    const normalizedTitle = action.title.toLowerCase();
    const isKnownFactsAction = action.view === 'knownFacts';
    const isAudioAction =
      normalizedKey.includes('audio') ||
      normalizedTitle.includes('audio') ||
      normalizedTitle.includes('sound');

    return !isKnownFactsAction && !isAudioAction;
  });

  return (
    <div
      ref={dialogRef}
      className={`memori-mobile-session-panel--overlay ${
        isPopover ? 'memori-mobile-session-panel--overlay-popover' : ''
      }`}
      role="presentation"
    >
      {!isPopover && (
        <button
          type="button"
          className="memori-mobile-session-panel--backdrop"
          aria-label={String(t('close', { defaultValue: 'Close' }))}
          onClick={onClose}
        />
      )}
      <section
        ref={panelRef}
        tabIndex={-1}
        className={`memori-mobile-session-panel ${
          isPopover ? 'memori-mobile-session-panel--popover' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={panelTitleId}
        onClick={event => event.stopPropagation()}
        onTouchStart={
          isPopover
            ? undefined
            : event => {
                touchStartYRef.current = event.touches[0].clientY;
                setDragOffset(0);
              }
        }
        onTouchMove={
          isPopover
            ? undefined
            : event => {
                const delta = event.touches[0].clientY - touchStartYRef.current;
                if (delta > 0) setDragOffset(delta);
              }
        }
        onTouchEnd={
          isPopover
            ? undefined
            : () => {
                if (dragOffset > 90) {
                  onClose();
                }
                setDragOffset(0);
              }
        }
        style={{
          transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
        }}
      >
        {!isPopover && <div className="memori-mobile-session-panel--handle" />}
        {activeView === 'session' ? (
          <>
            {isLoggedIn && (
              <div className="memori-mobile-session-panel--user">
                <div className="memori-dropdown--avatar-wrap">
                  {avatarURL ? (
                    <>
                      <img
                        src={avatarURL}
                        alt={userName || userEmail}
                        className="memori-dropdown--avatar"
                      />
                      <span
                        className="memori-dropdown--avatar-overlay"
                        aria-hidden
                      >
                        <Camera size={20} strokeWidth={2} />
                      </span>
                      <label
                        htmlFor="mobile-session-avatar-upload"
                        className="sr-only"
                      >
                        {t('login.changeAvatar', {
                          defaultValue: 'Change profile picture',
                        })}
                      </label>
                      <input
                        type="file"
                        name="avatar"
                        id="mobile-session-avatar-upload"
                        className="memori-dropdown--avatar-input"
                        onChange={e =>
                          updateAvatar(
                            e.target.files?.[0] ?? (null as unknown as Blob)
                          )
                        }
                        accept={imgMimeTypes.join(', ')}
                      />
                    </>
                  ) : (
                    <>
                      <div className="memori-dropdown--avatar-placeholder">
                        <span className="memori-dropdown--avatar-initial">
                          {(userName || userEmail || 'U')
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <span
                          className="memori-dropdown--avatar-overlay"
                          aria-hidden
                        >
                          <Camera size={20} strokeWidth={2} />
                        </span>
                        <label
                          htmlFor="mobile-session-avatar-upload-placeholder"
                          className="sr-only"
                        >
                          {t('login.changeAvatar', {
                            defaultValue: 'Change profile picture',
                          })}
                        </label>
                        <input
                          type="file"
                          name="avatar"
                          id="mobile-session-avatar-upload-placeholder"
                          className="memori-dropdown--avatar-input"
                          onChange={e =>
                            updateAvatar(
                              e.target.files?.[0] ?? (null as unknown as Blob)
                            )
                          }
                          accept={imgMimeTypes.join(', ')}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="memori-dropdown--user-details">
                  <h3 className="memori-dropdown--user-name">{userName}</h3>
                  <p className="memori-dropdown--user-email">{userEmail}</p>
                  <div className="memori-dropdown--user-badge">
                    {birthDate
                      ? new Date(birthDate).toLocaleDateString()
                      : 'Not set'}
                  </div>
                </div>
              </div>
            )}
            <h2
              id={panelTitleId}
              className="memori-mobile-session-panel--section-title"
            >
              {title}
            </h2>
            {showSessionInfo && (
              <ul className="memori-mobile-session-panel--actions memori-mobile-session-panel--session-info">
                {isLoggedIn && (
                  <li>
                    <Button
                      variant="toolbar"
                      size="sm"
                      className="memori-mobile-session-panel--action"
                      disabled={knownFactsDisabled}
                      onClick={() => {
                        if (knownFactsDisabled) return;
                        onKnownFactsOpen?.();
                      }}
                    >
                      <span className="memori-mobile-session-panel--action-icon">
                        <Brain size={18} />
                      </span>
                      <span className="memori-mobile-session-panel--action-copy">
                        <span className="memori-mobile-session-panel--action-title">
                          {knownFactsPageTitle}
                        </span>
                        <span className="memori-mobile-session-panel--action-subtitle">
                          {resolvedKnownFactsHint}
                        </span>
                      </span>
                      <span className="memori-mobile-session-panel--action-trailing">
                        <ChevronRight size={16} />
                      </span>
                    </Button>
                  </li>
                )}
                <li>
                  <Button
                    variant="toolbar"
                    size="sm"
                    className="memori-mobile-session-panel--action"
                    disabled={!hasChatConsumptionData}
                    onClick={() => {
                      if (!hasChatConsumptionData) return;
                      setActiveView('aiUsage');
                    }}
                  >
                    <span className="memori-mobile-session-panel--action-icon">
                      <GasStation />
                    </span>
                    <span className="memori-mobile-session-panel--action-copy">
                      <span className="memori-mobile-session-panel--action-title">
                        {resolvedAiUsageTitle}
                      </span>
                      <span className="memori-mobile-session-panel--action-subtitle">
                        {aiUsageSubtitle}
                      </span>
                    </span>
                    <span className="memori-mobile-session-panel--action-trailing">
                      <ChevronRight size={16} />
                    </span>
                  </Button>
                </li>
              </ul>
            )}
            <ul className="memori-mobile-session-panel--actions">
              {visibleActions.map(action => (
                <li key={action.key}>
                  {(() => {
                    const isKnownFactsAction = action.view === 'knownFacts';
                    const isShareAction = action.view === 'share';
                    const isActionDisabled =
                      action.disabled || (isKnownFactsAction && !isLoggedIn);

                    return (
                      <Button
                        variant="toolbar"
                        size="sm"
                        className="memori-mobile-session-panel--action"
                        disabled={isActionDisabled}
                        onClick={() => {
                          if (isActionDisabled) return;
                          if (action.view === 'knownFacts') {
                            if (onKnownFactsOpen) {
                              onKnownFactsOpen();
                              return;
                            }
                          }
                          if (action.view) {
                            setActiveView(action.view);
                            return;
                          }
                          action.onClick?.();
                        }}
                      >
                        <span className="memori-mobile-session-panel--action-icon">
                          {action.icon}
                        </span>
                        <span className="memori-mobile-session-panel--action-copy">
                          <span className="memori-mobile-session-panel--action-title">
                            {action.title}
                          </span>
                          {action.subtitle && (
                            <span className="memori-mobile-session-panel--action-subtitle">
                              {action.subtitle}
                            </span>
                          )}
                        </span>
                        {(isShareAction || action.view === 'location') && (
                          <span className="memori-mobile-session-panel--action-trailing">
                            <ChevronRight size={16} />
                          </span>
                        )}
                      </Button>
                    );
                  })()}
                </li>
              ))}
            </ul>
            {isLoggedIn && (
              <Button
                variant="toolbar"
                size="sm"
                shape="default"
                className="memori-mobile-session-panel--logout"
                onClick={onLogout}
              >
                <span className="memori-mobile-session-panel--action-icon">
                  <LogOut size={18} />
                </span>
                <span className="memori-mobile-session-panel--logout-label">
                  {logoutLabel}
                </span>
              </Button>
            )}
            {!isLoggedIn && (
              <div className="memori-mobile-session-panel--login-cta-wrap">
                <Button
                  variant="toolbar"
                  size="sm"
                  className="memori-mobile-session-panel--login-cta"
                  onClick={onLogin}
                >
                  <span className="memori-mobile-session-panel--action-icon">
                    <LogIn size={18} />
                  </span>
                  {loginLabel}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="memori-mobile-session-panel--page">
            <Button
              variant="toolbar"
              size="sm"
              className="memori-mobile-session-panel--back"
              onClick={() => setActiveView('session')}
            >
              <ChevronLeft size={16} />
              {backLabel}
            </Button>
            <h3 className="memori-mobile-session-panel--page-title">
              {activeView === 'location'
                ? locationPageTitle
                : activeView === 'share'
                ? sharePageTitle
                : activeView === 'aiUsage'
                ? resolvedAiUsageTitle
                : knownFactsPageTitle}
            </h3>
            {activeView === 'location' ? (
              <div className="memori-mobile-session-panel--page-content memori-mobile-session-panel--location-content">
                {setVenue ? (
                  <PositionPopoverContent
                    venue={venue}
                    setVenue={setVenue}
                  />
                ) : (
                  <>
                    <p className="memori-mobile-session-panel--meta-label">
                      {locationStatusLabel}
                    </p>
                    <p className="memori-mobile-session-panel--meta-value">
                      {locationPlace || locationUnknownLabel}
                    </p>
                    <div className="memori-mobile-session-panel--page-actions">
                      <Button
                        variant="toolbar"
                        size="sm"
                        className={`memori-mobile-session-panel--page-btn ${
                          isLocationEnabled
                            ? 'memori-mobile-session-panel--page-btn-active'
                            : ''
                        }`}
                        onClick={onLocationEnable}
                      >
                        <span>{locationEnableLabel}</span>
                      </Button>
                      <Button
                        variant="toolbar"
                        size="sm"
                        className="memori-mobile-session-panel--page-btn memori-mobile-session-panel--page-btn-secondary"
                        onClick={onLocationDisable}
                      >
                        {locationDisableLabel}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : activeView === 'share' ? (
              <div className="memori-mobile-session-panel--page-content memori-mobile-session-panel--share-content">
                {shareContent}
              </div>
            ) : activeView === 'aiUsage' ? (
              <div className="memori-mobile-session-panel--page-content memori-mobile-session-panel--ai-usage-content">
                <ChatConsumptionContent
                  history={history}
                  showTitle={false}
                  className="memori-mobile-session-panel--ai-usage"
                />
              </div>
            ) : (
              <div className="memori-mobile-session-panel--page-content">
                {knownFactsDescription && (
                  <p className="memori-mobile-session-panel--known-facts-description">
                    {knownFactsDescription}
                  </p>
                )}
                {knownFactsCountLabel && (
                  <p className="memori-mobile-session-panel--known-facts-count">
                    {knownFactsCountLabel}
                  </p>
                )}
                <Button
                  variant="toolbar"
                  size="sm"
                  className="memori-mobile-session-panel--page-btn"
                  disabled={knownFactsDisabled}
                  onClick={onKnownFactsOpen}
                >
                  {knownFactsCtaLabel}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MobileSessionPanel;
