import { stripHTML } from './utils';
import { stripAllInternalTags } from './message';

const TITLE_MAX_LENGTH = 100;

export type ConversationTitleLine = {
  inbound?: boolean;
  text?: string;
};

const insignificantPhrases = [
  'hello',
  'hi',
  'hey',
  'good morning',
  'good afternoon',
  'good evening',
  'thanks',
  'thank you',
  'thx',
  'tnx',
  'ty',
  'thanks!',
  'thank you!',
  'ok',
  'okay',
  'k',
  'yes',
  'no',
  'yep',
  'nope',
  'yeah',
  'nah',
  'good',
  'great',
  'nice',
  'cool',
  'awesome',
  'perfect',
  'excellent',
  'bye',
  'goodbye',
  'see you',
  'see ya',
  'later',
  'good night',
  'how are you',
  'how are you doing',
  "what's up",
  'sup',
  'please',
  'pls',
  'sorry',
  'excuse me',
  'pardon',
  'i see',
  'i understand',
  'got it',
  'gotcha',
  'understood',
  'continue',
  'go on',
  'tell me more',
  'more',
  'next',
  'start',
  'begin',
  "let's start",
  "let's begin",
  'help',
  'can you help',
  'i need help',
  'test',
  'testing',
  'test message',
  '?',
  '??',
  '???',
  '!',
  '!!',
  '!!!',
  '...',
  '..',
  '.',
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'ciao',
  'salve',
  'buongiorno',
  'buonasera',
  'buonanotte',
  'grazie',
  'grazie mille',
  'grazie!',
  'grazie mille!',
  'va bene',
  'va bene così',
  'perfetto',
  'ottimo',
  'bene',
  'sì',
  'si',
  'certo',
  'certamente',
  'assolutamente',
  'arrivederci',
  'a presto',
  'a dopo',
  'ci vediamo',
  'addio',
  'come stai',
  'come va',
  'tutto bene',
  'che succede',
  'per favore',
  'per piacere',
  'scusa',
  'scusami',
  'mi dispiace',
  'capisco',
  'ho capito',
  'capito',
  'continua',
  'vai avanti',
  'dimmi di più',
  'altro',
  'altro ancora',
  'inizia',
  'iniziamo',
  'comincia',
  'cominciamo',
  'aiuto',
  'puoi aiutarmi',
  'ho bisogno di aiuto',
  'prova',
  'messaggio di prova',
  'un',
  'una',
  'il',
  'la',
  'gli',
  'le',
  'e',
  'o',
  'ma',
  'su',
  'per',
  'di',
  'con',
  'da',
];

const calculateSignificanceScore = (message: string): number => {
  const cleanMessage = message.toLowerCase().trim();

  if (insignificantPhrases.includes(cleanMessage)) {
    return 0;
  }

  const wordCount = cleanMessage
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  if (wordCount < 3) {
    return 0.1;
  }

  if (cleanMessage.length < 5) {
    return 0.1;
  }

  const isQuestion =
    /\?$/.test(cleanMessage) ||
    /^(what|how|why|when|where|who|which|can|could|would|will|do|does|did|is|are|was|were)/.test(
      cleanMessage
    ) ||
    /^(cosa|come|perché|perche|quando|dove|chi|quale|quali|può|puo|potrebbe|vorrebbe|sarà|sara|fa|fai|fanno|è|e|sono|era|erano)/.test(
      cleanMessage
    );

  let score = 0.5;

  if (isQuestion) score += 0.3;
  if (wordCount > 5) score += 0.2;
  if (wordCount > 10) score += 0.2;
  if (wordCount > 20) score -= 0.1;
  if (/\d/.test(cleanMessage)) score += 0.1;
  if (
    /[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]+/.test(
      message
    )
  ) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
};

const truncateTitle = (title: string, maxLength = TITLE_MAX_LENGTH): string => {
  if (title.length <= maxLength) return title;

  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) {
    return `${truncated.substring(0, lastSpace)}...`;
  }
  return `${truncated}...`;
};

/**
 * Short label for a past conversation, same rules as memori-react 8.46.1:
 * the most significant user message, never a backend title.
 */
export const getConversationTitle = ({
  lines,
  truncate = true,
}: {
  title?: string | null;
  lines: ConversationTitleLine[];
  truncate?: boolean;
}): string => {
  const userMessages = lines.filter(line => line.inbound);
  if (userMessages.length === 0) return '';

  const scoredMessages = userMessages.map((msg, index) => {
    const text = stripHTML(stripAllInternalTags(msg.text || ''));
    return {
      text,
      score: calculateSignificanceScore(text),
      index,
    };
  });

  scoredMessages.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.1) {
      return a.index - b.index;
    }
    return b.score - a.score;
  });

  const bestMessage = scoredMessages[0];

  return truncate ? truncateTitle(bestMessage.text) : bestMessage.text;
};
