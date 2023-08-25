import { useEffect, useState } from 'react';

const separator = '                                        ';
const sentences = [
  'Generating an accurate and fancy response...',
  'Generating a response that will blow your mind...',
  'Generating a response that will make you smile...',
  'Thinking of a response...',
  'Thinking of a response that will make you smile...',
  'Gathering my thoughts...',
  'Gathering my thoughts to give you a response...',
];

const Typing = () => {
  const [text, setText] = useState(sentences[0] + separator);
  const [shownText, setShownText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const letter = text[shownText.length];
      if (letter !== undefined) {
        setShownText(prev => prev + letter);
      } else {
        setShownText('');
        setText(
          sentences[Math.floor(Math.random() * sentences.length)] + separator
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
        <p>{shownText}</p>
      </div>
    </div>
  );
};

export default Typing;
