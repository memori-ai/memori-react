import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { truncateMessage } from '../../helpers/message';
import { MAX_MSG_CHARS, MAX_MSG_WORDS } from '../../helpers/constants';

export interface Props {
  rows?: number;
  className?: string;
  innerClassName?: string;
  btnClassName?: string;
  lineHeightMultiplier?: number;
  defaultExpanded?: boolean;
  expandSymbol?: (lang: string) => React.ReactNode;
  collapseSymbol?: (lang: string) => React.ReactNode;
  children: React.ReactNode;
  mode?: 'rows' | 'characters';
}

const Expandable = ({
  rows,
  className,
  innerClassName,
  btnClassName,
  lineHeightMultiplier = 1.2,
  defaultExpanded = false,
  expandSymbol = () => '...',
  collapseSymbol = (lang: string) =>
    lang === 'it' ? 'Mostra meno' : 'Show less',
  children,
  mode = 'rows',
}: Props) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const collapseSymbolText = collapseSymbol(lang);
  const expandSymbolText = expandSymbol(lang);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [needsExpanding, setNeedsExpanding] = useState(false);
  const [rowHeight, setRowHeight] = useState(16);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (mode === 'rows') {
        let height = ref.current.getBoundingClientRect().height;
        let computedStyle = getComputedStyle(ref.current);
        let elLineHeight = computedStyle.lineHeight;
        let lineHeight =
          elLineHeight === 'normal' || !elLineHeight?.length
            ? lineHeightMultiplier * parseInt(computedStyle.fontSize, 10)
            : parseInt(elLineHeight, 10);

        setRowHeight(lineHeight);
        if (height && rows && height > rows * lineHeight) {
          setNeedsExpanding(true);
        }
      } else if (mode === 'characters') {
        // Get text content length
        const textContent = ref.current.textContent || '';

        if (
          textContent.length > MAX_MSG_CHARS ||
          textContent.split(' ').length > MAX_MSG_WORDS
        ) {
          setNeedsExpanding(true);
        }
      }
    }
  }, [rows, mode, ref.current]);

  const renderContent = () => {
    if (mode === 'characters' && !expanded && needsExpanding) {
      const content = ref.current?.textContent || '';
      let truncatedContent = truncateMessage(content);

      return truncatedContent;
    }

    return children;
  };

  return (
    <div className={cx('memori-expandable', className)}>
      <div
        ref={ref}
        className={cx('memori-expandable--inner', innerClassName)}
        style={{
          maxHeight:
            expanded || !needsExpanding || mode === 'characters'
              ? '9999px'
              : `${rowHeight * (rows || 1)}px`,
        }}
      >
        {renderContent()}
      </div>
      {needsExpanding && !expanded && (
        <Button
          ghost
          padded={false}
          className={btnClassName}
          onClick={() => setExpanded(true)}
        >
          {expandSymbolText}
        </Button>
      )}
      {needsExpanding && expanded && (
        <Button
          ghost
          padded={false}
          className={btnClassName}
          onClick={() => setExpanded(false)}
        >
          {collapseSymbolText}
        </Button>
      )}
    </div>
  );
};

export default Expandable;
