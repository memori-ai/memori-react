import { useState, useCallback } from 'react';

type Viseme = {
  name: string;
  duration: number;
  weight: number;
  startTime: number;
};

export const useViseme = () => {
  const [currentVisemes, setCurrentVisemes] = useState<Viseme[]>([]);

  const visemeMap: { [key: string]: string } = {
    'A': 'viseme_aa',
    'E': 'viseme_E',
    'I': 'viseme_I',
    'O': 'viseme_O',
    'U': 'viseme_U',
    'PP': 'viseme_PP',
    'FF': 'viseme_FF',
    'TH': 'viseme_TH',
    'DD': 'viseme_DD',
    'kk': 'viseme_kk',
    'CH': 'viseme_CH',
    'SS': 'viseme_SS',
    'nn': 'viseme_nn',
    'RR': 'viseme_RR',
    'sil': 'viseme_sil',
  };

  const createVisemeSequence = useCallback((text: string, durationPerPhoneme: number = 0.1) => {
    // Improved mapping of Italian phonemes to visemes
    const phonemeToViseme = (char: string): string => {
      char = char.toUpperCase();
      if ('AEIOU'.includes(char)) return visemeMap[char];
      if ('BP'.includes(char)) return visemeMap['PP'];
      if ('FV'.includes(char)) return visemeMap['FF'];
      if ('TD'.includes(char)) return visemeMap['DD'];
      if ('KG'.includes(char)) return visemeMap['kk'];
      if ('CSZ'.includes(char)) return visemeMap['SS'];
      if ('NM'.includes(char)) return visemeMap['nn'];
      if ('RL'.includes(char)) return visemeMap['RR'];
      if ('GN'.includes(char)) return visemeMap['nn'];
      if ('GL'.includes(char)) return visemeMap['TH'];
      return visemeMap['sil'];
    };

    let startTime = 0;
    const sequence: Viseme[] = [];
    const chars = text.split('');

    chars.forEach((char, index) => {
      if (char.trim() === '') {
        // Add a brief silence for spaces
        sequence.push({
          name: visemeMap['sil'],
          duration: durationPerPhoneme / 2,
          weight: 1,
          startTime,
        });
        startTime += durationPerPhoneme / 2;
        return;
      }

      const visemeName = phonemeToViseme(char);
      const nextChar = chars[index + 1];
      const isLastChar = index === chars.length - 1;

      // Adjust duration and weight based on surrounding characters
      let duration = durationPerPhoneme;
      let weight = 0.8;

      if (!isLastChar && nextChar && phonemeToViseme(nextChar) === visemeName) {
        duration *= 1.5; // Lengthen duration for consecutive same visemes
      } else if (visemeName === visemeMap['sil']) {
        duration *= 0.5; // Shorten duration for silence
        weight = 0.5;
      }

      sequence.push({
        name: visemeName,
        duration,
        weight,
        startTime,
      });
      startTime += duration;
    });

    // Add a final silence
    sequence.push({
      name: visemeMap['sil'],
      duration: durationPerPhoneme / 2,
      weight: 0.5,
      startTime,
    });

    setCurrentVisemes(sequence);
    return sequence;
  }, []);

  const clearVisemes = useCallback(() => {
    setCurrentVisemes([]);
  }, []);

  

  return {
    currentVisemes,
    createVisemeSequence,
    clearVisemes
  };
};