import React from 'react';
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
declare const Expandable: ({ rows, className, innerClassName, btnClassName, lineHeightMultiplier, defaultExpanded, expandSymbol, collapseSymbol, children, mode, }: Props) => JSX.Element;
export default Expandable;
