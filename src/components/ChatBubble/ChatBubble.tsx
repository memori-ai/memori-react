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
import UploadIcon from '../icons/Upload';
import PreviewIcon from '../icons/Preview';
import FilePreview from '../FilePreview/FilePreview';

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
    link: ({ href, title, text }) => {
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

  const parseSquaredBrackets = (text: string) => {
    const rows = text.split('\n');

    return rows.reduce((acc, row) => {
      if (row.includes('=')) {
        let result = '';
        let isEscaped = false;
        for (let i = 0; i < row.length; i++) {
          if (row[i] === '[' && !isEscaped) {
            result += '\\[';
          } else if (row[i] === ']' && !isEscaped) {
            result += '\\]';
          } else {
            result += row[i];
          }
          isEscaped = row[i] === '\\' && !isEscaped;
        }

        return acc?.length ? `${acc}\n${result}` : result;
      } else {
        return acc?.length ? `${acc}\n${row}` : row;
      }
    }, '');
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
  const renderedText = renderMsg(text);

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
        {/* Avatar for non-user messages */}
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
                // Fallback image handling if primary source fails
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

        {/* Message bubble content */}
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
          {/* Message text content */}
          <div
            dir="auto"
            className="memori-chat--bubble-content"
            dangerouslySetInnerHTML={{ __html: renderedText }}
          />

          {/* Action buttons and indicators */}
          {((!message.fromUser && showCopyButton) ||
            (message.generatedByAI && showAIicon) ||
            (showFeedback && simulateUserPrompt)) && (
            <div className="memori-chat--bubble-addon">
              {/* Copy text button */}
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

              {/* Copy raw code button */}
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

              {/* Feedback buttons */}
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

              {/* AI generation indicator */}
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

              {/* Translation original text indicator */}
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

              {/* Why this answer button */}
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

          {/* Render User attachments if there are any */}
          {message.fromUser &&
            message.media?.length &&
            message.media[0].properties?.isAttachedFile && (
              <FilePreview
                previewFiles={message.media.map(m => ({
                  name: m.title ?? '',
                  id: m.mediumID,
                  content: m.content ?? '',
                }))}
                removeFile={() => {}}
                allowRemove={false}
                isMessagePreview={true}
              />
            )}
        </Transition.Child>

        {/* User avatar section */}
        {message.fromUser && (
          <>
            {/* Show user avatar if it's a URL or user has an avatar URL */}
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
              /* Show custom avatar component if provided */
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
              /* Show default user icon if no avatar is provided */
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
