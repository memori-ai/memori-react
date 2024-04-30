import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

export interface Props {
  rows: number;
  className?: string;
  innerClassName?: string;
  btnClassName?: string;
  lineHeightMultiplier?: number;
  defaultExpanded?: boolean;
  expandSymbol?: (lang: string) => React.ReactNode;
  collapseSymbol?: (lang: string) => React.ReactNode;
  children: React.ReactNode;
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
}: Props) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const collapseSymbolText = collapseSymbol(lang);
  const expandSymbolText = expandSymbol(lang);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [needsExpanding, setNeedsExpanding] = useState(false);
  const [rowHeight, setRowHeight] = useState(16);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      let height = (ref.current as HTMLElement).getBoundingClientRect().height;
      let computedStyle = getComputedStyle(ref.current as HTMLElement);
      let elLineHeight = computedStyle.lineHeight;
      let lineHeight =
        elLineHeight === 'normal' || !elLineHeight?.length
          ? lineHeightMultiplier * parseInt(computedStyle.fontSize, 10)
          : parseInt(elLineHeight, 10);

      console.table({
        rows,
        lineHeight,
        height,
        maxHeight: rows * lineHeight,
        needsExpanding: height > rows * lineHeight,
      });
      setRowHeight(lineHeight);
      if (height && height > rows * lineHeight) {
        setNeedsExpanding(true);
      }
    }
  }, [rows, ref.current]);

  return (
    <div className={cx('memori-expandable', className)}>
      <div
        ref={ref}
        className={cx('memori-expandable--inner', innerClassName)}
        style={{
          maxHeight:
            expanded || !needsExpanding ? '9999px' : `${rowHeight * rows}px`,
        }}
      >
        {children}
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
