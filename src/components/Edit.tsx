import { useState } from 'react';
import axios from 'axios';

const Edit = () => {
  const [searchWord, setSearchWord] = useState('');
  const [result, setResult] = useState<{ igbo: string; english: string } | null>(null);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/words');
      const match = res.data.find((entry: any) => entry.yoruba.toLowerCase() === searchWord.toLowerCase());
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
      <button onClick={handleSearch} className="form-button">
        Search
      </button>

      {result && (
        <div className="edit-fields">
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
          <button onClick={handleUpdate} className="form-button">
            Update Word
          </button>
        </div>
      )}

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default Edit;
