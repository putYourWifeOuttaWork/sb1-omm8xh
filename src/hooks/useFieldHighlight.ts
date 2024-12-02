import { useState, useEffect } from 'react';

export function useFieldHighlight(fieldSequence: string[]) {
  const [highlightedField, setHighlightedField] = useState<string>(fieldSequence[0]);

  const moveToNextField = (currentField: string) => {
    const currentIndex = fieldSequence.indexOf(currentField);
    if (currentIndex < fieldSequence.length - 1) {
      setHighlightedField(fieldSequence[currentIndex + 1]);
    } else {
      setHighlightedField('');
    }
  };

  useEffect(() => {
    // Start with the first field highlighted
    setHighlightedField(fieldSequence[0]);
  }, []);

  return {
    highlightedField,
    moveToNextField
  };
}