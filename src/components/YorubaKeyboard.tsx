import React from 'react';

interface Props {
  onKeyPress: (char: string) => void;
}

const specialKeys = ['ẹ', 'ọ', 'ṣ', 'ń', 'à', 'è', 'ì', 'ò', 'ù'];

const YorubaKeyboard: React.FC<Props> = ({ onKeyPress }) => {
  return (
    <div className="keyboard">
      <p>Yoruba Keyboard:</p>
      <div className="keys">
        {specialKeys.map(char => (
          <button key={char} onClick={() => onKeyPress(char)}>
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YorubaKeyboard;
