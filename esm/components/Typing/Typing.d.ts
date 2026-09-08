/// <reference types="react" />
export interface Props {
    useDefaultSentences?: boolean;
    lang?: 'en' | 'it';
    sentence?: string;
    sentences?: {
        [lang: string]: {
            text: string;
            delayAfter: number;
        }[];
    };
}
declare const Typing: ({ useDefaultSentences, lang, sentence, sentences, }: Props) => JSX.Element;
export default Typing;
