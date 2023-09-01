import { useEffect, useState } from 'react';

const separator = '                                        ';
const sentences = {
  en: [
    'Generating an accurate and fancy response...',
    'Generating a response that will blow your mind...',
    'Generating a response that will make you smile...',
    'Thinking of a response...',
    'Thinking of a response that will make you smile...',
    'Gathering my thoughts...',
    'Gathering my thoughts to give you a response...',
  ],
  it: [
    'Sto generando una risposta accurata e fantasiosa...',
    'Sto generando una risposta che ti farà impazzire...',
    'Sto generando una risposta che ti farà sorridere...',
    'Sto pensando ad una risposta...',
    'Sto pensando ad una risposta che ti farà sorridere...',
    'Sto raccogliendo i miei pensieri...',
    'Sto raccogliendo i miei pensieri per darti una risposta...',
  ],
};

export interface Props {
  useDefaultSentences?: boolean;
  lang?: 'en' | 'it';
  sentence?: string;
}

const Typing = ({
  useDefaultSentences = false,
  lang = 'en',
  sentence,
}: Props) => {
  const [text, setText] = useState(
    sentence
      ? `${sentence.endsWith('...') ? sentence : `${sentence}...`}${separator}`
      : ''
  );
  const [shownText, setShownText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const letter = text[shownText.length];
      if (letter !== undefined && text.length > 0) {
        setShownText(prev => prev + letter);
      } else if (!sentence && useDefaultSentences) {
        setShownText('');
        setText(
          sentences[lang][Math.floor(Math.random() * sentences[lang].length)] +
            separator
        );
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
