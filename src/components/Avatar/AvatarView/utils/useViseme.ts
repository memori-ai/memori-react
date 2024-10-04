import { useState, useCallback } from 'react';

type Viseme = {
  name: string;
  duration: number;
  weight: number;
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
    // Simple mapping of Italian phonemes to visemes
    const phonemeToViseme = (char: string): string => {
      char = char.toUpperCase();
      if ('AEIOU'.includes(char)) return visemeMap[char];
      if ('BP'.includes(char)) return visemeMap['PP'];
      if ('FV'.includes(char)) return visemeMap['FF'];
      if ('TD'.includes(char)) return visemeMap['DD'];
      if ('KG'.includes(char)) return visemeMap['kk'];
      if ('CS'.includes(char)) return visemeMap['SS'];
      if ('NM'.includes(char)) return visemeMap['nn'];
      if (char === 'R') return visemeMap['RR'];
      if (char === 'L') return visemeMap['TH'];
      return visemeMap['sil'];
    };

    const sequence: Viseme[] = [];
    const chars = text.split('');

    chars.forEach((char) => {
      if (char.trim() === '') {
        // Add a brief silence for spaces
        sequence.push({
          name: visemeMap['sil'],
          duration: durationPerPhoneme / 2,
          weight: 1
        });
        return;
      }

      const visemeName = phonemeToViseme(char);
      sequence.push({
        name: visemeName,
        duration: durationPerPhoneme,
        weight: 1
      });
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