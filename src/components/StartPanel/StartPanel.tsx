import {
  Memori as MemoriOriginal,
  Tenant,
  Venue,
  User,
} from '@memori.ai/memori-api-client/src/types';
import React, { useState, useEffect, useMemo } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { useTranslation } from 'react-i18next';
import { Combobox, Tooltip, Modal } from '@memori.ai/ui';
import { getTranslation } from '../../helpers/translations';
import { Button } from '@memori.ai/ui';
import {
  Languages,
  Users,
  Info,
  Eye,
  MapPin,
  MapPinOff,
  User as UserIconLucide,
  ChevronDown,
} from 'lucide-react';
import { getGroupedChatLanguages } from '../../helpers/constants';
import BlockedMemoriBadge from '../BlockedMemoriBadge/BlockedMemoriBadge';
import CompletionProviderStatus, {
  Props as CPSProps,
} from '../CompletionProviderStatus/CompletionProviderStatus';
import { Expandable } from '@memori.ai/ui';

/** Section rows in the language Combobox (flat list required for working search — grouped mode in @memori.ai/ui ignores filtered items). */
const LANG_COMBO_GROUP_POPULAR = '__memori_lang_group_popular__';
const LANG_COMBO_GROUP_ALL = '__memori_lang_group_all__';

interface Memori extends MemoriOriginal {
  requireLoginToken?: boolean;
}

export interface Props {
  memori: Memori;
  tenant?: Tenant;
  language?: string;
  userLang?: string;
  setUserLang: (lang: string) => void;
  baseUrl?: string;
  apiUrl?: string;
  position?: Venue;
  setVenue: (venue?: Venue) => void;
  openPositionPopover: () => void;
  integrationConfig?: { [key: string]: any };
  instruct?: boolean;
  sessionId?: string;
  hasInitialSession?: boolean;
  clickedStart?: boolean;
  onClickStart?: () => void;
  initializeTTS?: () => void;
  _TEST_forceProviderStatus?: CPSProps['forceStatus'];
  isUserLoggedIn?: boolean;
  user?: User;
  showLogin?: boolean;
  setShowLoginDrawer: (show: boolean) => void;
  notEnoughCredits?: boolean;
  isMultilanguageEnabled?: boolean | undefined;
  showFullDescriptionOnMobile?: boolean;
}

const StartPanel: React.FC<Props> = ({
  memori,
  tenant,
  language,
  userLang,
  setUserLang,
  baseUrl,
  apiUrl,
  position,
  setVenue,
  openPositionPopover,
  instruct = false,
  hasInitialSession = false,
  clickedStart,
  onClickStart,
  initializeTTS,
  _TEST_forceProviderStatus,
  isUserLoggedIn = false,
  showLogin = false,
  setShowLoginDrawer,
  notEnoughCredits = false,
  isMultilanguageEnabled,
  showFullDescriptionOnMobile = false,
}) => {
  const { t, i18n } = useTranslation();
  const [translatedDescription, setTranslatedDescription] = useState(
    memori.description
  );

  const [showTranslation, setShowTranslation] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [mobileInfoModal, setMobileInfoModal] = useState<
    null | 'privacy' | 'deepThought'
  >(null);
  const toggleTranslations = () => {
    setShowTranslation(show => !show);
  };

  const languageComboboxOptions = useMemo(() => {
    const { popular, all } = getGroupedChatLanguages();
    return [
      {
        value: LANG_COMBO_GROUP_POPULAR,
        label: 'Popular',
        disabled: true,
      },
      ...popular.map(lang => ({
        label: lang.label,
        value: lang.value,
      })),
      {
        value: LANG_COMBO_GROUP_ALL,
        label: 'All the languages',
        disabled: true,
      },
      ...all.map(lang => ({
        label: lang.label,
        value: lang.value,
      })),
    ];
  }, []);

  const selectedChatLangCode = useMemo(() => {
    const raw = userLang ?? i18n.language ?? 'EN';
    return String(raw).split('-')[0].toUpperCase();
  }, [userLang, i18n.language]);

  useEffect(() => {
    if (!isMobile) {
      setMobileInfoModal(null);
      return;
    }

    if (!isInfoExpanded) {
      setMobileInfoModal(null);
    }
  }, [isMobile, isInfoExpanded]);

  useEffect(() => {
    if (
      ((i18n.language?.toUpperCase() ?? 'IT') !==
        (language?.toUpperCase() ?? 'IT') ||
        translatedDescription !== memori.description) &&
      !!memori.description?.length
    ) {
      getTranslation(
        memori.description,
        i18n.language?.toUpperCase() ?? 'IT',
        language,
        baseUrl
      )
        .then(value => {
          setTranslatedDescription(value.text);
        })
        .catch(console.error);
    }
  }, [i18n.language, language, memori.description, baseUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 870px)');
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (!event.matches) setIsInfoExpanded(true);
    };

    setIsMobile(mediaQuery.matches);
    setIsInfoExpanded(!mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleViewportChange);
      return () =>
        mediaQuery.removeEventListener('change', handleViewportChange);
    }

    mediaQuery.addListener(handleViewportChange);
    return () => mediaQuery.removeListener(handleViewportChange);
  }, []);

  return (
    <div className="memori--start-panel">
      <div
        className="memori--cover"
        style={{
          backgroundImage: `url("${getResourceUrl({
            type: 'cover',
            tenantID: tenant?.name,
            resourceURI: memori.coverURL,
            baseURL: baseUrl,
            apiURL: apiUrl,
          })}"), url("${getResourceUrl({
            type: 'cover',
            tenantID: tenant?.name,
            baseURL: baseUrl,
            apiURL: apiUrl,
          })}")`,
        }}
      >
        {!!memori.enableBoardOfExperts && (
          <div className="memori--board-of-experts">
            <Tooltip align="left" content={t('boardOfExperts')}>
              <span aria-label={t('boardOfExperts') || 'Board of Experts'}>
                <Users />
              </span>
            </Tooltip>
          </div>
        )}
        {!!memori.nsfw && (
          <div className="memori--nsfw">
            <Tooltip align="left" content={t('nsfw')}>
              <span title={t('nsfw') || 'NSFW'}>🔞</span>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="memori--start-panel__body">
        <div className="memori--title-container">
          <picture className="memori--avatar">
            <source
              src={
                memori.avatarURL ??
                getResourceUrl({
                  type: 'avatar',
                  tenantID: tenant?.name,
                  resourceURI: memori.avatarURL,
                  baseURL: baseUrl,
                  apiURL: apiUrl,
                })
              }
            />
            <img
              alt={memori.name}
              src={
                memori.avatarURL && memori.avatarURL.length > 0
                  ? getResourceUrl({
                      type: 'avatar',
                      tenantID: tenant?.name,
                      resourceURI: memori.avatarURL,
                      baseURL: baseUrl,
                      apiURL: apiUrl,
                    })
                  : getResourceUrl({
                      type: 'avatar',
                      tenantID: tenant?.name,
                      baseURL: baseUrl,
                      apiURL: apiUrl,
                    })
              }
            />
          </picture>
          <div className="memori--title-container__content">
            <h2 className="memori--title">{memori.name}</h2>
            <>
              {isMobile && showFullDescriptionOnMobile ? (
                <p className="memori--description-text memori--description-text--full">
                  {translatedDescription && showTranslation
                    ? translatedDescription
                    : memori.description}
                </p>
              ) : (
                <Expandable className="memori--description-text" rows={3}>
                  {translatedDescription && showTranslation
                    ? translatedDescription
                    : memori.description}
                </Expandable>
              )}

              {translatedDescription !== memori.description && (
                <Button
                  variant="ghost"
                  icon={<Languages />}
                  onClick={() => toggleTranslations()}
                >
                  {showTranslation
                    ? t('showOriginalText')
                    : t('showTranslatedText')}
                </Button>
              )}
            </>
          </div>
          <CompletionProviderStatus
            provider={memori?.completionConfigForQuestionAnswering?.provider}
            forceStatus={_TEST_forceProviderStatus}
          />
        </div>
        {memori.needsPosition && !position && (
          <div className="memori--needsPosition">
            <p>
              {t('write_and_speak.requirePositionHelp', { name: memori.name })}
            </p>
            <div className="memori--needsPosition-actions">
              <Button
                variant="primary"
                onClick={() => openPositionPopover()}
                icon={<MapPin />}
                style={{ width: '100%' }}
                size="md"
              >
                {t('write_and_speak.useMyPosition')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setVenue({
                    latitude: 0,
                    longitude: 0,
                    placeName: '',
                    uncertainty: 0,
                  });
                }}
                icon={<MapPinOff />}
                style={{ width: '100%' }}
                size="md"
              >
                {t('write_and_speak.dontWantToProvidePosition')}
              </Button>
            </div>
          </div>
        )}
        {((memori.needsPosition && position) || !memori.needsPosition) &&
          !!memori.requireLoginToken &&
          !isUserLoggedIn && (
            <div className="memori--needsLogin">
              <p>
                {t('write_and_speak.requirePositionHelp', {
                  name: memori.name,
                })}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowLoginDrawer(true)}
                icon={<UserIconLucide />}
              >
                {t('login.login') || 'Login'}
              </Button>
            </div>
          )}
        {((memori.needsPosition && position) || !memori.needsPosition) &&
          (!memori.requireLoginToken ||
            (memori.requireLoginToken && isUserLoggedIn)) && (
            <div className="memori--description">
              {isMultilanguageEnabled && !instruct && (
                <div className="memori--language-row">
                  <span className="memori--language-row__label">
                    {t('write_and_speak.chatLanguageLabel')}
                  </span>
                  <div className="memori--language-row__control">
                    <Combobox
                      name="user-lang-pref"
                      className="memori-combobox--language-chooser memori--language-row__combobox"
                      label={String(t('write_and_speak.chatLanguageLabel'))}
                      value={selectedChatLangCode}
                      onChange={(value: string | null) => {
                        if (
                          value &&
                          value !== LANG_COMBO_GROUP_POPULAR &&
                          value !== LANG_COMBO_GROUP_ALL
                        ) {
                          setUserLang(value);
                        }
                      }}
                      placeholder={
                        t('write_and_speak.iWantToTalkToIn') ||
                        'I want to talk to Memori in'
                      }
                      options={languageComboboxOptions}
                    />
                  </div>
                </div>
              )}

              <div
                className="memori--start-panel__divider"
                role="presentation"
              />

              <section className="memori--start-panel__mobile-info">
                {isMobile && (
                  <Button
                    variant="toolbar"
                    size="sm"
                    className="memori--start-panel__mobile-info-toggle"
                    onClick={() => setIsInfoExpanded(value => !value)}
                    aria-expanded={isInfoExpanded}
                  >
                    {t('moreInfo') || 'More info'}
                    <ChevronDown
                      className={`memori--start-panel__mobile-info-toggle-icon ${
                        isInfoExpanded
                          ? 'memori--start-panel__mobile-info-toggle-icon--expanded'
                          : ''
                      }`}
                    />
                  </Button>
                )}

                {(!isMobile || isInfoExpanded) && (
                  <div className="memori--start-panel__mobile-info-content">
                    <section className="memori--settings-section">
                      {!!memori.enableDeepThought && !instruct && (
                        <div className="memori--settings-section__row memori--settings-section__row--with-divider">
                          <div
                            className="memori--settings-section__icon-box memori--settings-section__icon-box--info"
                            aria-hidden
                          >
                            <Info className="memori--settings-section__icon" />
                          </div>
                          <div className="memori--settings-section__content">
                            <p className="memori--settings-section__title">
                              {t('deepThoughtDisclaimerTitle') ||
                                'Pensiero profondo abilitato'}
                            </p>
                            <div className="memori--settings-section__title-inline">
                              <p className="memori--settings-section__description">
                                {t('deepThoughtPreDisclaimerUnlogged') ||
                                  'Il modello ragiona prima di rispondere.'}
                              </p>
                            </div>
                          </div>
                          {isMobile ? (
                            <Button
                              variant="toolbar"
                              size="sm"
                              className="memori--privacy-popover-trigger memori--settings-section__info-trigger"
                              aria-label={String(
                                t('deepThoughtHelper') ?? 'Deep Thought help'
                              )}
                              onClick={() => setMobileInfoModal('deepThought')}
                            >
                              <Info className="memori--settings-section__inline-info-icon" />
                            </Button>
                          ) : (
                            <Tooltip
                              placement="top"
                              enterDelay={300}
                              leaveDelay={150}
                              sideOffset={8}
                              content={t('deepThoughtHelper')}
                              slotProps={{
                                positioner: {
                                  className:
                                    'memori--privacy-popover-positioner',
                                },
                                popup: {
                                  className:
                                    'memori--privacy-popover-popup memori--settings-section__tooltip-popup',
                                },
                              }}
                            >
                              <Button
                                variant="toolbar"
                                size="sm"
                                className="memori--privacy-popover-trigger memori--settings-section__info-trigger"
                                aria-label={String(
                                  t('deepThoughtHelper') ?? 'Deep Thought help'
                                )}
                              >
                                <Info className="memori--settings-section__inline-info-icon" />
                              </Button>
                            </Tooltip>
                          )}
                          {!isUserLoggedIn && showLogin && (
                            <Button
                              variant="toolbar"
                              size="sm"
                              className="memori--settings-section__action"
                              onClick={() => setShowLoginDrawer(true)}
                            >
                              {t('login.login') || 'Accedi'}
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="memori--settings-section__row">
                        <div
                          className="memori--settings-section__icon-box memori--settings-section__icon-box--neutral"
                          aria-hidden
                        >
                          <Eye className="memori--settings-section__icon" />
                        </div>
                        <div className="memori--settings-section__content">
                          <div className="memori--settings-section__title-inline">
                            <p className="memori--settings-section__title">
                              {t('write_and_speak.pagePrivacyExplanation') ||
                                "Conversazioni visibili all'autore"}
                            </p>
                          </div>
                          <p className="memori--settings-section__description">
                            {t(
                              'write_and_speak.pagePrivacyExplanationList.authorUsesInfo'
                            ) ||
                              "L'autore dell'agente puo vedere le tue conversazioni."}
                          </p>
                        </div>
                        {isMobile ? (
                          <Button
                            variant="toolbar"
                            size="sm"
                            className="memori--privacy-popover-trigger memori--settings-section__info-trigger"
                            aria-label={String(t('privacyPolicy') ?? '')}
                            onClick={() => setMobileInfoModal('privacy')}
                          >
                            <Info className="memori--settings-section__inline-info-icon" />
                          </Button>
                        ) : (
                          <Tooltip
                            placement="top"
                            enterDelay={300}
                            leaveDelay={150}
                            sideOffset={8}
                            title={
                              <div className="memori--privacy-popover-content">
                                <p>
                                  {t(
                                    'write_and_speak.pagePrivacyExplanationList.allConversations'
                                  )}
                                </p>
                                <ul className="memori--privacy-popover-content-list">
                                  {isUserLoggedIn ? (
                                    <li>
                                      {t(
                                        'write_and_speak.pagePrivacyExplanationList.contentAndUsername'
                                      )}
                                    </li>
                                  ) : (
                                    <li>
                                      {t(
                                        'write_and_speak.pagePrivacyExplanationList.contentAndIpAddress'
                                      )}
                                    </li>
                                  )}
                                </ul>
                                <p>
                                  {t(
                                    'write_and_speak.pagePrivacyExplanationList.authorUsesInfo'
                                  )}
                                </p>

                                <a
                                  href={
                                    tenant?.privacyPolicyURL ??
                                    'https://memori.ai/en/privacy-policy'
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="memori--privacy-popover-content-link"
                                >
                                  {tenant?.privacyPolicyURL ??
                                    t('privacyPolicy')}
                                </a>
                              </div>
                            }
                            slotProps={{
                              positioner: {
                                className: 'memori--privacy-popover-positioner',
                              },
                              popup: {
                                className:
                                  'memori--privacy-popover-popup memori--settings-section__tooltip-popup',
                              },
                            }}
                          >
                            <Button
                              variant="toolbar"
                              size="sm"
                              className="memori--privacy-popover-trigger memori--settings-section__info-trigger"
                              aria-label={String(t('privacyPolicy') ?? '')}
                            >
                              <Info className="memori--settings-section__inline-info-icon" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </section>
                  </div>
                )}
              </section>

              <p className="memori--start-description">
                {instruct
                  ? t('write_and_speak.pageInstructExplanation')
                  : t('write_and_speak.pageTryMeExplanation')}
              </p>

              <Button
                variant="primary"
                size="lg"
                disabled={
                  (!!memori.blockedUntil && !memori.isGiver) || notEnoughCredits
                }
                loading={clickedStart}
                onClick={(_e: React.MouseEvent<HTMLButtonElement>) => {
                  try {
                    window.speechSynthesis.speak(
                      new SpeechSynthesisUtterance('') // This is needed to enable the speech synthesis on iOS
                    );
                  } catch (e) {
                    console.error(e);
                  }

                  if (initializeTTS) initializeTTS();
                  if (onClickStart) onClickStart();
                }}
                style={{
                  marginTop: 'var(--memori-spacing-md)',
                  fontWeight: 'var(--memori-text-weight-bold)',
                }}
              >
                {t(
                  `write_and_speak.${
                    instruct
                      ? 'instructButton'
                      : !hasInitialSession
                      ? 'tryMeButton'
                      : 'resumeButton'
                  }`
                )}
              </Button>

              {(memori.blockedUntil || notEnoughCredits) && (
                <BlockedMemoriBadge
                  memoriName={memori.name}
                  blockedUntil={memori.blockedUntil}
                  notEnoughCredits={notEnoughCredits}
                  showGiverInfo={memori.isGiver}
                  showTitle
                  marginLeft
                />
              )}
            </div>
          )}
      </div>
      <Modal
        open={isMobile && mobileInfoModal !== null}
        onClose={() => setMobileInfoModal(null)}
        title={
          mobileInfoModal === 'deepThought'
            ? String(t('deepThoughtDisclaimerTitle') || 'Deep Thought')
            : String(
                t('write_and_speak.pagePrivacyExplanation') || 'Privacy policy'
              )
        }
      >
        {mobileInfoModal === 'deepThought' && (
          <div className="memori--privacy-popover-content">
            <p>{t('deepThoughtHelper')}</p>
          </div>
        )}
        {mobileInfoModal === 'privacy' && (
          <div className="memori--privacy-popover-content">
            <p>
              {t('write_and_speak.pagePrivacyExplanationList.allConversations')}
            </p>
            <ul className="memori--privacy-popover-content-list">
              {isUserLoggedIn ? (
                <li>
                  {t('write_and_speak.pagePrivacyExplanationList.contentAndUsername')}
                </li>
              ) : (
                <li>
                  {t('write_and_speak.pagePrivacyExplanationList.contentAndIpAddress')}
                </li>
              )}
            </ul>
            <p>{t('write_and_speak.pagePrivacyExplanationList.authorUsesInfo')}</p>
            <a
              href={tenant?.privacyPolicyURL ?? 'https://memori.ai/en/privacy-policy'}
              target="_blank"
              rel="noopener noreferrer"
              className="memori--privacy-popover-content-link"
            >
              {tenant?.privacyPolicyURL ?? t('privacyPolicy')}
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StartPanel;
