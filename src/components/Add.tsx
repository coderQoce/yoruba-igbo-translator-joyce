import { useState } from 'react';
import axios from 'axios';
import { FaDeleteLeft, FaKeyboard } from 'react-icons/fa6';

type Props = {
  backendUrl: string;
};

// Yoruba Keyboard Layouts
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

const AddWord = ({ backendUrl }: Props) => {
  const [yoruba, setYoruba] = useState('');
  const [igbo, setIgbo] = useState('');
  const [english, setEnglish] = useState('');
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);

  // Submit new word
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/words`, {
        yoruba: yoruba.toLowerCase(),
        igbo,
        english
      });
      setMessage('✅ Word added successfully');
      setYoruba('');
      setIgbo('');
      setEnglish('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Error adding word');
    }
  };

  // Keyboard actions
  const handleKeyboardInput = (key: string) => {
    if (key === 'delete') setYoruba(prev => prev.slice(0, -1));
    else if (key === 'space') setYoruba(prev => prev + ' ');
    else if (key === 'toggle') setIsUppercase(prev => !prev);
    else setYoruba(prev => prev + key);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Word</h2>
      <form onSubmit={handleAdd}>
        <input
          value={yoruba}
          onChange={e => setYoruba(e.target.value)}
          placeholder="Yoruba"
          required
          className="form-input"
        />
        <input
          value={igbo}
          onChange={e => setIgbo(e.target.value)}
          placeholder="Igbo"
          required
          className="form-input"
        />
        <input
          value={english}
          onChange={e => setEnglish(e.target.value)}
          placeholder="English"
          required
          className="form-input"
        />
        <button type="submit" className="form-button">Add Word</button>
      </form>

      <button
        className="toggle-keyboard-btn"
        onClick={() => setShowKeyboard(prev => !prev)}
        style={{ marginTop: '10px' }}
      >
        {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
      </button>

      {showKeyboard && (
        <div className="keyboard">
          {(isUppercase ? uppercaseKeys : lowercaseKeys).map((row, i) => (
            <div className="keyboard-row" key={i}>
              {row.map(key => (
                <button
                  key={key}
                  className="keyboard-key"
                  onClick={() => handleKeyboardInput(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
          <div className="keyboard-row">
            <button className="keyboard-action" onClick={() => handleKeyboardInput('delete')}>
              <FaDeleteLeft />
            </button>
            <button className="keyboard-space" onClick={() => handleKeyboardInput('space')}>
              Space
            </button>
            <button className="keyboard-action" onClick={() => handleKeyboardInput('toggle')}>
              <FaKeyboard />
            </button>
          </div>
        </div>
      )}

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default AddWord;
