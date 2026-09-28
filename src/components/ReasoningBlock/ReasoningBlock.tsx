import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ReasoningBlockProps {
  content: string;
  complete: boolean;
}

const ReasoningBlock: React.FC<ReasoningBlockProps> = ({
  content,
  complete,
}) => {
  const { t } = useTranslation();
  const panelId = useId();
  const userToggled = useRef(false);
  const startedAt = useRef<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(!complete);
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    if (!complete && startedAt.current == null) {
      startedAt.current = Date.now();
    }
  }, [complete]);

  useEffect(() => {
    if (!complete || startedAt.current == null || elapsedSeconds != null) {
      return;
    }
    setElapsedSeconds(
      Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
    );
  }, [complete, elapsedSeconds]);

  useEffect(() => {
    if (userToggled.current) return;
    setOpen(!complete);
  }, [complete]);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open && !complete) {
      el.scrollTop = el.scrollHeight;
    }
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [content, open, complete]);

  const label = !complete
    ? t('thinking') || 'Thinking'
    : elapsedSeconds != null
    ? t('thoughtFor', { count: elapsedSeconds }) ||
      `Thought for ${elapsedSeconds}s`
    : t('thought') || 'Thought';

  return (
    <div
      className={cx('memori-reasoning', {
        'memori-reasoning--open': open,
        'memori-reasoning--streaming': !complete,
        'memori-reasoning--overflow': overflowing,
      })}
    >
      <button
        type="button"
        className="memori-reasoning__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          userToggled.current = true;
          setOpen(value => !value);
        }}
      >
        <ChevronRight
          className="memori-reasoning__chevron"
          aria-hidden
          size={14}
          strokeWidth={2.25}
        />
        <span
          className={cx('memori-reasoning__label', {
            'memori-reasoning__label--thinking': !complete,
          })}
        >
          {label}
        </span>
      </button>
      <div
        id={panelId}
        className="memori-reasoning__collapsible"
        role="region"
        aria-hidden={!open}
      >
        <div className="memori-reasoning__clip">
          <div className="memori-reasoning__panel">
            <div className="memori-reasoning__body" ref={bodyRef}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReasoningBlock;
