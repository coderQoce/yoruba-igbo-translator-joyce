import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import dictionary from './data/dictionary.json';
import InputForm from './components/InputForm';
import OutputCard from './components/OutputCard';
import YorubaKeyboard from './components/YorubaKeyboard';
import Navbar from './components/Navbar';
import About from './components/About';

import './styles/main.css';

function Home() {
  const [inputWord, setInputWord] = useState('');
  const [result, setResult] = useState<{ igbo: string; english: string } | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

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

  const handleKeyboardInput = (char: string) => setInputWord(prev => prev + char);
  const handleDelete = () => setInputWord(prev => prev.slice(0, -1));
  const handleSpace = () => setInputWord(prev => prev + ' ');

  return (
    <div className="app">
      <h1>Yoruba to Igbo Translator</h1>
      <InputForm input={inputWord} setInput={setInputWord} onSubmit={handleTranslate} />
      {result && <OutputCard result={result} />}

      <div style={{ textAlign: 'center', margin: '1rem' }}>
        <button className="toggle-keyboard-btn" onClick={() => setShowKeyboard(prev => !prev)}>
          {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
        </button>
      </div>

      {showKeyboard && (
        <YorubaKeyboard
          onKeyPress={handleKeyboardInput}
          onDelete={handleDelete}
          onSpace={handleSpace}
        />
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
      </Routes>
    </Router>
  );
}

export default App;
