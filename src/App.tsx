import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import AddWord from './components/Add';
import EditWord from './components/Edit';
import './styles/main.css';

const BACKEND_URL = 'https://yoruba-igbo-translator-joyce.onrender.com';

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

function App() {
  const [inputWord, setInputWord] = useState('');
  const [result, setResult] = useState<{ igbo: string; english: string } | null>(null);
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(true);

  // Translate Yoruba → Igbo
  const handleTranslate = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/words`);
      const match = res.data.find(
        (entry: any) => entry.yoruba.toLowerCase() === inputWord.toLowerCase()
      );

      if (match) {
        setResult({ igbo: match.igbo, english: match.english || 'Not available' });
        setMessage('');
      } else {
        setResult({ igbo: 'Not found', english: 'Not found' });
        setMessage('❌ Word not found');
      }
    } catch {
      setMessage('❌ Error fetching dictionary');
    }
  };

  // Keyboard Actions
  const handleKeyPress = (char: string) => setInputWord(prev => prev + char);
  const handleDelete = () => setInputWord(prev => prev.slice(0, -1));
  const handleSpace = () => setInputWord(prev => prev + ' ');
  const toggleCase = () => setIsUpperCase(prev => !prev);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <h1>Yoruba to Igbo Translator</h1>

              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                placeholder="Enter Yoruba word"
                className="form-input"
              />
              <button onClick={handleTranslate} className="form-button">
                Translate
              </button>

              {result && (
                <div className="output-card">
                  <p><strong>Igbo:</strong> {result.igbo}</p>
                  <p><strong>English:</strong> {result.english}</p>
                </div>
              )}

              {message && <p className="form-message">{message}</p>}

              <button
                className="toggle-keyboard-btn"
                onClick={() => setShowKeyboard(prev => !prev)}
              >
                {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
              </button>

              {showKeyboard && (
                <div className="keyboard">
                  {(isUpperCase ? uppercaseKeys : lowercaseKeys).map((row, i) => (
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
                  <div className="keyboard-row">
                    <button className="key special-key" onClick={handleDelete}>⌫</button>
                    <button className="key space-key" onClick={handleSpace}>Space</button>
                    <button className="key special-key" onClick={toggleCase}>⇧</button>
                  </div>
                </div>
              )}
            </div>
          }
        />
        <Route path="/add" element={<AddWord backendUrl={BACKEND_URL} />} />
        <Route path="/edit" element={<EditWord backendUrl={BACKEND_URL} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
