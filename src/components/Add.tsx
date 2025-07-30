import { useState } from 'react';
import axios from 'axios';

const Add = () => {
  const [yoruba, setYoruba] = useState('');
  const [igbo, setIgbo] = useState('');
  const [english, setEnglish] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/words', {
        yoruba,
        igbo,
        english
      });
      setMessage('✅ Word added successfully');
      setYoruba('');
      setIgbo('');
      setEnglish('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '❌ Error adding word';
      setMessage(errorMsg);
    }
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
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default Add;
