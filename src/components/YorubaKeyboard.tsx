import React, { useState } from 'react';

interface Props {
  onKeyPress: (char: string) => void;
  onDelete?: () => void;
  onSpace?: () => void;
}

const YorubaKeyboard: React.FC<Props> = ({ onKeyPress, onDelete, onSpace }) => {
  const [isUppercase, setIsUppercase] = useState(false);

  const lowercaseRows = [
    ['q', 'w', 'ẹ', 'r', 't', 'y', 'u', 'i', 'o', 'ọ', 'p'],
    ['a', 'ṣ', 's', 'd', 'f', 'g', 'gb', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
    ['à', 'á', 'è', 'é', 'ì', 'í', 'ò', 'ó', 'ù', 'ú', 'ń'],
    ['␣']
  ];

  const uppercaseRows = [
    ['Q', 'W', 'Ẹ', 'R', 'T', 'Y', 'U', 'I', 'O', 'Ọ', 'P'],
    ['A', 'Ṣ', 'S', 'D', 'F', 'G', 'GB', 'H', 'J', 'K', 'L'],
    ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
    ['À', 'Á', 'È', 'É', 'Ì', 'Í', 'Ò', 'Ó', 'Ù', 'Ú', 'Ń'],
    ['␣']
  ];

  const handleClick = (char: string) => {
    if (char === '⇧') {
      setIsUppercase(prev => !prev);
    } else if (char === '⌫') {
      onDelete?.();
    } else if (char === '␣') {
      onSpace?.();
    } else {
      onKeyPress(char);
    }
  };

  const rows = isUppercase ? uppercaseRows : lowercaseRows;

  return (
    <div className="keyboard">
      <p className="keyboard-title">Yorùbá Keyboard:</p>
      <div className="keyboard-container">
        {rows.map((row, rowIndex) => (
          <div className="keyboard-row" key={rowIndex}>
            {row.map((char, keyIndex) => (
              <button
                key={keyIndex}
                className={`key ${char === '⇧' ? 'shift-key' : ''} ${char === '⌫' ? 'delete-key' : ''} ${char === '␣' ? 'space-key' : ''}`}
                onClick={() => handleClick(char)}
              >
                {char === '␣' ? 'Space' : char}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YorubaKeyboard;
