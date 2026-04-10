import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Dropdown,
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
  RefreshCw,
  X,
  Brain,
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

const imgMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

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
}

const Header: React.FC<Props> = ({
  className,
  buttonVariant = 'primary',
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
}) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const { uploadAsset, pwlUpdateUser } = apiClient.backend;
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

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
  useEffect(() => {
    if (document.fullscreenEnabled) {
      setFullScreenAvailable(true);
    }
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

  return (
    <div className={cx('memori-header', className)}>
      {memori.needsPosition && (
        <div className="memori-header--position">
          {position && position.latitude !== 0 && position.longitude !== 0 && (
            <span className="memori-header--position-placeName">
              {position.placeName}
            </span>
          )}
          <Tooltip
            title={t('widget.position') || 'Position'}
            placement="bottom"
          >
            <span style={{ display: 'inline-flex' }}>
              <PositionPopover
                venue={position}
                setVenue={setVenue}
                open={positionPopoverOpen}
                onOpenChange={setPositionPopoverOpen}
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
      {showChatHistory && !!loginToken && (
        <Tooltip
          title={t('write_and_speak.chatHistory') || 'Chat history'}
          placement="bottom"
        >
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              disabled={!loginToken}
              aria-label={t('write_and_speak.chatHistory') || 'Chat history'}
              icon={<MessageCircle />}
              onClick={() => setShowChatHistoryDrawer(true)}
            />
          </span>
        </Tooltip>
      )}
      {showMessageConsumption && hasSustainabilityData && (
        <Dropdown className="memori-header--dropdown">
          <Dropdown.Trigger
            showChevron={false}
            render={
              <Button
                variant={buttonVariant}
                className={cx(
                  'memori-header--button',
                  'memori-header--button--sustainability'
                )}
                title={
                  t('write_and_speak.showMessageConsumptionLabel') ||
                  'LLM consumption'
                }
                icon={
                  <GasStation className="memori-header--button--sustainability-icon" />
                }
              />
            }
          />
          <Dropdown.Menu className="memori-dropdown--menu">
            <div className="memori-dropdown--sustainability">
              <h4 className="memori-dropdown--sustainability-title">
                {t('chatLogs.totalChatConsumptionTitle') ||
                  'Consumo Totale Chat'}
              </h4>
              <div className="memori-dropdown--sustainability-metrics">
                <div className="memori-dropdown--sustainability-row">
                  <span className="memori-dropdown--sustainability-label">
                    <span aria-hidden="true">{BADGE_EMOJI.energy}</span>{' '}
                    {t('chatLogs.energy') || 'Energy'}
                  </span>
                  <strong className="memori-dropdown--sustainability-value">
                    {formatImpactInReadableUnit(
                      sustainabilityTotals.energy,
                      'energy',
                      currentLocale
                    )}
                  </strong>
                </div>
                <div className="memori-dropdown--sustainability-row">
                  <span className="memori-dropdown--sustainability-label">
                    <span aria-hidden="true">{BADGE_EMOJI.co2}</span>{' '}
                    {t('chatLogs.co2') || 'CO2'}
                  </span>
                  <strong className="memori-dropdown--sustainability-value">
                    {formatImpactInReadableUnit(
                      sustainabilityTotals.gwp,
                      'co2',
                      currentLocale
                    )}
                  </strong>
                </div>
                <div className="memori-dropdown--sustainability-row">
                  <span className="memori-dropdown--sustainability-label">
                    <span aria-hidden="true">{BADGE_EMOJI.water}</span>{' '}
                    {t('chatLogs.water') || 'Water'}
                  </span>
                  <strong className="memori-dropdown--sustainability-value">
                    {formatImpactInReadableUnit(
                      sustainabilityTotals.wcf,
                      'water',
                      currentLocale
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {showMessageConsumption && hasSustainabilityData && (
        <Dropdown
          placement="bottom-right"
          trigger={
            <Button
              primary
              shape="circle"
              className={cx('memori-header--button', 'memori-header--button--sustainability', hasSpacedButtons && 'memori-header--button-spaced')}
              title={t('write_and_speak.showMessageConsumptionLabel') || 'LLM consumption'}
              icon={<GasStation className="memori-header--button--sustainability-icon" />}
            />
          }
        >
          <div className="memori-dropdown--sustainability">
            <h4 className="memori-dropdown--sustainability-title">
              {t('chatLogs.totalChatConsumptionTitle') || 'Consumo Totale Chat'}
            </h4>
            <div className="memori-dropdown--sustainability-metrics">
              <div className="memori-dropdown--sustainability-row">
                <span className="memori-dropdown--sustainability-label">
                  <span aria-hidden="true">{BADGE_EMOJI.energy}</span>{' '}
                  {t('chatLogs.energy') || 'Energy'}
                </span>
                <strong className="memori-dropdown--sustainability-value">
                  {formatImpactInReadableUnit(
                    sustainabilityTotals.energy,
                    'energy',
                    currentLocale
                  )}
                </strong>
              </div>
              <div className="memori-dropdown--sustainability-row">
                <span className="memori-dropdown--sustainability-label">
                  <span aria-hidden="true">{BADGE_EMOJI.co2}</span>{' '}
                  {t('chatLogs.co2') || 'CO2'}
                </span>
                <strong className="memori-dropdown--sustainability-value">
                  {formatImpactInReadableUnit(
                    sustainabilityTotals.gwp,
                    'co2',
                    currentLocale
                  )}
                </strong>
              </div>
              <div className="memori-dropdown--sustainability-row">
                <span className="memori-dropdown--sustainability-label">
                  <span aria-hidden="true">{BADGE_EMOJI.water}</span>{' '}
                  {t('chatLogs.water') || 'Water'}
                </span>
                <strong className="memori-dropdown--sustainability-value">
                  {formatImpactInReadableUnit(
                    sustainabilityTotals.wcf,
                    'water',
                    currentLocale
                  )}
                </strong>
              </div>
            </div>
          </div>
        </Dropdown>
      )}
      {fullScreenAvailable && (
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
                      //set the .memori-react div to white backg
                      const memoriReact =
                        document.querySelector('.memori-widget');
                      if (memoriReact) {
                        (memoriReact as HTMLElement).style.backgroundColor =
                          '#FFFFFF';
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
                        .then(() => setFullScreen(false))
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
      {memori.enableDeepThought && !!loginToken && user?.pAndCUAccepted && (
        <Tooltip
          title={t('knownFacts.title') || 'Known facts'}
          placement="bottom"
        >
          <span style={{ display: 'inline-flex' }}>
            <Button
              variant={buttonVariant}
              icon={<Brain />}
              disabled={!hasUserActivatedSpeak || !sessionID}
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
          primary={buttonVariant === 'primary'}
        />
      )}
      {showLogin && (
        <>
          {loginToken && user ? (
            <Dropdown className="memori-header--dropdown">
              <Dropdown.Trigger
                showChevron={false}
                className="memori-dropdown--user-trigger"
                render={(
                  props: React.ButtonHTMLAttributes<HTMLButtonElement>
                ) => (
                  <Tooltip title={t('login.user') || 'User'} placement="bottom">
                    <span style={{ display: 'inline-flex' }}>
                      <Button
                        {...props}
                        variant={buttonVariant}
                        aria-label={t('login.user') || 'User'}
                        icon={<UserIcon />}
                      />
                    </span>
                  </Tooltip>
                )}
              />
              <Dropdown.Menu className="memori-dropdown--menu">
                <Dropdown.Item className="memori-dropdown--user-item">
                  <div className="memori-dropdown--user-info">
                    <div className="memori-dropdown--avatar-wrap">
                      {user.avatarURL ? (
                        <>
                          <img
                            src={user.avatarURL}
                            alt={user.userName || user.eMail}
                            className="memori-dropdown--avatar"
                          />
                          <span className="memori-dropdown--avatar-overlay">
                            <Camera size={20} strokeWidth={2} />
                          </span>
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
                            <span className="memori-dropdown--avatar-overlay">
                              <Camera size={20} strokeWidth={2} />
                            </span>
                            <input
                              type="file"
                              name="avatar"
                              id="avatar"
                              className="memori-dropdown--avatar-input"
                              onChange={e =>
                                updateAvatar(
                                  e.target.files?.[0] ??
                                    (null as unknown as Blob)
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
                      <p className="memori-dropdown--user-email">
                        {user.eMail}
                      </p>
                      <div className="memori-dropdown--user-badge">
                        {user.birthDate
                          ? new Date(user.birthDate).toLocaleDateString()
                          : t('login.notSet')}
                      </div>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Separator className="memori-dropdown--separator" />
                <Dropdown.Item
                  onClick={onLogout}
                  className="memori-dropdown--action-button memori-dropdown--action-button--logout"
                  {...({
                    icon: <LogOut size={18} strokeWidth={2} />,
                  } as React.ComponentProps<typeof Dropdown.Item>)}
                >
                  {t('login.logout') || 'Logout'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Tooltip title={t('login.login') || 'Login'} placement="bottom">
              <span style={{ display: 'inline-flex' }}>
                <Button
                  variant={buttonVariant}
                  className="memori-header--button memori-header--button-login"
                  icon={<UserIcon />}
                  aria-label={t('login.login') || 'Login'}
                  onClick={() => setShowLoginDrawer(true)}
                />
              </span>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
