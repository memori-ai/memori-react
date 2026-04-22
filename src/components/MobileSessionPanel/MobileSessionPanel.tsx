import React, { useEffect, useRef, useState } from 'react';
import { Camera, LogOut } from 'lucide-react';
import { Button, createAlertOptions, useAlertManager } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import { User } from '@memori.ai/memori-api-client/dist/types';
import './MobileSessionPanel.css';
import { getErrori18nKey } from '../../helpers/error';
import { imgMimeTypes } from '../../helpers/utils';
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
  knownFactsDescription?: string;
  knownFactsCtaLabel?: string;
  knownFactsCountLabel?: string;
  shareContent?: React.ReactNode;
  knownFactsDisabled?: boolean;
  isLoggedIn?: boolean;
  loginLabel?: string;
  onLogin?: () => void;
}

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
  isLoggedIn = false,
  loginLabel = 'Log in',
  onLogin,
}) => {
  const panelRef = useRef<HTMLElement>(null);
  const touchStartYRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [activeView, setActiveView] = useState<
    'session' | 'location' | 'knownFacts' | 'share'
  >('session');
  const { uploadAsset, pwlUpdateUser } = apiClient?.backend || {};
  const { add } = useAlertManager();
  const { t } = useTranslation();
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

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

  return (
    <div
      className={`memori-mobile-session-panel--overlay ${
        isPopover ? 'memori-mobile-session-panel--overlay-popover' : ''
      }`}
      onClick={onClose}
    >
      <section
        ref={panelRef}
        className={`memori-mobile-session-panel ${
          isPopover ? 'memori-mobile-session-panel--popover' : ''
        }`}
        aria-label={title}
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
            <div className="memori-mobile-session-panel--user">
              <div className="memori-dropdown--avatar-wrap">
                {avatarURL ? (
                  <>
                    <img
                      src={avatarURL}
                      alt={userName || userEmail}
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
                        {(userName || userEmail || 'U').charAt(0).toUpperCase()}
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
              {!isLoggedIn && (
                <Button
                  variant="toolbar"
                  size="sm"
                  className="memori-mobile-session-panel--login"
                  onClick={onLogin}
                >
                  {loginLabel}
                </Button>
              )}
            </div>
            <div className="memori-mobile-session-panel--section-title">
              {title}
            </div>
            <ul className="memori-mobile-session-panel--actions">
              {actions.map(action => (
                <li key={action.key}>
                  <Button
                    variant="toolbar"
                    size="sm"
                    className="memori-mobile-session-panel--action"
                    disabled={action.disabled}
                    onClick={() => {
                      if (action.disabled) return;
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
                    {action.trailing && (
                      <span className="memori-mobile-session-panel--action-trailing">
                        {action.trailing}
                      </span>
                    )}
                  </Button>
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
          </>
        ) : (
          <div className="memori-mobile-session-panel--page">
            <Button
              variant="toolbar"
              size="sm"
              className="memori-mobile-session-panel--back"
              onClick={() => setActiveView('session')}
            >
              {backLabel}
            </Button>
            <h3 className="memori-mobile-session-panel--page-title">
              {activeView === 'location'
                ? locationPageTitle
                : activeView === 'share'
                ? sharePageTitle
                : knownFactsPageTitle}
            </h3>
            {activeView === 'location' ? (
              <div className="memori-mobile-session-panel--page-content">
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
                    className="memori-mobile-session-panel--page-btn"
                    onClick={onLocationEnable}
                  >
                    {locationEnableLabel}
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
              </div>
            ) : activeView === 'share' ? (
              <div className="memori-mobile-session-panel--page-content">
                {shareContent}
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
