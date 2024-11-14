import React, { useLayoutEffect, useState } from 'react';
import cx from 'classnames';
import {
  ExpertReference,
  Memori,
  Message,
  Tenant,
  User,
} from '@memori.ai/memori-api-client/dist/types';
import { Props as MemoriProps } from '../MemoriWidget/MemoriWidget';
import { Transition } from '@headlessui/react';
import { getResourceUrl } from '../../helpers/media';
import UserIcon from '../icons/User';
import AI from '../icons/AI';
import Translation from '../icons/Translation';
import Tooltip from '../ui/Tooltip';
import FeedbackButtons from '../FeedbackButtons/FeedbackButtons';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Button from '../ui/Button';
import QuestionHelp from '../icons/QuestionHelp';
import Copy from '../icons/Copy';
import Code from '../icons/Code';
import WhyThisAnswer from '../WhyThisAnswer/WhyThisAnswer';
import { cleanUrl, stripHTML, stripOutputTags } from '../../helpers/utils';

import markedLinkifyIt from 'marked-linkify-it';
import markedKatex from 'marked-katex-extension';
import markedExtendedTables from '../../helpers/markedExtendedTables';

export interface Props {
  message: Message;
  memori: Memori;
  sessionID: string;
  tenant?: Tenant;
  baseUrl?: string;
  apiUrl?: string;
  showFeedback?: boolean;
  showWhyThisAnswer?: boolean;
  showCopyButton?: boolean;
  showTranslationOriginal?: boolean;
  simulateUserPrompt?: (msg: string) => void;
  showAIicon?: boolean;
  isFirst?: boolean;
  userAvatar?: MemoriProps['userAvatar'];
  user?: User;
  experts?: ExpertReference[];
}

marked.use({
  async: false,
  gfm: true,
  pedantic: true,
  renderer: {
    link(href: string, title: string | null | undefined, text: string) {
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ' target="_blank" rel="noopener noreferrer">' + text + '</a>';
      return out;
    },
  },
});
marked.use(markedLinkifyIt());
marked.use(
  markedKatex({
    throwOnError: false,
    output: 'htmlAndMathml',
  })
);
marked.use(markedExtendedTables());

const ChatBubble: React.FC<Props> = ({
  message,
  memori,
  tenant,
  baseUrl,
  apiUrl,
  sessionID,
  showFeedback,
  showWhyThisAnswer = true,
  showCopyButton = true,
  showTranslationOriginal = false,
  simulateUserPrompt,
  showAIicon = true,
  isFirst = false,
  user,
  userAvatar,
  experts,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [showingWhyThisAnswer, setShowingWhyThisAnswer] = useState(false);

  const text = message.translatedText || message.text;

  // remove redundant mathjax delimiters: old code
  // .replaceAll(/(?<!\\)\[/g, '\\[')
  // .replaceAll(/(?<!\\)\]/g, '\\]')
  // since old Safari < 16.4 doesn't support negative lookbehind, we need to use a workaround
  const parseSquaredBrackets = (text: string) => {
    let result = '';
    let isEscaped = false;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '[' && !isEscaped) {
        result += '\\[';
      } else if (text[i] === ']' && !isEscaped) {
        result += '\\]';
      } else {
        result += text[i];
      }
      isEscaped = text[i] === '\\' && !isEscaped;
    }
    return result;
  };

  const renderMsg = (text: string) => {
    try {
      return (
        parseSquaredBrackets(
          DOMPurify.sanitize(
            (
              marked.parse(
                text
                  // remove leading and trailing whitespaces
                  .trim()
                  // remove markdown links
                  .replaceAll(
                    /\[([^\]]+)\]\(([^\)]+)\)/g,
                    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
                  )
                  // remove markdown multiline code blocks but keep the content
                  .replaceAll(/```markdown([^```]+)```/g, '$1')
                  .replaceAll('($', '( $')
                  .replaceAll(':$', ': $')
                  .replaceAll('\frac', '\\frac')
                  .replaceAll('\beta', '\\beta')
                  .replaceAll('cdot', '\\cdot')
              ) as string
            )
              .trim()
              .replace(/\n/g, '<br>'),
            {
              ADD_ATTR: ['target'],
            }
          )
        )
          // replace consecutive <br> with a single <br>
          .replace(/(<br>)+/g, '<br>')
          // remove empty paragraphs
          .replace(/<p><\/p>/g, '<br>')
          .replace(/<p><br><\/p>/g, '<br>')
      );
    } catch (e) {
      console.error(e);
      return text;
    }
  };
  const renderedText = message.fromUser ? text : renderMsg(text);

  const plainText = message.fromUser
    ? text
    : stripHTML(stripOutputTags(renderedText));

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && !message.fromUser) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      if ('MathJax' in window && window.MathJax.typesetPromise)
        // @ts-ignore
        // eslint-disable-next-line no-undef
        window.MathJax.typesetPromise(['.memori-chat--bubble-content']);
    }
  }, [message.text, message.fromUser]);

  return (
    <>
      {(message.initial || isFirst) && (
        <div className="memori-chat--bubble-initial" />
      )}
      <Transition
        show
        appear
        as="div"
        className={cx('memori-chat--bubble-container', {
          'memori-chat--bubble-from-user': !!message.fromUser,
          'memori-chat--with-addon':
            (message.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt),
        })}
      >
        {!message.fromUser && (
          <Transition.Child
            as="picture"
            className="memori-chat--bubble-avatar"
            enter="transition ease-in-out duration-300"
            enterFrom={`opacity-0 scale-075 ${
              message.fromUser ? 'translate-x-15' : 'translate-x--15'
            }`}
            enterTo="opacity-1 scale-1 translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="opacity-1 scale-1 translate-x-0"
            leaveTo={`opacity-0 scale-075 ${
              message.fromUser ? 'translate-x-15' : 'translate-x--15'
            }`}
            title={
              !!message.emitter?.length && !!memori.enableBoardOfExperts
                ? message.emitter
                : memori.name
            }
          >
            <img
              className="memori-chat--bubble-avatar-img"
              alt={
                !!message.emitter?.length && !!memori.enableBoardOfExperts
                  ? message.emitter
                  : memori.name
              }
              src={
                !!message.emitter?.length &&
                !!memori.enableBoardOfExperts &&
                experts?.find(e => e.name === message.emitter)
                  ? `${apiUrl}/api/v1/memoriai/memori/avatar/${
                      experts.find(e => e.name === message.emitter)
                        ?.expertMemoriID
                    }`
                  : memori.avatarURL && memori.avatarURL.length > 0
                  ? getResourceUrl({
                      type: 'avatar',
                      tenantID: tenant?.id,
                      resourceURI: memori.avatarURL,
                      baseURL: baseUrl,
                      apiURL: apiUrl,
                    })
                  : getResourceUrl({
                      tenantID: tenant?.id,
                      type: 'avatar',
                      baseURL: baseUrl || 'https://www.aisuru.com',
                      apiURL: apiUrl,
                    })
              }
              onError={e => {
                e.currentTarget.src =
                  memori.avatarURL && memori.avatarURL.length > 0
                    ? getResourceUrl({
                        type: 'avatar',
                        tenantID: tenant?.id,
                        resourceURI: memori.avatarURL,
                        baseURL: baseUrl,
                      })
                    : getResourceUrl({
                        tenantID: tenant?.id,
                        type: 'avatar',
                        baseURL: baseUrl,
                      });

                e.currentTarget.onerror = null;
              }}
            />
          </Transition.Child>
        )}
        <Transition.Child
          as="div"
          className={cx('memori-chat--bubble', {
            'memori-chat--user-bubble': !!message.fromUser,
            'memori-chat--with-addon':
              (!message.fromUser && showCopyButton) ||
              (message.generatedByAI && showAIicon) ||
              (showFeedback && simulateUserPrompt),
            'memori-chat--ai-generated': message.generatedByAI && showAIicon,
            'memori-chat--with-feedback': showFeedback,
          })}
          enter="transition ease-in-out duration-300"
          enterFrom={`opacity-0 scale-09 translate-x-${
            message.fromUser ? '30' : '-30'
          }`}
          enterTo="opacity-1 scale-1 translate-x-0"
          leave="transition ease-in-out duration-300"
          leaveFrom="opacity-1 scale-1 translate-x-0"
          leaveTo={`opacity-0 scale-09  translate-x-${
            message.fromUser ? '30' : '-30'
          }`}
        >
          <div
            dir="auto"
            className="memori-chat--bubble-content"
            dangerouslySetInnerHTML={{ __html: renderedText }}
          />
          {((!message.fromUser && showCopyButton) ||
            (message.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt)) && (
            <div className="memori-chat--bubble-addon">
              {!message.fromUser && showCopyButton && (
                <Button
                  ghost
                  shape="circle"
                  title={t('copy') || 'Copy'}
                  className="memori-chat--bubble-action-icon"
                  icon={<Copy aria-label={t('copy') || 'Copy'} />}
                  onClick={() => navigator.clipboard.writeText(plainText)}
                />
              )}
              {!message.fromUser &&
                showCopyButton &&
                plainText !== message.text && (
                  <Button
                    ghost
                    shape="circle"
                    title={t('copyRawCode') || 'Copy raw code'}
                    className="memori-chat--bubble-action-icon"
                    icon={
                      <Code aria-label={t('copyRawCode') || 'Copy raw code'} />
                    }
                    onClick={() => navigator.clipboard.writeText(message.text)}
                  />
                )}

              {showFeedback && !!simulateUserPrompt && (
                <FeedbackButtons
                  memori={memori}
                  className="memori-chat--bubble-feedback"
                  dropdown
                  onNegativeClick={msg => {
                    if (msg) simulateUserPrompt(msg);
                  }}
                />
              )}

              {message.generatedByAI && showAIicon && (
                <Tooltip
                  align="left"
                  content={t('generatedByAI')}
                  className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                >
                  <span>
                    <AI title={t('generatedByAI') || undefined} />
                  </span>
                </Tooltip>
              )}

              {showTranslationOriginal &&
                message.translatedText &&
                message.translatedText !== message.text && (
                  <Tooltip
                    align="left"
                    content={`${
                      lang === 'it' ? 'Testo originale' : 'Original text'
                    }: ${message.text}`}
                    className="memori-chat--bubble-action-icon memori-chat--bubble-action-icon--ai"
                  >
                    <span>
                      <Translation
                        aria-label={
                          lang === 'it' ? 'Testo originale' : 'Original text'
                        }
                      />
                    </span>
                  </Tooltip>
                )}

              {!message.fromUser &&
                message.questionAnswered &&
                apiUrl &&
                showWhyThisAnswer && (
                  <Button
                    ghost
                    shape="circle"
                    title={t('whyThisAnswer') || undefined}
                    className="memori-chat--bubble-action-icon"
                    onClick={() => setShowingWhyThisAnswer(true)}
                    disabled={showingWhyThisAnswer}
                    icon={
                      <QuestionHelp title={t('whyThisAnswer') || undefined} />
                    }
                  />
                )}
            </div>
          )}
        </Transition.Child>

        {message.fromUser && (
          <>
            {(!!userAvatar && typeof userAvatar === 'string') ||
            (!userAvatar && !!user?.avatarURL?.length) ? (
              <Transition.Child
                as="picture"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                <img
                  className="memori-chat--bubble-avatar-img"
                  alt={user?.userName ?? 'User'}
                  src={userAvatar ?? user?.avatarURL}
                />
              </Transition.Child>
            ) : !!userAvatar ? (
              <Transition.Child
                as="div"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                {userAvatar}
              </Transition.Child>
            ) : (
              <Transition.Child
                as="div"
                className="memori-chat--bubble-avatar"
                enter="transition ease-in-out duration-300"
                enterFrom={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
                enterTo="opacity-1 scale-1 translate-x-0"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-1 scale-1 translate-x-0"
                leaveTo={`opacity-0 scale-075 ${
                  message.fromUser ? 'translate-x-15' : 'translate-x--15'
                }`}
              >
                <UserIcon />
              </Transition.Child>
            )}
          </>
        )}
      </Transition>

      {showingWhyThisAnswer && apiUrl && (
        <WhyThisAnswer
          visible={showingWhyThisAnswer}
          message={message}
          closeDrawer={() => setShowingWhyThisAnswer(false)}
          apiURL={apiUrl}
          sessionID={sessionID}
        />
      )}
    </>
  );
};

export default ChatBubble;
