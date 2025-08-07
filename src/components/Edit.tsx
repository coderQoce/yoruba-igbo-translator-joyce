import { useState } from 'react';
import axios from 'axios';
import { FaDeleteLeft } from 'react-icons/fa6';
import { FaKeyboard } from 'react-icons/fa';

const keys = [
  ['A', 'B', 'D', 'E', 'Ẹ', 'F', 'G', 'GB', 'H'],
  ['I', 'Ị', 'J', 'K', 'L', 'M', 'N', 'Ń', 'O'],
  ['Ọ', 'P', 'R', 'S', 'Ṣ', 'T', 'U', 'Ụ', 'W', 'Y'],
  ['́', '̀', '̂']
];

const Edit = () => {
  const [searchWord, setSearchWord] = useState('');
  const [result, setResult] = useState<{ igbo: string; english: string } | null>(null);
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/words');
      const match = res.data.find(
        (entry: any) => entry.yoruba.toLowerCase() === searchWord.toLowerCase()
      );
      if (match) {
        setResult({ igbo: match.igbo, english: match.english });
        setMessage('');
      } else {
        setResult(null);
        setMessage('❌ Word not found');
      }
    } catch (err) {
      setMessage('❌ Error fetching dictionary');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/words/${searchWord}`, {
        yoruba: searchWord,
        igbo: result?.igbo,
        english: result?.english,
      });
      setMessage('✅ Word updated');
    } catch (err) {
      setMessage('❌ Error updating word');
    }
  };

  const handleKeyboardInput = (key: string) => {
    if (key === 'delete') {
      setSearchWord((prev) => prev.slice(0, -1));
    } else if (key === 'space') {
      setSearchWord((prev) => prev + ' ');
    } else if (key === 'toggle') {
      setIsUppercase((prev) => !prev);
    } else {
      setSearchWord((prev) => prev + key);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Word</h2>

      <input
        type="text"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        placeholder="Search Yoruba word"
        className="form-input"
      />
      <button onClick={handleSearch} className="forms-button">Search</button>

      <button
        onClick={() => setShowKeyboard((prev) => !prev)}
        className="forms-button"
        style={{ marginTop: '10px' }}
      >
        {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
      </button>

      {showKeyboard && (
        <div className="keyboard">
          {keys.map((row, i) => (
            <div className="keyboard-row" key={i}>
              {row.map((key) => (
                <button
                  key={key}
                  className="keyboard-key"
                  onClick={() => handleKeyboardInput(isUppercase ? key : key.toLowerCase())}
                >
                  {isUppercase ? key : key.toLowerCase()}
                </button>
              ))}
            </div>
          ))}
          <div className="keyboard-row">
            <button className="keyboard-action" onClick={() => handleKeyboardInput('delete')}>
              <FaDeleteLeft />
            </button>
            <button className="keyboard-space" onClick={() => handleKeyboardInput('space')}>
              space
            </button>
            <button className="keyboard-action" onClick={() => handleKeyboardInput('toggle')}>
              <FaKeyboard />
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="form-fields">
          <input
            type="text"
            value={result.igbo}
            onChange={(e) => setResult({ ...result, igbo: e.target.value })}
            placeholder="Igbo"
            className="form-input"
          />
          <input
            type="text"
            value={result.english}
            onChange={(e) => setResult({ ...result, english: e.target.value })}
            placeholder="English"
            className="form-input"
          />
          <button onClick={handleUpdate} className="forms-button">Update Word</button>
        </div>
      )}

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default Edit;
