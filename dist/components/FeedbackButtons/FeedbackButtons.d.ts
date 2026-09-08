/// <reference types="react" />
import { Memori } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    memori: Memori;
    onNegativeClick: (msg?: string) => void;
    className?: string;
    toggle?: boolean;
    dropdown?: boolean;
}
declare const FeedbackButtons: ({ memori, className, onNegativeClick, toggle, dropdown, }: Props) => JSX.Element;
export default FeedbackButtons;
