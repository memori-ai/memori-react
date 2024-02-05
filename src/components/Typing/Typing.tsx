import { useEffect, useState } from 'react';

const separator = ' ';
const defaultDelay = 3;
const defaultSentences = {
  en: [
    {
      delayAfter: defaultDelay,
      text: 'Generating an accurate and fancy response...',
    },
    {
      delayAfter: defaultDelay,
      text: 'Generating a response that will blow your mind...',
    },
    {
      delayAfter: defaultDelay,
      text: 'Generating a response that will make you smile...',
    },
    { delayAfter: defaultDelay, text: 'Thinking of a response...' },
    {
      delayAfter: defaultDelay,
      text: 'Thinking of a response that will make you smile...',
    },
    { delayAfter: defaultDelay, text: 'Gathering my thoughts...' },
    {
      delayAfter: defaultDelay,
      text: 'Gathering my thoughts to give you a response...',
    },
  ],
  it: [
    {
      delayAfter: defaultDelay,
      text: 'Sto generando una risposta accurata e fantasiosa...',
    },
    {
      delayAfter: defaultDelay,
      text: 'Sto generando una risposta che ti farà impazzire...',
    },
    {
      delayAfter: defaultDelay,
      text: 'Sto generando una risposta che ti farà sorridere...',
    },
    { delayAfter: defaultDelay, text: 'Sto pensando ad una risposta...' },
    {
      delayAfter: defaultDelay,
      text: 'Sto pensando ad una risposta che ti farà sorridere...',
    },
    { delayAfter: defaultDelay, text: 'Sto raccogliendo i miei pensieri...' },
    {
      delayAfter: defaultDelay,
      text: 'Sto raccogliendo i miei pensieri per darti una risposta...',
    },
  ],
};

export interface Props {
  useDefaultSentences?: boolean;
  lang?: 'en' | 'it';
  sentence?: string;
  sentences?: {
    [lang: string]: {
      /**
       * Sentence to show
       */
      text: string;
      /**
       * Seconds to wait after the sentence is completed
       */
      delayAfter: number;
    }[];
  };
}

const getSeparatorString = (seconds = defaultDelay) =>
  new Array(seconds * 20).fill(separator).join('');

const Typing = ({
  useDefaultSentences = false,
  lang = 'en',
  sentence,
  sentences,
}: Props) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(
    sentences?.[lang]?.length
      ? `${
          sentences[lang][0].text.endsWith('...') ||
          !sentences[lang][0].text.length
            ? sentences[lang][0].text
            : `${sentences[lang][0].text}...`
        }${getSeparatorString(sentences[lang][0].delayAfter)}`
      : sentence
      ? `${
          sentence.endsWith('...') || !sentence.length
            ? sentence
            : `${sentence}...`
        }${getSeparatorString()}`
      : ''
  );
  const [shownText, setShownText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const letter = text[shownText.length];
      if (letter !== undefined && text.length > 0) {
        setShownText(prev => prev + letter);
      } else if (
        sentences?.[lang]?.length &&
        index < sentences[lang].length - 1
      ) {
        const nextIndex = index + 1;
        const sentence = sentences[lang][nextIndex];
        setText(
          `${
            sentence.text.endsWith('...') || !sentence.text.length
              ? sentence.text
              : `${sentence.text}...`
          }${getSeparatorString(sentence.delayAfter)}`
        );
        setShownText('');
        setIndex(nextIndex);
      } else if (!sentences && !sentence && useDefaultSentences) {
        const sentence =
          defaultSentences[lang][
            Math.floor(Math.random() * defaultSentences[lang].length)
          ];
        setText(`${sentence.text}${getSeparatorString(sentence.delayAfter)}`);
        setShownText('');
      }
    }, 50);

    return () => clearInterval(interval);
  });

  return (
    <div className="memori-chat--bubble">
      <div className="memori-chat--bubble-typing">
        <div id="wave">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        {text.length > 0 && <p>{shownText}</p>}
      </div>
    </div>
  );
};

export default Typing;
