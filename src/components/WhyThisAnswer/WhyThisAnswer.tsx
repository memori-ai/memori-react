import {
  SearchMatches,
  Message,
  Memory,
  Medium,
} from '@memori.ai/memori-api-client/dist/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
import {
  Button,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import { getErrori18nKey } from '../../helpers/error';
import { useTranslation } from 'react-i18next';
import { stripAllInternalTags } from '../../helpers/message';
import { highlightMatches } from '../../helpers/highlightMatches';
import SideDrawer, { SideDrawerEmpty } from '../SideDrawer/SideDrawer';
import DrawerFooter from '../DrawerFooter/DrawerFooter';
import ContentPreviewModal from '../ContentPreviewModal/ContentPreviewModal';
import {
  FileText,
  Globe,
  HelpCircle,
  Plus,
  SearchX,
} from 'lucide-react';
import cx from 'classnames';

export interface Props {
  sessionID: string;
  message: Message;
  initialMatches?: SearchMatches[];
  visible?: boolean;
  closeDrawer: () => void;
  client?: ReturnType<typeof memoriApiClient>;
  _TEST_loading?: boolean;
  disableFetch?: boolean;
  isAgentAuthor?: boolean;
  onAddMissingContent?: () => void;
}

const ANSWER_PREVIEW_CHARS = 160;
const SNIPPET_CHARS = 220;

type SourceKind = 'question' | 'document' | 'website' | 'story';

const addQuestionMark = (question: string) =>
  question.endsWith('?') ? question : `${question}?`;

const isWebsiteMedium = (medium: Medium) =>
  medium.mimeType === 'text/html' && !!medium.url;

const isDocumentMedium = (medium: Medium) =>
  medium.mimeType === 'text/plain' ||
  medium.mimeType === 'application/pdf' ||
  medium.mimeType?.startsWith('application/') === true;

const getSourceKind = (memory: Memory): SourceKind => {
  if (memory.media?.some(isWebsiteMedium)) return 'website';
  if (memory.media?.some(isDocumentMedium)) return 'document';
  if (memory.memoryType === 'Story') return 'story';
  return 'question';
};

const getSourceTitle = (memory: Memory): string => {
  const website = memory.media?.find(isWebsiteMedium);
  if (website?.title) return website.title;
  const document = memory.media?.find(m => m.title && isDocumentMedium(m));
  if (document?.title) return document.title;
  return addQuestionMark(memory.title ?? '');
};

const getSourceSnippet = (memory: Memory): string => {
  const answer = memory.answers
    ?.map(item => stripAllInternalTags(item.text || ''))
    .find(Boolean);
  if (answer) return answer;
  const document = memory.media?.find(
    m => isDocumentMedium(m) && (m.content || m.title)
  );
  if (document?.content) return stripAllInternalTags(document.content);
  if (document?.title) return document.title;
  return (
    memory.titleVariants?.map(addQuestionMark).join(' · ') ||
    stripAllInternalTags(memory.text || '')
  );
};

const truncateText = (text: string, max: number): string => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
};

const getOpenUrl = (memory: Memory): string | undefined =>
  memory.media?.find(isWebsiteMedium)?.url;

const confidenceFill = (
  level?: SearchMatches['confidenceLevel']
): 1 | 2 | 3 => {
  if (level === 'HIGH') return 3;
  if (level === 'MEDIUM') return 2;
  return 1;
};

const WhyThisAnswer = ({
  message,
  sessionID,
  visible = true,
  initialMatches = [],
  closeDrawer,
  client,
  _TEST_loading = false,
  disableFetch = false,
  isAgentAuthor = false,
  onAddMissingContent,
}: Props) => {
  const { t } = useTranslation();
  const { add } = useAlertManager();
  const searchMemory = client?.search.searchMemory;
  const sanitizedQuestionAnswered = stripAllInternalTags(
    message.questionAnswered || ''
  );
  const sanitizedAnswer = stripAllInternalTags(
    message.translatedText || message.text || ''
  );

  const [matches, setMatches] = useState<SearchMatches[]>(initialMatches);
  const [loading, setLoading] = useState(_TEST_loading);
  const [answerExpanded, setAnswerExpanded] = useState(false);
  const [previewMemory, setPreviewMemory] = useState<Memory>();

  const fetchMemories = useCallback(async () => {
    if (_TEST_loading) {
      setLoading(true);
      return;
    }
    if (disableFetch) {
      setMatches(initialMatches);
      setLoading(false);
      return;
    }
    if (!searchMemory) {
      setMatches(initialMatches);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { matches: nextMatches, ...response } = await searchMemory(
        sessionID,
        {
          searchType: 'Semantic',
          numberOfResults: 5,
          text: sanitizedQuestionAnswered,
          date: message.date,
          placeName: message.placeName,
          placeLatitude: message.placeLatitude,
          placeLongitude: message.placeLongitude,
          placeUncertaintyKm: message.placeUncertaintyKm,
          contextVars: message.contextVars,
          tag: message.tag,
          memoryTags: message.memoryTags,
        }
      );

      if (response.resultCode !== 0) {
        console.error(response);
        add(
          createAlertOptions({
            description: t(getErrori18nKey(response.resultCode)),
            severity: 'error',
          })
        );
      } else {
        setMatches(nextMatches ?? []);
      }
    } catch (err) {
      console.error('WHYTHISANSWER/FETCH', err);
      setMatches(initialMatches ?? []);
    }

    setLoading(false);
  }, [
    _TEST_loading,
    add,
    disableFetch,
    initialMatches,
    message.contextVars,
    message.date,
    message.memoryTags,
    message.placeLatitude,
    message.placeLongitude,
    message.placeName,
    message.placeUncertaintyKm,
    message.tag,
    sanitizedQuestionAnswered,
    searchMemory,
    sessionID,
    t,
  ]);

  useEffect(() => {
    void fetchMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionID,
    sanitizedQuestionAnswered,
    disableFetch,
    _TEST_loading,
  ]);

  const answerNeedsTruncation = sanitizedAnswer.length > ANSWER_PREVIEW_CHARS;
  const displayedAnswer =
    answerExpanded || !answerNeedsTruncation
      ? sanitizedAnswer
      : truncateText(sanitizedAnswer, ANSWER_PREVIEW_CHARS);

  const sourceKindLabel = useCallback(
    (kind: SourceKind) => {
      if (kind === 'document') return t('whyThisAnswerTypeDocument');
      if (kind === 'website') return t('whyThisAnswerTypeWebsite');
      if (kind === 'story') return t('whyThisAnswerTypeStory');
      return t('whyThisAnswerTypeQuestion');
    },
    [t]
  );

  const confidenceLabel = useCallback(
    (level?: SearchMatches['confidenceLevel']) => {
      if (level === 'HIGH') return t('whyThisAnswerConfidenceHigh');
      if (level === 'MEDIUM') return t('whyThisAnswerConfidenceMedium');
      return t('whyThisAnswerConfidenceLow');
    },
    [t]
  );

  const sourceKindIcon = (kind: SourceKind) => {
    if (kind === 'document') return <FileText aria-hidden />;
    if (kind === 'website') return <Globe aria-hidden />;
    return <HelpCircle aria-hidden />;
  };

  const openSource = (memory: Memory) => {
    const url = getOpenUrl(memory);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setPreviewMemory(memory);
  };

  const previewTitle = previewMemory ? getSourceTitle(previewMemory) : '';
  const previewBody = useMemo(() => {
    if (!previewMemory) return '';
    const answers = previewMemory.answers
      ?.map(item => stripAllInternalTags(item.text || ''))
      .filter(Boolean)
      .join('\n\n');
    return answers || getSourceSnippet(previewMemory);
  }, [previewMemory]);

  const footer =
    matches.length > 0 ? (
      <DrawerFooter>
        <p className="memori-whythisanswer-disclaimer">
          {t('whyThisAnswerDisclaimer')}
        </p>
      </DrawerFooter>
    ) : undefined;

  return (
    <SideDrawer
      open={visible}
      size="md"
      className="memori-whythisanswer-drawer"
      title={t('whyThisAnswer')}
      description={t('whyThisAnswerDescription')}
      closeLabel={t('close') || 'Close'}
      footer={footer}
      onClose={closeDrawer}
    >
      {sanitizedQuestionAnswered && (
        <section className="memori-whythisanswer-pair">
          <div className="memori-whythisanswer-pair__block">
            <span className="memori-whythisanswer-pair__label">
              {isAgentAuthor
                ? t('whyThisAnswerUserAsked')
                : t('whyThisAnswerYouAsked')}
            </span>
            <p className="memori-whythisanswer-pair__text">
              {sanitizedQuestionAnswered}
            </p>
          </div>
          {sanitizedAnswer && (
            <>
              <div className="memori-whythisanswer-pair__divider" />
              <div className="memori-whythisanswer-pair__block">
                <span className="memori-whythisanswer-pair__label">
                  {t('whyThisAnswerAgentReplied')}
                </span>
                <p className="memori-whythisanswer-pair__text">
                  {displayedAnswer}
                </p>
                {answerNeedsTruncation && (
                  <button
                    type="button"
                    className="memori-whythisanswer-pair__expand"
                    onClick={() => setAnswerExpanded(open => !open)}
                  >
                    {answerExpanded
                      ? t('collapse')
                      : t('whyThisAnswerShowFull')}
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {loading && matches.length === 0 && (
        <ul className="memori-whythisanswer-list memori-whythisanswer-skeleton">
          <li className="memori-whythisanswer-card">
            <span className="memori-whythisanswer-skeleton-block" />
            <div className="memori-whythisanswer-card__body">
              <span className="memori-whythisanswer-skeleton-text" />
              <span className="memori-whythisanswer-skeleton-text" />
            </div>
          </li>
          <li className="memori-whythisanswer-card">
            <span className="memori-whythisanswer-skeleton-block" />
            <div className="memori-whythisanswer-card__body">
              <span className="memori-whythisanswer-skeleton-text" />
              <span className="memori-whythisanswer-skeleton-text" />
            </div>
          </li>
        </ul>
      )}

      {!loading && matches.length === 0 && (
        <SideDrawerEmpty
          icon={<SearchX />}
          title={t('whyThisAnswerEmptyTitle')}
          description={
            isAgentAuthor
              ? t('whyThisAnswerEmptyAuthorDescription')
              : t('whyThisAnswerEmptyDescription')
          }
        >
          {isAgentAuthor && (
            <Button
              variant="outline"
              className="memori-whythisanswer-empty-action"
              icon={<Plus aria-hidden />}
              onClick={() => {
                onAddMissingContent?.();
                closeDrawer();
              }}
            >
              {t('whyThisAnswerAddContent')}
            </Button>
          )}
        </SideDrawerEmpty>
      )}

      {matches.length > 0 && (
        <>
          <div className="memori-whythisanswer-heading">
            <h3 className="memori-whythisanswer-heading__title">
              {t('whyThisAnswerContentsUsed')}
            </h3>
            <span className="memori-whythisanswer-heading__count">
              {matches.length}
            </span>
          </div>
          <ul className="memori-whythisanswer-list">
            {matches.map(match => {
              const kind = getSourceKind(match.memory);
              const snippet = truncateText(
                getSourceSnippet(match.memory),
                SNIPPET_CHARS
              );
              const filled = confidenceFill(match.confidenceLevel);
              const tags = match.memory.tags?.filter(Boolean);

              return (
                <li key={match.memory.memoryID}>
                  <article className="memori-whythisanswer-card">
                    <span
                      className="memori-whythisanswer-card__icon"
                      aria-hidden
                    >
                      {sourceKindIcon(kind)}
                    </span>
                    <div className="memori-whythisanswer-card__body">
                      <div className="memori-whythisanswer-card__title-row">
                        <h4 className="memori-whythisanswer-card__title">
                          {getSourceTitle(match.memory)}
                        </h4>
                        <span className="memori-whythisanswer-card__type">
                          {sourceKindLabel(kind)}
                        </span>
                      </div>
                      {snippet && (
                        <p className="memori-whythisanswer-card__snippet">
                          {highlightMatches(snippet, sanitizedQuestionAnswered)}
                        </p>
                      )}
                      <div className="memori-whythisanswer-card__meta">
                        <span
                          className="memori-whythisanswer-confidence"
                          aria-label={confidenceLabel(match.confidenceLevel)}
                        >
                          <span
                            className="memori-whythisanswer-confidence__bars"
                            aria-hidden
                          >
                            {[1, 2, 3].map(bar => (
                              <span
                                key={bar}
                                className={cx(
                                  'memori-whythisanswer-confidence__bar',
                                  bar <= filled &&
                                    'memori-whythisanswer-confidence__bar--filled'
                                )}
                              />
                            ))}
                          </span>
                          {confidenceLabel(match.confidenceLevel)}
                        </span>
                        {tags && tags.length > 0 && (
                          <span className="memori-whythisanswer-card__tags">
                            {tags.join(' · ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="memori-whythisanswer-card__open"
                      onClick={() => openSource(match.memory)}
                    >
                      {t('whyThisAnswerOpen')}
                    </Button>
                  </article>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <ContentPreviewModal
        open={previewMemory != null}
        onClose={() => setPreviewMemory(undefined)}
        title={previewTitle}
      >
        <p className="memori-whythisanswer-preview">{previewBody}</p>
      </ContentPreviewModal>
    </SideDrawer>
  );
};

export default WhyThisAnswer;
