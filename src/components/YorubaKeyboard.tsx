import React, { useState } from 'react';


interface YorubaKeyboardProps {
  onKeyPress: (char: string) => void;
}

const YorubaKeyboard: React.FC<YorubaKeyboardProps> = ({ onKeyPress }) => {
  const [isUppercase, setIsUppercase] = useState(true);

  const uppercaseKeys = [
    ['A', 'B', 'D', 'E', 'Ẹ', 'F', 'G', 'GB', 'H', 'I', 'J', 'K', 'L', 'M'],
    ['N', 'O', 'Ọ', 'P', 'R', 'S', 'Ṣ', 'T', 'U', 'W', 'Y'],
    ['Á', 'À', 'Ā', 'É', 'È', 'Ē', 'Ẹ́', 'Ẹ̀', 'Ẹ̄', 'Í', 'Ì', 'Ī'],
    ['Ó', 'Ò', 'Ō', 'Ọ́', 'Ọ̀', 'Ọ̄', 'Ú', 'Ù', 'Ū']
  ];

  const lowercaseKeys = [
    ['a', 'b', 'd', 'e', 'ẹ', 'f', 'g', 'gb', 'h', 'i', 'j', 'k', 'l', 'm'],
    ['n', 'o', 'ọ', 'p', 'r', 's', 'ṣ', 't', 'u', 'w', 'y'],
    ['á', 'à', 'ā', 'é', 'è', 'ē', 'ẹ́', 'ẹ̀', 'ẹ̄', 'í', 'ì', 'ī'],
    ['ó', 'ò', 'ō', 'ọ́', 'ọ̀', 'ọ̄', 'ú', 'ù', 'ū']
  ];

  const currentKeys = isUppercase ? uppercaseKeys : lowercaseKeys;

  const handleKeyPress = (char: string) => {
    onKeyPress(char);
  };

  const toggleCase = () => setIsUppercase(prev => !prev);

  return (
    <div className="yoruba-keyboard-wrapper">
      <h3 className="keyboard-header">Yorùbá Keyboard</h3>
      <div className="keyboard-rows">
        {currentKeys.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className="keyboard-key"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="keyboard-row control-row">
          <button className="keyboard-key shift" onClick={toggleCase}>⇧</button>
          <button className="keyboard-key space" onClick={() => handleKeyPress(' ')}>Space</button>
          <button className="keyboard-key delete" onClick={() => onKeyPress('delete')}>⌫</button>
        </div>
      </div>
    </div>
  );
};

export default YorubaKeyboard;
