import {
  SearchMatches,
  Message,
} from '@memori.ai/memori-api-client/dist/types';
import { useCallback, useEffect, useState } from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
import Drawer from '../ui/Drawer';
import Spin from '../ui/Spin';
import Expandable from '../ui/Expandable';
import toast from 'react-hot-toast';
import { getErrori18nKey } from '../../helpers/error';
import { useTranslation } from 'react-i18next';
import Snippet from '../Snippet/Snippet';

export interface Props {
  apiURL: string;
  sessionID: string;
  message: Message;
  initialMatches?: SearchMatches[];
  visible?: boolean;
  closeDrawer: () => void;
}

const addQuestionMark = (question: string) =>
  question.endsWith('?') ? question : `${question}?`;

const WhyThisAnswer = ({
  message,
  apiURL,
  sessionID,
  visible = true,
  initialMatches = [],
  closeDrawer,
}: Props) => {
  const { t } = useTranslation();

  const client = memoriApiClient(apiURL);
  const searchMemory = client.search.searchMemory;

  const [matches, setMatches] = useState<SearchMatches[]>(initialMatches);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch matching memories
   */
  const fetchMemories = useCallback(async () => {
    setLoading(true);

    try {
      const { matches, ...response } = await searchMemory(sessionID, {
        searchType: 'Semantic',
        numberOfResults: 5,
        text: message.questionAnswered,
        date: message.date,
        placeName: message.placeName,
        placeLatitude: message.placeLatitude,
        placeLongitude: message.placeLongitude,
        placeUncertaintyKm: message.placeUncertaintyKm,
        contextVars: message.contextVars,
      });

      if (response.resultCode !== 0) {
        console.error(response);
        toast.error(t(getErrori18nKey(response.resultCode)));
      } else {
        setMatches(matches ?? []);
      }
    } catch (err) {
      console.error('WHYTHISANSWER/FETCH', err);
      setMatches(initialMatches ?? []);
    }

    setLoading(false);
  }, [message, sessionID]);
  useEffect(() => {
    fetchMemories();
  }, [fetchMemories, message, sessionID]);

  return (
    <Drawer
      open={visible}
      width="80%"
      animated={false}
      className="memori-whythisanswer-drawer"
      onClose={() => closeDrawer()}
      title={t('whyThisAnswer')}
    >
      <p>{t('whyThisAnswerHelper')}</p>

      {message.questionAnswered && (
        <p className="memori--whythisanswer-question-answered">
          <strong>{t('question') || 'Question'}:</strong>{' '}
          {message.questionAnswered}
        </p>
      )}

      <Spin spinning={loading}>
        {!loading && matches.length === 0 && (
          <p role="info" className="memori--whythisanswer-no-results">
            {t('nothingFound')}
          </p>
        )}
        {matches.length > 0 && (
          <ul className="memori--whythisanswer-list">
            {matches.map(m => (
              <li key={m.memory.memoryID}>
                <div className="memori--whythisanswer-title">
                  <span className="memori--whythisanswer-confidence">
                    {m.confidenceLevel}
                  </span>
                  <div className="memori--whythisanswer-title-text">
                    <p>
                      <strong>{addQuestionMark(m.memory.title ?? '')}</strong>
                    </p>
                    <p>
                      {m.memory.titleVariants
                        ?.map(t => addQuestionMark(t))
                        ?.join(' | ')}
                    </p>
                  </div>
                </div>
                {m.memory.answers?.map((a, i) => (
                  <p key={i} className="memori--whythisanswer-answer">
                    <Expandable rows={3}>{a.text}</Expandable>
                  </p>
                ))}

                {!!m.memory.media?.filter(m => m.mimeType === 'text/plain')
                  ?.length && (
                  <Snippet
                    medium={{
                      mediumID: m.memory.memoryID,
                      mimeType: 'text/plain',
                      content: m.memory.media.filter(
                        m => m.mimeType === 'text/plain'
                      )[0].content,
                    }}
                    showCopyButton={false}
                    showLineNumbers={false}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Spin>
    </Drawer>
  );
};

export default WhyThisAnswer;
