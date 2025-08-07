import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import dictionary from '../backend/dictionary.json';
import InputForm from './components/InputForm';
import OutputCard from './components/OutputCard';
import Navbar from './components/Navbar';
import About from './components/About';
import AddWord from './components/Add';
import EditWord from './components/Edit';

import './styles/main.css';

function Home() {
  const [inputWord, setInputWord] = useState('');
  const [result, setResult] = useState<{ igbo: string; english: string } | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(true);

  const handleTranslate = () => {
    const match = dictionary.find(
      entry => entry.yoruba.toLowerCase() === inputWord.toLowerCase()
    );
    setResult(
      match
        ? { igbo: match.igbo, english: match.english }
        : { igbo: 'Not found', english: 'Not found' }
    );
  };

  const handleKeyPress = (char: string) => {
    setInputWord(prev => prev + char);
  };

  const handleDelete = () => {
    setInputWord(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setInputWord(prev => prev + ' ');
  };

  const toggleCase = () => {
    setIsUpperCase(prev => !prev);
  };

  const keys = [
    ['A', 'B', 'D', 'E', 'Ẹ', 'F', 'G', 'GB', 'H'],
    ['I', 'Ị', 'J', 'K', 'L', 'M', 'N', 'Ń', 'O'],
    ['Ọ', 'P', 'R', 'S', 'Ṣ', 'T', 'U', 'Ụ', 'W', 'Y'],
    ['́', '̀', '̂'] // Accents row
  ];

  const renderKey = (key: string) => (
    <button
      key={key}
      className="key"
      onClick={() => handleKeyPress(isUpperCase ? key : key.toLowerCase())}
    >
      {isUpperCase ? key : key.toLowerCase()}
    </button>
  );

  return (
    <div className="app">
      <h1>Yoruba to Igbo Language Translator</h1>

      <InputForm input={inputWord} setInput={setInputWord} onSubmit={handleTranslate} />

      {result && <OutputCard result={result} />}

      <div className="keyboard-toggle-container">
        <button
          className="toggle-keyboard-btn"
          onClick={() => setShowKeyboard(prev => !prev)}
        >
          {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
        </button>
      </div>

      {showKeyboard && (
        <div className="keyboard">
          {keys.map((row, index) => (
            <div key={index} className="keyboard-row">
              {row.map(renderKey)}
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
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/add" element={<AddWord />} />
        <Route path="/edit" element={<EditWord />} />
      </Routes>
    </Router>
  );
}

export default App;
