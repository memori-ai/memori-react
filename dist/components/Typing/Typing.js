"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const separator = ' ';
const defaultDelay = 15;
const timeoutMs = 20 * 1000;
const newWordInterval = 50;
const defaultSentences = {
    en: [
        { delayAfter: defaultDelay, text: 'Processing in progress...' },
        { delayAfter: defaultDelay, text: "I'm thinking..." },
        { delayAfter: defaultDelay, text: 'Analysing the request...' },
        { delayAfter: defaultDelay, text: 'Preparing the reply...' },
        { delayAfter: defaultDelay, text: 'Gathering information...' },
        { delayAfter: defaultDelay, text: 'Formulating ideas...' },
        { delayAfter: defaultDelay, text: 'One moment please...' },
        { delayAfter: defaultDelay, text: 'Almost ready...' },
        { delayAfter: defaultDelay, text: 'Connecting concepts...' },
        { delayAfter: defaultDelay, text: 'Organising ideas...' },
        { delayAfter: defaultDelay, text: 'Evaluating options...' },
        { delayAfter: defaultDelay, text: 'Looking for the best solution...' },
        { delayAfter: defaultDelay, text: 'Working for you...' },
        { delayAfter: defaultDelay, text: 'Please wait...' },
        { delayAfter: defaultDelay, text: 'Processing data...' },
        { delayAfter: defaultDelay, text: 'Calculating response...' },
        { delayAfter: defaultDelay, text: 'Synthesising information...' },
        { delayAfter: defaultDelay, text: 'Generating content...' },
        { delayAfter: defaultDelay, text: 'Reflecting on question...' },
        { delayAfter: defaultDelay, text: 'Refining the answer' },
    ],
    it: [
        { delayAfter: defaultDelay, text: 'Elaborazione in corso...' },
        { delayAfter: defaultDelay, text: 'Sto pensando...' },
        { delayAfter: defaultDelay, text: 'Analizzando la richiesta...' },
        { delayAfter: defaultDelay, text: 'Preparando la risposta...' },
        { delayAfter: defaultDelay, text: 'Raccogliendo informazioni...' },
        { delayAfter: defaultDelay, text: 'Formulando idee...' },
        { delayAfter: defaultDelay, text: 'Un momento per favore...' },
        { delayAfter: defaultDelay, text: 'Quasi pronto...' },
        { delayAfter: defaultDelay, text: 'Connettendo i concetti...' },
        { delayAfter: defaultDelay, text: 'Organizzando le idee...' },
        { delayAfter: defaultDelay, text: 'Valutando le opzioni...' },
        { delayAfter: defaultDelay, text: 'Cercando la soluzione migliore...' },
        { delayAfter: defaultDelay, text: 'Sto lavorando per te...' },
        { delayAfter: defaultDelay, text: 'Attendere prego...' },
        { delayAfter: defaultDelay, text: 'Elaborazione dati in corso...' },
        { delayAfter: defaultDelay, text: 'Calcolando la risposta...' },
        { delayAfter: defaultDelay, text: 'Sintetizzando informazioni...' },
        { delayAfter: defaultDelay, text: 'Generando contenuti...' },
        { delayAfter: defaultDelay, text: 'Sto riflettendo sulla domanda...' },
        { delayAfter: defaultDelay, text: 'Perfezionando la risposta...' },
    ],
};
const getSeparatorString = (seconds = defaultDelay) => new Array(seconds * 20).fill(separator).join('');
const Typing = ({ useDefaultSentences = false, lang = 'en', sentence, sentences, }) => {
    var _a;
    const [index, setIndex] = (0, react_1.useState)(0);
    const [text, setText] = (0, react_1.useState)(((_a = sentences === null || sentences === void 0 ? void 0 : sentences[lang]) === null || _a === void 0 ? void 0 : _a.length)
        ? `${sentences[lang][0].text.endsWith('...') ||
            !sentences[lang][0].text.length
            ? sentences[lang][0].text
            : `${sentences[lang][0].text}...`}${getSeparatorString(sentences[lang][0].delayAfter)}`
        : sentence
            ? `${sentence.endsWith('...') || !sentence.length
                ? sentence
                : `${sentence}...`}${getSeparatorString()}`
            : '');
    const [shownText, setShownText] = (0, react_1.useState)('');
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            var _a;
            setElapsedTime(prev => prev + newWordInterval);
            const letter = text[shownText.length];
            if (letter !== undefined && text.length > 0) {
                setShownText(prev => prev + letter);
            }
            else if (((_a = sentences === null || sentences === void 0 ? void 0 : sentences[lang]) === null || _a === void 0 ? void 0 : _a.length) &&
                index < sentences[lang].length - 1) {
                const nextIndex = index + 1;
                const sentence = sentences[lang][nextIndex];
                setText(`${sentence.text.endsWith('...') || !sentence.text.length
                    ? sentence.text
                    : `${sentence.text}...`}${getSeparatorString(sentence.delayAfter)}`);
                setShownText('');
                setIndex(nextIndex);
            }
            else if (!sentences &&
                !sentence &&
                (useDefaultSentences || elapsedTime > timeoutMs)) {
                const sentence = defaultSentences[lang][Math.floor(Math.random() * defaultSentences[lang].length)];
                setText(`${sentence.text}${getSeparatorString(sentence.delayAfter)}`);
                setShownText('');
            }
        }, newWordInterval);
        return () => clearInterval(interval);
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: "memori-chat--bubble", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori-chat--bubble-typing", children: [(0, jsx_runtime_1.jsxs)("div", { id: "wave", children: [(0, jsx_runtime_1.jsx)("span", { className: "dot" }), (0, jsx_runtime_1.jsx)("span", { className: "dot" }), (0, jsx_runtime_1.jsx)("span", { className: "dot" })] }), text.length > 0 && (0, jsx_runtime_1.jsx)("p", { children: shownText })] }) }));
};
exports.default = Typing;
//# sourceMappingURL=Typing.js.map