import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Modal } from '@memori.ai/ui';
import cx from 'classnames';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ContentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  /** Secondary line under the title (file type, date, …) */
  description?: React.ReactNode;
  headerIcon?: React.ReactNode;
  /** When true, renders image with min 600px width; otherwise renders children in snippet-style area */
  isImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /** Content for non-image preview (text, Snippet, iframe, etc.) */
  children?: React.ReactNode;
  className?: string;
  /** Document reader (markdown) vs monospace snippet */
  contentKind?: 'snippet' | 'document';
}

const OVERFLOW_THRESHOLD_PX = 8;

const ContentPreviewModal: FC<ContentPreviewModalProps> = ({
  open,
  onClose,
  title,
  description,
  headerIcon,
  isImage = false,
  imageSrc,
  imageAlt,
  children,
  className,
  contentKind = 'snippet',
}) => {
  const { t } = useTranslation();
  const width = 'min(90vw, 800px)';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScroll(false);
      setAtBottom(true);
      return;
    }
    const overflow = el.scrollHeight - el.clientHeight > OVERFLOW_THRESHOLD_PX;
    setCanScroll(overflow);
    setAtBottom(
      !overflow ||
        el.scrollTop + el.clientHeight >=
          el.scrollHeight - OVERFLOW_THRESHOLD_PX
    );
  }, []);

  useLayoutEffect(() => {
    if (!open || isImage) {
      setCanScroll(false);
      setAtBottom(true);
      return;
    }

    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = 0;
    updateScrollState();

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const ResizeObs =
      typeof ResizeObserver !== 'undefined' ? ResizeObserver : null;
    const observer = ResizeObs ? new ResizeObs(updateScrollState) : null;
    observer?.observe(el);
    if (el.firstElementChild && observer) {
      observer.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      observer?.disconnect();
    };
  }, [open, isImage, children, updateScrollState]);

  const showScrollCue = !isImage && canScroll && !atBottom;

  const heading =
    headerIcon || description ? (
      <div className="memori-content-preview-modal--heading">
        {headerIcon ? (
          <div
            className="memori-content-preview-modal--heading-icon"
            aria-hidden
          >
            {headerIcon}
          </div>
        ) : null}
        <div className="memori-content-preview-modal--heading-copy">
          {title ? (
            <span className="memori-content-preview-modal--heading-title">
              {title}
            </span>
          ) : null}
          {description ? (
            <span className="memori-content-preview-modal--heading-subtitle">
              {description}
            </span>
          ) : null}
        </div>
      </div>
    ) : (
      title
    );

  const scrollToContinue = () => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      top: Math.max(el.clientHeight * 0.75, 160),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const imageAltText =
    imageAlt ?? (typeof title === 'string' ? title : undefined) ?? 'Preview';

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      width={width}
      widthMd={width}
      stacking="stacked"
      className={cx('memori-content-preview-modal', className, {
        'memori-content-preview-modal--image': isImage,
        'memori-content-preview-modal--document':
          !isImage && contentKind === 'document',
      })}
      closable
      title={heading}
      footer={null}
    >
      <div
        className={cx('memori-content-preview-modal--body', {
          'memori-content-preview-modal--body--image': isImage,
          'memori-content-preview-modal--body--content': !isImage,
        })}
      >
        {isImage && imageSrc ? (
          <div className="memori-content-preview-modal--image-wrap">
            <img
              src={imageSrc}
              alt={imageAltText}
              className="memori-content-preview-modal--image"
            />
          </div>
        ) : (
          <div
            className={cx('memori-content-preview-modal--scroll-shell', {
              'memori-content-preview-modal--scroll-shell--cue': showScrollCue,
            })}
          >
            <div
              ref={scrollRef}
              className={cx('memori-content-preview-modal--snippet-wrap', {
                'memori-content-preview-modal--snippet-wrap--document':
                  contentKind === 'document',
              })}
              data-testid="content-preview-scroll-body"
              onScroll={updateScrollState}
            >
              {children}
            </div>
            {showScrollCue && (
              <button
                type="button"
                className="memori-content-preview-modal--scroll-cue"
                onClick={scrollToContinue}
              >
                <ChevronDown
                  className="memori-content-preview-modal--scroll-cue-icon"
                  aria-hidden
                />
                <span>
                  {t('scrollToContinueReading', {
                    defaultValue: 'Scroll to continue reading',
                  })}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContentPreviewModal;
