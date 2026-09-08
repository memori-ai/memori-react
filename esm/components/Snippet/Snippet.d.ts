/// <reference types="react" />
import { Medium } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    medium: Medium;
    className?: string;
    preview?: boolean;
    showCopyButton?: boolean;
}
declare const Snippet: ({ medium, className, preview, showCopyButton, }: Props) => JSX.Element;
export default Snippet;
