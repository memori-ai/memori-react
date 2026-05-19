import React, { useCallback, useEffect, useState, useMemo } from 'react';
import cx from 'classnames';
import {
  Memori,
  Message,
  Tenant,
  Venue,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import {
  Button,
  Popover,
  Tooltip,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import {
  VolumeX,
  Volume2,
  Settings,
  Minimize,
  Maximize,
  MoreVertical,
  RefreshCw,
  X,
  Brain,
  MapPin,
  ChevronDown,
  ChevronRight,
  Users,
  User as UserIcon,
  MessageCircle,
  LogOut,
  Trash2,
  Camera,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ShareButton from '../ShareButton/ShareButton';
import PositionPopover from '../PositionPopover/PositionPopover';
import GasStation from '../icons/GasStation';
import { getErrori18nKey } from '../../helpers/error';
import memoriApiClient from '@memori.ai/memori-api-client';
import { Props as WidgetProps } from '../MemoriWidget/MemoriWidget';
import { BADGE_EMOJI } from '../../helpers/llmUsage';
import ChatConsumptionDropdown from './ChatConsumptionDropdown';
import { imgMimeTypes } from '../../helpers/utils';
import { getResourceUrl } from '../../helpers/media';

export interface Props {
  className?: string;
  /** Variant applied to all header buttons (including share + user/login). */
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  memori: Memori;
  tenant?: Tenant;
  history: Message[];
  position?: Venue;
  setVenue: (venue?: Venue) => void;
  positionPopoverOpen: boolean;
  setPositionPopoverOpen: (open: boolean) => void;
  setShowSettingsDrawer: (show: boolean) => void;
  setShowChatHistoryDrawer: (show: boolean) => void;
  setShowKnownFactsDrawer: (show: boolean) => void;
  setShowExpertsDrawer: (show: boolean) => void;
  enableAudio?: boolean;
  speakerMuted: boolean;
  setSpeakerMuted: (mute: boolean) => void;
  hasUserActivatedSpeak?: boolean;
  showShare?: boolean;
  showSettings?: boolean;
  showChatHistory?: boolean;
  showReload?: boolean;
  showClear?: boolean;
  showLogin?: boolean;
  setShowLoginDrawer: (show: boolean) => void;
  clearHistory: () => void;
  loginToken?: string;
  user?: User;
  sessionID?: string;
  baseUrl?: string;
  fullScreenHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLogout?: () => void;
  apiClient: ReturnType<typeof memoriApiClient>;
  layout?: WidgetProps['layout'];
  additionalSettings?: WidgetProps['additionalSettings'];
  showMessageConsumption?: boolean;
  showFullscreen?: boolean;
  extraActions?: React.ReactNode;
}

const Header: React.FC<Props> = ({
  className,
  buttonVariant = 'ghost',
  memori,
  tenant,
  history,
  position,
  setVenue,
  positionPopoverOpen,
  setPositionPopoverOpen,
  setShowSettingsDrawer,
  setShowChatHistoryDrawer,
  setShowKnownFactsDrawer,
  setShowExpertsDrawer,
  enableAudio = true,
  speakerMuted,
  setSpeakerMuted,
  hasUserActivatedSpeak = false,
  showShare = true,
  showSettings = true,
  showReload = false,
  showClear = false,
  showLogin = true,
  setShowLoginDrawer,
  clearHistory,
  loginToken,
  user,
  sessionID,
  showChatHistory = true,
  fullScreenHandler,
  baseUrl,
  onLogout,
  apiClient,
  layout,
  additionalSettings,
  showMessageConsumption = false,
  showFullscreen = true,
  extraActions,
}) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const { uploadAsset, pwlUpdateUser } = apiClient.backend;
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);

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

  const currentLocale = i18n.language || navigator.language || 'en';
  const chatLog = useMemo(() => ({ lines: history }), [history]);
  const sustainabilityTotals = useMemo(() => {
    const totals = { energy: 0, gwp: 0, wcf: 0 };
    (chatLog?.lines ?? []).forEach(line => {
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
  }, [chatLog]);
  const hasSustainabilityData = useMemo(
    () =>
      (chatLog?.lines ?? []).some(
        line =>
          !!(
            line as Message & {
              llmUsage?: { energyImpact?: LlmUsageEnergyImpact };
            }
          ).llmUsage?.energyImpact
      ),
    [chatLog]
  );
  const hasChatConsumptionData = useMemo(
    () =>
      (chatLog?.lines ?? []).some(
        line =>
          !!(
            line as Message & {
              llmUsage?: {
                provider?: string;
                model?: string;
                totalInputTokens?: number;
                outputTokens?: number;
                energyImpact?: LlmUsageEnergyImpact;
              };
            }
          ).llmUsage
      ),
    [chatLog]
  );
  useEffect(() => {
    if (document.fullscreenEnabled) {
      setFullScreenAvailable(true);
    }
  }, []);

  // Keep local state in sync with ESC / external fullscreen exits,
  // and restore any temporary inline background override.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setFullScreen(isFs);

      if (!isFs) {
        const memoriWidget = document.querySelector(
          '.memori-widget'
        ) as HTMLElement | null;
        if (memoriWidget?.dataset?.memoriPrevBgColor !== undefined) {
          memoriWidget.style.backgroundColor =
            memoriWidget.dataset.memoriPrevBgColor;
          delete memoriWidget.dataset.memoriPrevBgColor;
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const [showFullpageDividers, setShowFullpageDividers] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return !window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setShowFullpageDividers(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Helper function to determine if settings drawer has content
  const hasSettingsContent = useCallback(
    (
      layout?: WidgetProps['layout'],
      additionalSettings?: WidgetProps['additionalSettings']
    ): boolean => {
      return (
        layout === 'TOTEM' ||
        (additionalSettings && Object.keys(additionalSettings).length > 0) ||
        false
      );
    },
    [layout, additionalSettings]
  );

  const updateAvatar = async (avatar: any) => {
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
              userID: user?.userID,
              avatarURL: avatarAsset.assetURL,
            };

            const { user: patchedUser, ...updateResp } = await pwlUpdateUser(
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

  const isFullPageChrome = layout === 'FULLPAGE' || layout === 'CHAT';
  const showFullpageChromeDividers = layout !== 'CHAT' && showFullpageDividers;
  const fullpageGuestChrome = layout === 'FULLPAGE' && !loginToken;
  const chatHistoryButtonLabel =
    layout === 'TOTEM'
      ? undefined
      : layout === 'FULLPAGE' ||
        layout === 'CHAT' ||
        layout === 'HIDDEN_CHAT'
      ? t('widget.headerHistory') || t('write_and_speak.chatHistory')
      : t('write_and_speak.chatHistory');
  const fullpageHeaderProfileLabel =
    t('widget.headerProfile') || t('login.user') || 'Profile';
  const fullpageHeaderLoginLabel =
    t('widget.headerLogin') || t('login.login') || 'Login';
  const isAuthenticated = !!loginToken && !!user;
  const isConversationStarted = Boolean(sessionID && hasUserActivatedSpeak);

  const brandAvatarSrc = useMemo(() => {
    if (!isFullPageChrome || !memori) return undefined;

    if (memori.avatarURL && memori.avatarURL.length > 0) {
      return getResourceUrl({
        type: 'avatar',
        tenantID: tenant?.name,
        resourceURI: memori.avatarURL,
        baseURL: baseUrl,
        apiURL: '',
      });
    }

    return getResourceUrl({
      type: 'avatar',
      tenantID: tenant?.name,
      baseURL: baseUrl,
      apiURL: '',
    });
  }, [isFullPageChrome, memori, tenant, baseUrl]);

  const fullpagePrimaryHasContent =
    (showChatHistory && !!loginToken) || showLogin;

  const fullpageSecondaryHasContent =
    !!memori.needsPosition ||
    showReload ||
    showClear ||
    showMessageConsumption ||
    (showFullscreen && fullScreenAvailable) ||
    (memori.enableDeepThought &&
      !!loginToken &&
      !!user?.pAndCUAccepted &&
      hasUserActivatedSpeak &&
      !!sessionID) ||
    !!memori.enableBoardOfExperts ||
    enableAudio ||
    !!(showSettings && hasSettingsContent(layout, additionalSettings)) ||
    showShare;

  const chatHistoryNode = showChatHistory && !!loginToken && (
    <Tooltip
      title={t('write_and_speak.chatHistory') || 'Chat history'}
      placement="bottom"
    >
      <span style={{ display: 'inline-flex' }}>
        <Button
          variant={buttonVariant}
          className="memori-header--chat-history-button"
          disabled={!loginToken}
          aria-label={t('write_and_speak.chatHistory') || 'Chat history'}
          icon={<MessageCircle />}
          onClick={() => setShowChatHistoryDrawer(true)}
        >
          {chatHistoryButtonLabel}
        </Button>
      </span>
    </Tooltip>
  );

  const loginNode = showLogin && (
    <>
      {loginToken && user ? (
        <Popover
          className="memori-header--dropdown"
          open={userPopoverOpen}
          onOpenChange={open => {
            setUserPopoverOpen(open);
            if (open) {
              setInfoPopoverOpen(false);
              setPositionPopoverOpen(false);
            }
          }}
          placement="bottom-end"
          sideOffset={8}
          closable={false}
          contentClassName="memori-dropdown--menu"
          slotProps={{
            trigger: {
              className: cx(
                'memori-dropdown--user-trigger',
                isFullPageChrome && 'memori-dropdown--user-trigger--fullpage'
              ),
              render: (props: React.ComponentProps<typeof Button>) => (
                <Tooltip title={t('login.user') || 'User'} placement="bottom">
                  <span style={{ display: 'inline-flex' }}>
                    <Button
                      {...props}
                      variant={buttonVariant}
                      className={cx(
                        'memori-dropdown--user-trigger-button',
                        isFullPageChrome &&
                          'memori-header--fullpage-labeled-trigger',
                        userPopoverOpen && 'memori-button--active'
                      )}
                      aria-label={t('login.user') || 'User'}
                      icon={<UserIcon />}
                    >
                      {isFullPageChrome ? fullpageHeaderProfileLabel : null}
                    </Button>
                  </span>
                </Tooltip>
              ),
            },
          }}
          content={
            <div className="memori-dropdown--content">
              <div className="memori-dropdown--user-item">
                <div className="memori-dropdown--user-info">
                  <div className="memori-dropdown--avatar-wrap">
                    {user.avatarURL ? (
                      <>
                        <img
                          src={user.avatarURL}
                          alt={user.userName || user.eMail}
                          className="memori-dropdown--avatar"
                        />
                        <span className="memori-dropdown--avatar-overlay" aria-hidden>
                          <Camera size={20} strokeWidth={2} />
                        </span>
                        <label htmlFor="avatar" className="sr-only">
                          {t('login.avatarChange')}
                        </label>
                        <input
                          type="file"
                          name="avatar"
                          id="avatar"
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
                            {(user.userName || user.eMail || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <span className="memori-dropdown--avatar-overlay" aria-hidden>
                            <Camera size={20} strokeWidth={2} />
                          </span>
                          <label htmlFor="avatar" className="sr-only">
                            {t('login.avatarChange')}
                          </label>
                          <input
                            type="file"
                            name="avatar"
                            id="avatar"
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
                    <h3 className="memori-dropdown--user-name">
                      {user.userName || t('login.welcomeUser')}
                    </h3>
                    <p className="memori-dropdown--user-email">{user.eMail}</p>
                    <div className="memori-dropdown--user-badge">
                      {user.birthDate
                        ? new Date(user.birthDate).toLocaleDateString()
                        : t('login.notSet')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="memori-dropdown--separator" />
              <Button
                type="button"
                variant={buttonVariant}
                onClick={onLogout}
                className="memori-dropdown--action-button memori-dropdown--action-button--logout"
                icon={<LogOut size={18} strokeWidth={2} aria-hidden />}
              >
                {t('login.logout') || 'Logout'}
              </Button>
            </div>
          }
        >
          {null}
        </Popover>
      ) : (
        <Tooltip title={t('login.login') || 'Login'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              className="memori-header--button memori-header--button-login"
              icon={<UserIcon />}
              aria-label={t('login.login') || 'Login'}
              onClick={() => setShowLoginDrawer(true)}
            >
              {isFullPageChrome ? fullpageHeaderLoginLabel : null}
            </Button>
          </span>
        </Tooltip>
      )}
    </>
  );

  const headerActionsBeforeChatHistory = (
    <>
      {memori.needsPosition && (
        <div className="memori-header--position">
          <Tooltip
            title={t('widget.position') || 'Position'}
            placement="bottom"
          >
            <span style={{ display: 'inline-flex' }}>
              <PositionPopover
                venue={position}
                setVenue={setVenue}
                open={positionPopoverOpen}
                onOpenChange={open => {
                  setPositionPopoverOpen(open);
                  if (open) {
                    setInfoPopoverOpen(false);
                    setUserPopoverOpen(false);
                  }
                }}
                triggerButtonVariant={buttonVariant}
                triggerAriaLabel={t('widget.position') || 'Position'}
                positionerClassName={
                  layout === 'WEBSITE_ASSISTANT'
                    ? 'memori-position-popover__positioner--website-assistant'
                    : undefined
                }
              />
            </span>
          </Tooltip>
        </div>
      )}
      {showReload && (
        <Tooltip title={t('reload') || 'Reload'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              aria-label={t('reload') || 'Reload'}
              icon={<RefreshCw />}
              onClick={() => {
                window.location.reload();
              }}
            />
          </span>
        </Tooltip>
      )}
      {showClear && (
        <Tooltip title={t('clearHistory') || 'Clear chat'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              aria-label={t('clearHistory') || 'Clear chat'}
              icon={<Trash2 />}
              onClick={() => {
                clearHistory();
                add(
                  createAlertOptions({
                    description: t('clearHistoryDone'),
                    severity: 'success',
                  })
                );
              }}
            />
          </span>
        </Tooltip>
      )}
    </>
  );

  const headerActionsAfterChatHistory = (
    <>
      {showMessageConsumption && (
        <ChatConsumptionDropdown
          history={history}
          triggerVariant={buttonVariant}
        />
      )}
      {showFullscreen && fullScreenAvailable && (
        <Tooltip
          title={
            fullScreen
              ? t('fullscreenExit') || 'Exit fullscreen'
              : t('fullscreenEnter') || 'Enter fullscreen'
          }
          placement="bottom"
        >
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              aria-label={
                fullScreen
                  ? t('fullscreenExit') || 'Exit fullscreen'
                  : t('fullscreenEnter') || 'Enter fullscreen'
              }
              icon={fullScreen ? <Maximize /> : <Minimize />}
              onClick={
                fullScreenHandler ||
                (() => {
                  if (!document.fullscreenElement) {
                    const body =
                      layout !== 'HIDDEN_CHAT' && layout !== 'WEBSITE_ASSISTANT'
                        ? document.body
                        : document.querySelector('.memori-widget');
                    if (body) {
                      // Don't force a white background in fullscreen; it breaks dark themes.
                      // If an inline background was previously set, preserve & clear it.
                      const memoriWidget = document.querySelector(
                        '.memori-widget'
                      ) as HTMLElement | null;
                      if (memoriWidget) {
                        if (
                          memoriWidget.dataset.memoriPrevBgColor === undefined
                        )
                          memoriWidget.dataset.memoriPrevBgColor =
                            memoriWidget.style.backgroundColor ?? '';
                        memoriWidget.style.backgroundColor = '';
                      }
                      body
                        .requestFullscreen()
                        .then(() => setFullScreen(true))
                        .catch(err => {
                          console.warn(
                            'Error attempting to enable fullscreen:',
                            err
                          );
                        });
                    }
                  } else {
                    if (document.exitFullscreen) {
                      document
                        .exitFullscreen()
                        .then(() => {
                          setFullScreen(false);
                          const memoriWidget = document.querySelector(
                            '.memori-widget'
                          ) as HTMLElement | null;
                          if (
                            memoriWidget?.dataset?.memoriPrevBgColor !==
                            undefined
                          ) {
                            memoriWidget.style.backgroundColor =
                              memoriWidget.dataset.memoriPrevBgColor;
                            delete memoriWidget.dataset.memoriPrevBgColor;
                          }
                        })
                        .catch(err => {
                          console.warn(
                            'Error attempting to exit fullscreen:',
                            err
                          );
                        });
                    }
                  }
                })
              }
            />
          </span>
        </Tooltip>
      )}
      {memori.enableDeepThought &&
        !!loginToken &&
        user?.pAndCUAccepted &&
        hasUserActivatedSpeak &&
        !!sessionID && (
          <Tooltip
            title={t('knownFacts.title') || 'Known facts'}
            placement="bottom"
          >
            <span style={{ display: 'inline-flex' }}>
              <Button
                variant={buttonVariant}
                icon={<Brain />}
                aria-label={t('knownFacts.title') || 'Known facts'}
                onClick={() => setShowKnownFactsDrawer(true)}
              />
            </span>
          </Tooltip>
        )}
      {memori.enableBoardOfExperts && (
        <Tooltip
          title={t('widget.showExpertsInTheBoard') || 'Experts in this board'}
          placement="bottom"
        >
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              icon={<Users />}
              disabled={!hasUserActivatedSpeak || !sessionID}
              aria-label={
                t('widget.showExpertsInTheBoard') || 'Experts in this board'
              }
              onClick={() => setShowExpertsDrawer(true)}
            />
          </span>
        </Tooltip>
      )}
      {enableAudio && (
        <Tooltip title={t('widget.sound') || 'Sound'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              icon={speakerMuted ? <VolumeX /> : <Volume2 />}
              aria-label={t('widget.sound') || 'Sound'}
              onClick={() => setSpeakerMuted(!speakerMuted)}
            />
          </span>
        </Tooltip>
      )}
      {/* <ExportHistoryButton
        history={history}
        memori={memori}
        className="memori-header--button memori-header--button--export"
        disabled={!hasUserActivatedSpeak || history.length === 0}
      /> */}
      {showSettings && hasSettingsContent(layout, additionalSettings) && (
        <Tooltip title={t('widget.settings') || 'Settings'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              icon={<Settings />}
              aria-label={t('widget.settings') || 'Settings'}
              onClick={() => setShowSettingsDrawer(true)}
            />
          </span>
        </Tooltip>
      )}
      {showShare && (
        <ShareButton
          title={memori.name}
          memori={memori}
          sessionID={sessionID}
          tenant={tenant}
          showQrCode
          align="left"
          baseUrl={baseUrl}
          history={history}
          triggerVariant={buttonVariant}
        />
      )}
    </>
  );

  const sessionInfoConsumptionSubtitle = hasSustainabilityData
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

  const loggedInFullpageRightControls = (
    <div className="memori-header--auth-icon-controls">
      {isConversationStarted && showFullpageDividers && (
        <Popover
          className="memori-header--dropdown"
          open={infoPopoverOpen}
          onOpenChange={open => {
            setInfoPopoverOpen(open);
            if (open) {
              setUserPopoverOpen(false);
              setPositionPopoverOpen(false);
            }
          }}
          placement="bottom-end"
          sideOffset={8}
          closable={false}
          contentClassName="memori-dropdown--menu memori-dropdown--auth-menu"
          slotProps={{
            trigger: {
              render: (props: React.ComponentProps<typeof Button>) => (
                <Tooltip title="Info sessione" placement="bottom">
                  <span style={{ display: 'inline-flex' }}>
                    <Button
                      {...props}
                      variant={buttonVariant}
                      className={cx(
                        'memori-header--auth-icon-button',
                        infoPopoverOpen && 'memori-button--active'
                      )}
                      aria-label="Info sessione"
                      icon={<MoreVertical />}
                    />
                  </span>
                </Tooltip>
              ),
            },
          }}
          content={
            <div className="memori-dropdown--auth-content">
              <button
                type="button"
                className="memori-dropdown--auth-row memori-dropdown--auth-row--navigable"
                onClick={() => {
                  setShowKnownFactsDrawer(true);
                  setInfoPopoverOpen(false);
                }}
              >
                <span className="memori-dropdown--auth-icon-wrap">
                  <Brain size={16} />
                </span>
                <span className="memori-dropdown--auth-copy">
                  <span className="memori-dropdown--auth-title">
                    {t('knownFacts.title') || 'Known facts'}
                  </span>
                  <span className="memori-dropdown--auth-subtitle">
                    {t('widget.knownFactsHint') || 'What I remember about you'}
                  </span>
                </span>
                <ChevronRight size={16} aria-hidden />
              </button>
              {hasChatConsumptionData ? (
                <ChatConsumptionDropdown
                  history={history}
                  triggerVariant={buttonVariant}
                  menuAlign="start"
                  trigger={triggerProps => (
                    <button
                      {...triggerProps}
                      type="button"
                      className={cx(
                        'memori-dropdown--auth-row',
                        'memori-dropdown--auth-row--navigable',
                        triggerProps.className
                      )}
                    >
                      <span className="memori-dropdown--auth-icon-wrap">
                        <GasStation />
                      </span>
                      <span className="memori-dropdown--auth-copy">
                        <span className="memori-dropdown--auth-title">
                          {t('widget.aiConsumption') || 'AI usage'}
                        </span>
                        <span className="memori-dropdown--auth-subtitle">
                          {sessionInfoConsumptionSubtitle}
                        </span>
                      </span>
                      <ChevronDown size={16} aria-hidden />
                    </button>
                  )}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="memori-dropdown--auth-row memori-dropdown--auth-row--navigable memori-dropdown--auth-row--disabled"
                >
                  <span className="memori-dropdown--auth-icon-wrap">
                    <GasStation />
                  </span>
                  <span className="memori-dropdown--auth-copy">
                    <span className="memori-dropdown--auth-title">
                      {t('widget.aiConsumption') || 'AI usage'}
                    </span>
                    <span className="memori-dropdown--auth-subtitle">
                      {sessionInfoConsumptionSubtitle}
                    </span>
                  </span>
                  <ChevronDown size={16} aria-hidden />
                </button>
              )}
            </div>
          }
        >
          {null}
        </Popover>
      )}
      {showFullscreen && fullScreenAvailable && (
        <Tooltip
          title={
            fullScreen
              ? t('fullscreenExit') || 'Exit fullscreen'
              : t('fullscreenEnter') || 'Enter fullscreen'
          }
          placement="bottom"
        >
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              className="memori-header--auth-icon-button"
              aria-label={
                fullScreen
                  ? t('fullscreenExit') || 'Exit fullscreen'
                  : t('fullscreenEnter') || 'Enter fullscreen'
              }
              icon={fullScreen ? <Minimize /> : <Maximize />}
              onClick={
                fullScreenHandler ||
                (() => {
                  if (!document.fullscreenElement) {
                    const body =
                      layout !== 'HIDDEN_CHAT' && layout !== 'WEBSITE_ASSISTANT'
                        ? document.body
                        : document.querySelector('.memori-widget');
                    if (body) {
                      const memoriWidget = document.querySelector(
                        '.memori-widget'
                      ) as HTMLElement | null;
                      if (memoriWidget) {
                        if (
                          memoriWidget.dataset.memoriPrevBgColor === undefined
                        )
                          memoriWidget.dataset.memoriPrevBgColor =
                            memoriWidget.style.backgroundColor ?? '';
                        memoriWidget.style.backgroundColor = '';
                      }
                      body
                        .requestFullscreen()
                        .then(() => setFullScreen(true))
                        .catch(err => {
                          console.warn(
                            'Error attempting to enable fullscreen:',
                            err
                          );
                        });
                    }
                  } else if (document.exitFullscreen) {
                    document
                      .exitFullscreen()
                      .then(() => {
                        setFullScreen(false);
                        const memoriWidget = document.querySelector(
                          '.memori-widget'
                        ) as HTMLElement | null;
                        if (
                          memoriWidget?.dataset?.memoriPrevBgColor !== undefined
                        ) {
                          memoriWidget.style.backgroundColor =
                            memoriWidget.dataset.memoriPrevBgColor;
                          delete memoriWidget.dataset.memoriPrevBgColor;
                        }
                      })
                      .catch(err => {
                        console.warn(
                          'Error attempting to exit fullscreen:',
                          err
                        );
                      });
                  }
                })
              }
            />
          </span>
        </Tooltip>
      )}
      {enableAudio && (
        <Tooltip title={t('widget.sound') || 'Sound'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              className="memori-header--auth-icon-button"
              aria-label={t('widget.sound') || 'Sound'}
              icon={speakerMuted ? <VolumeX /> : <Volume2 />}
              onClick={() => setSpeakerMuted(!speakerMuted)}
            />
          </span>
        </Tooltip>
      )}
      {memori.needsPosition && (
        <Tooltip title={t('widget.position') || 'Position'} placement="bottom">
          <span style={{ display: 'inline-flex' }}>
            <PositionPopover
              venue={position}
              setVenue={setVenue}
              open={positionPopoverOpen}
              onOpenChange={open => {
                setPositionPopoverOpen(open);
                if (open) {
                  setInfoPopoverOpen(false);
                  setUserPopoverOpen(false);
                }
              }}
              triggerButtonVariant={buttonVariant}
              triggerClassName="memori-header--auth-icon-button"
              triggerAriaLabel={t('widget.position') || 'Position'}
              positionerClassName={
                layout === 'WEBSITE_ASSISTANT'
                  ? 'memori-position-popover__positioner--website-assistant'
                  : undefined
              }
            />
          </span>
        </Tooltip>
      )}
      {showShare && (
        <span className="memori-header--auth-share-button-wrap">
          <ShareButton
            title={memori.name}
            memori={memori}
            sessionID={sessionID}
            tenant={tenant}
            showQrCode
            align="left"
            baseUrl={baseUrl}
            history={history}
            triggerVariant={buttonVariant}
            className="memori-header--auth-share-button"
          />
        </span>
      )}
    </div>
  );

  const headerControls = (
    <div
      className={cx(
        'memori-header',
        className,
        isFullPageChrome && 'memori-header--fullpage',
        fullpageGuestChrome && 'memori-header--fullpage-guest'
      )}
    >
      {isFullPageChrome && isAuthenticated ? (
        <>
          {fullpagePrimaryHasContent && (
            <div className="memori-header--fullpage-primary">
              {chatHistoryNode}
            </div>
          )}
          {fullpagePrimaryHasContent &&
            showFullpageChromeDividers &&
            !fullpageGuestChrome && (
              <div
                className="memori-header--fullpage-divider"
                aria-hidden="true"
              />
            )}
          <div className="memori-header--fullpage-secondary">
            {loggedInFullpageRightControls}
            {showFullpageChromeDividers && (
              <div
                className="memori-header--fullpage-divider"
                aria-hidden="true"
              />
            )}
            {loginNode}
          </div>
        </>
      ) : isFullPageChrome ? (
        <>
          {fullpagePrimaryHasContent && (
            <div className="memori-header--fullpage-primary">
              {chatHistoryNode}
              {/* {loginNode} */}
            </div>
          )}

          {fullpagePrimaryHasContent &&
            fullpageSecondaryHasContent &&
            showFullpageChromeDividers &&
            !fullpageGuestChrome && (
              <div
                className="memori-header--fullpage-divider"
                aria-hidden="true"
              />
            )}
          <div className="memori-header--fullpage-secondary">
            {headerActionsBeforeChatHistory}
            {headerActionsAfterChatHistory}
            {fullpagePrimaryHasContent &&
              fullpageSecondaryHasContent &&
              showFullpageChromeDividers && (
                <div
                  className="memori-header--fullpage-divider"
                  aria-hidden="true"
                />
              )}
            {loginNode}
          </div>
        </>
      ) : (
        <>
          {headerActionsBeforeChatHistory}
          {chatHistoryNode}
          {headerActionsAfterChatHistory}
          {loginNode}
        </>
      )}
      {extraActions}
    </div>
  );

  if (!isFullPageChrome) {
    return headerControls;
  }

  return (
    <>
      {memori && (
        <div className="memori-fullpage-header-brand">
          {brandAvatarSrc ? (
            <img
              className="memori-fullpage-header-brand-icon memori-fullpage-header-brand-icon--avatar"
              src={brandAvatarSrc}
              alt=""
              role="presentation"
            />
          ) : (
            <span
              className="memori-fullpage-header-brand-icon"
              aria-hidden
            />
          )}
          {isConversationStarted && (
            <span
              className="memori-fullpage-header-brand-name"
              title={memori.name}
            >
              {memori.name}
            </span>
          )}
        </div>
      )}
      <div className="memori-fullpage-header-actions">{headerControls}</div>
    </>
  );
};

export default Header;
