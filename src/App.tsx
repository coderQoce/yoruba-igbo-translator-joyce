import { useState } from 'react';
import dictionary from './data/dictionary.json';
import InputForm from './components/InputForm';
import OutputCard from './components/OutputCard';
import YorubaKeyboard from './components/YorubaKeyboard';
import './styles/main.css';

function App() {
  const [inputWord, setInputWord] = useState('');
  const [result, setResult] = useState<{ igbo: string; english: string } | null>(null);

  const handleTranslate = () => {
    const match = dictionary.find(entry => entry.yoruba.toLowerCase() === inputWord.toLowerCase());
    setResult(match ? { igbo: match.igbo, english: match.english } : { igbo: 'Not found', english: 'Not found' });
  };

  const handleKeyboardInput = (char: string) => {
    setInputWord(prev => prev + char);
  };

  return (
    <div className="app">
      <h1>Yoruba to Igbo Translator</h1>
      <InputForm input={inputWord} setInput={setInputWord} onSubmit={handleTranslate} />
      <YorubaKeyboard onKeyPress={handleKeyboardInput} />
      {result && <OutputCard result={result} />}
    </div>
  );
}

export default App;
