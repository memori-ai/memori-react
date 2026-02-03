import {
  Memori as MemoriOriginal,
  Tenant,
  Venue,
  User,
} from '@memori.ai/memori-api-client/src/types';
import React, { useState, useEffect } from 'react';
import { getResourceUrl } from '../../helpers/media';
import { useTranslation } from 'react-i18next';
import { SelectBox, Tooltip } from '@memori.ai/ui';
import { getTranslation } from '../../helpers/translations';
import { Button } from '@memori.ai/ui';
import Translation from '../icons/Translation';
import { getGroupedChatLanguages } from '../../helpers/constants';
import BlockedMemoriBadge from '../BlockedMemoriBadge/BlockedMemoriBadge';
import AI from '../icons/AI';
import Group from '../icons/Group';
import DeepThought from '../icons/DeepThought';
import CompletionProviderStatus, {
  Props as CPSProps,
} from '../CompletionProviderStatus/CompletionProviderStatus';
import MapMarker from '../icons/MapMarker';
import UserIcon from '../icons/User';
import QuestionHelp from '../icons/QuestionHelp';
import { Expandable } from '@memori.ai/ui';

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
  openPositionDrawer: () => void;
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
  openPositionDrawer,
  instruct = false,
  hasInitialSession = false,
  clickedStart,
  onClickStart,
  initializeTTS,
  _TEST_forceProviderStatus,
  isUserLoggedIn = false,
  user,
  showLogin = false,
  setShowLoginDrawer,
  notEnoughCredits = false,
  isMultilanguageEnabled,
}) => {
  const { t, i18n } = useTranslation();
  const [translatedDescription, setTranslatedDescription] = useState(
    memori.description
  );

  const [showTranslation, setShowTranslation] = useState(true);
  const toggleTranslations = () => {
    setShowTranslation(show => !show);
  };

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
                <Group />
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
      <h2 className="memori--title">{memori.name}</h2>
      {memori.needsPosition && !position && (
        <div className="memori--needsPosition">
          <p>
            {t('write_and_speak.requirePositionHelp', { name: memori.name })}
          </p>
          <Button
            variant="primary"
            onClick={() => openPositionDrawer()}
            icon={<MapMarker />}
          >
            {t('widget.position')}
          </Button>
        </div>
      )}
      {((memori.needsPosition && position) || !memori.needsPosition) &&
        !!memori.requireLoginToken &&
        !isUserLoggedIn && (
          <div className="memori--needsLogin">
            <p>
              {t('write_and_speak.requirePositionHelp', { name: memori.name })}
            </p>
            <Button
              variant="primary"
              onClick={() => setShowLoginDrawer(true)}
              icon={<UserIcon />}
            >
              {t('login.login') || 'Login'}
            </Button>
          </div>
        )}
      {((memori.needsPosition && position) || !memori.needsPosition) &&
        (!memori.requireLoginToken ||
          (memori.requireLoginToken && isUserLoggedIn)) && (
          <div className="memori--description">
            <p>
              <Expandable className="memori--description-text" rows={3}>
                {translatedDescription && showTranslation
                  ? translatedDescription
                  : memori.description}
              </Expandable>

              {translatedDescription !== memori.description && (
                <Button
                  variant="ghost"
                  icon={<Translation />}
                  onClick={() => toggleTranslations()}
                >
                  {showTranslation
                    ? t('showOriginalText')
                    : t('showTranslatedText')}
                </Button>
              )}
            </p>

          {isMultilanguageEnabled && !instruct && (
              <div className="memori--language-chooser">
                <label id="user-lang-pref-label" htmlFor="user-lang-pref">
                  {t('write_and_speak.iWantToTalkToIn', {
                    name: memori.name,
                  })}
                </label>
                <SelectBox
                  name="user-lang-pref"
                  className="memori-select--button"
                  value={userLang ?? i18n.language}
                  onChange={(value: string | null) => {
                    if (value) {
                      setUserLang(value);
                    }
                  }}
                  placeholder={t('write_and_speak.iWantToTalkToIn') || 'I want to talk to Memori in'}
                  options={getGroupedChatLanguages().popular.map(lang => ({
                    label: lang.label,
                    value: lang.value,
                  }))}
                />
              </div>
            )}

            <div className="memori--start-privacy-explanation-container">
              <p className="memori--start-privacy-explanation">
                {t('write_and_speak.pagePrivacyExplanation')}
              </p>
              <Tooltip
                align="right"
                content={
                  <div className="memori--privacy-tooltip-content">
                    <p>
                      {' '}
                      {t(
                        'write_and_speak.pagePrivacyExplanationList.allConversations'
                      )}
                    </p>
                    <ul className="memori--privacy-tooltip-content-list">
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
                    >
                      {tenant?.privacyPolicyURL ?? t('privacyPolicy')}
                    </a>
                  </div>
                }
              >
                <QuestionHelp className="memori--start-privacy-explanation-icon" />
              </Tooltip>
            </div>

            <Button
              variant="primary"
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
              className="memori--start-button"
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

            <CompletionProviderStatus
              provider={memori?.completionConfigForQuestionAnswering?.provider}
              forceStatus={_TEST_forceProviderStatus}
            />

            <p className="memori--start-description">
              {instruct
                ? t('write_and_speak.pageInstructExplanation')
                : t('write_and_speak.pageTryMeExplanation')}
            </p>

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

            {!!memori.enableDeepThought && !instruct && (
              <div className="memori--deep-thought-disclaimer">
                <Tooltip align="left" content={t('deepThoughtHelper')}>
                  <DeepThought />
                </Tooltip>
                <h2>
                  {isUserLoggedIn && !!user?.pAndCUAccepted
                    ? t('deepThoughtDisclaimerTitle')
                    : t('deepThought')}
                </h2>
                {isUserLoggedIn && !user?.pAndCUAccepted && (
                  <p>{t('deepThoughtPreDisclaimerNotAllowed')}</p>
                )}
                {!isUserLoggedIn && (
                  <p>{t('deepThoughtPreDisclaimerUnlogged')}</p>
                )}
                {!isUserLoggedIn && showLogin && (
                  <p>
                    <Button
                      variant="outline"
                      onClick={() => setShowLoginDrawer(true)}
                    >
                      {t('login.login') || 'Login'}
                    </Button>
                  </p>
                )}
                <p className="memori--deep-thought-disclaimer-text">
                  {t('deepThoughtDisclaimer')}
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default StartPanel;
