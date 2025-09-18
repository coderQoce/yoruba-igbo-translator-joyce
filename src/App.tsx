import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import Navbar from './components/Navbar';
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
  ['á', 'à', 'ā', 'é', 'è', 'ē', 'ẹ́', 'Ẹ̀', 'Ẹ̄', 'í', 'ì', 'ī'],
  ['ó', 'ò', 'ō', 'ọ́', 'ọ̀', 'ọ̄', 'ú', 'ù', 'ū']
];


interface Meaning {
  tone: string;
  definition: string;
}

interface YorubaWord {
  _id?: string;
  word: string;
  meanings: Meaning[];
}

function App() {
  const [inputWord, setInputWord] = useState('');
  const [result, setResult] = useState<YorubaWord | null>(null);
  const [homonyms, setHomonyms] = useState<YorubaWord[]>([]);
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(true);
  const [dictionary, setDictionary] = useState<YorubaWord[]>([]);
  const [highlightedWord, setHighlightedWord] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sample data  for demonstration
  const sampleData: YorubaWord[] = [
    {
      word: 'Iro',
      meanings: [
        { tone: 'Irọ́', definition: 'Lying' },
        { tone: 'Irọ̀', definition: 'Mate' },
        { tone: 'Ìró', definition: 'News' },
        { tone: 'Ìró', definition: 'Sound' },
        { tone: 'Ìrò', definition: 'Wrapper' }
      ]
    },
    {
      word: 'Oko',
      meanings: [
        { tone: 'Ọkọ', definition: 'Husband' },
        { tone: 'Ọkọ̀', definition: 'Vehicle' },
        { tone: 'Òkò', definition: 'Stone' },
        { tone: 'Òkó', definition: 'Penis' }
      ]
    },
    {
      word: 'Owe',
      meanings: [
        { tone: 'Ọwé', definition: 'Loan' },
        { tone: 'Ọwè', definition: 'Crevice' },
        { tone: 'Òwe', definition: 'Proverb' }
      ]
    },
    {
      word: 'Omo',
      meanings: [
        { tone: 'Ọmọ', definition: 'Child' },
        { tone: 'Ọmọ́', definition: 'Wet' },
        { tone: 'Ọmò', definition: 'Knowledge' }
      ]
    }
  ];

  // Fetch all dictionary entries on component mount
  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        // For now, using sample data since backend might not have the new structure
        setDictionary(sampleData);
       
        
        // Uncomment when backend is ready:
        // const res = await axios.get(`${BACKEND_URL}/api/yoruba-words`);
        // setDictionary(res.data);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
        setDictionary(sampleData); // Fallback to sample data
        setMessage('⚠️ Using sample data - Backend not configured yet');
      }
    };

    fetchDictionary();
  }, []);

  // Get highlighted text from the page
  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        setHighlightedWord(selectedText);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Search for Yoruba word and its homonyms
  const handleSearch = async () => {
    if (!inputWord.trim()) {
      setMessage('⚠️ Please enter a Yoruba word');
      return;
    }

    try {
      // Find exact word match
      const match = dictionary.find(
        (entry: YorubaWord) => entry.word.toLowerCase() === inputWord.toLowerCase()
      );

      if (match) {
        setResult(match);
        setMessage('');

        // Find other words with similar base (homonyms)
        const baseWord = inputWord.toLowerCase().replace(/[^a-zẹ́ẹ̀ẹ̄ọ́ọ̀ọ̄áàāéèēíìīóòōúùū]/g, '');
        const homonymMatches = dictionary
          .filter(entry => 
            entry.word.toLowerCase() !== inputWord.toLowerCase() &&
            entry.word.toLowerCase().includes(baseWord)
          )
          .slice(0, 5); // Limit to 5 homonyms
        
        setHomonyms(homonymMatches);
      } else {
        setResult(null);
        setHomonyms([]);
        setMessage('❌ Word not found in dictionary');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('❌ Error during search');
    }
  };

  // Search for highlighted word
  const handleSearchHighlighted = async () => {
    if (!highlightedWord) {
      setMessage('⚠️ Please highlight a word first');
      return;
    }

    setInputWord(highlightedWord);
    
    try {
      // Find exact word match
      const match = dictionary.find(
        (entry: YorubaWord) => entry.word.toLowerCase() === highlightedWord.toLowerCase()
      );

      if (match) {
        setResult(match);
        setMessage('');

        // Find other words with similar base (homonyms)
        const baseWord = highlightedWord.toLowerCase().replace(/[^a-zẹ́ẹ̀ẹ̄ọ́ọ̀ọ̄áàāéèēíìīóòōúùū]/g, '');
        const homonymMatches = dictionary
          .filter(entry => 
            entry.word.toLowerCase() !== highlightedWord.toLowerCase() &&
            entry.word.toLowerCase().includes(baseWord)
          )
          .slice(0, 5);
        
        setHomonyms(homonymMatches);
      } else {
        setResult(null);
        setHomonyms([]);
        setMessage('❌ Highlighted word not found in dictionary');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('❌ Error searching for highlighted word');
    }
  };

  // Replace highlighted text with selected homonym
  const replaceHighlightedText = (homonymWord: string) => {
    if (!highlightedWord) return;
    
    // Get the current input value
    const currentInput = inputWord;
    
    // Replace the highlighted word with the selected homonym
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(homonymWord));
      
      // Update the input field with the new value
      setInputWord(currentInput.replace(highlightedWord, homonymWord));
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
              <h1>Yoruba Homonyms Explorer</h1>
              <p className="app-subtitle">Discover the different tones and meanings of Yoruba words</p>

              <div className="input-group">
                <input
                  type="text"
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  placeholder="Enter Yoruba word (e.g., Iro, Oko)"
                  className="form-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="form-button primary">
                  Search
                </button>
              </div>

              <div className="button-group">
                <button
                  className="toggle-keyboard-btn"
                  onClick={() => setShowKeyboard(prev => !prev)}
                >
                  {showKeyboard ? 'Hide Keyboard' : 'Show Yoruba Keyboard'}
                </button>
                
                <button
                  className="search-highlight-btn"
                  onClick={handleSearchHighlighted}
                  disabled={!highlightedWord}
                  title={highlightedWord ? `Search for "${highlightedWord}"` : 'Highlight a word to search'}
                >
                  Search Highlighted Word
                </button>
              </div>

              {highlightedWord && (
                <div className="highlight-info">
                  <small>Highlighted: "{highlightedWord}"</small>
                </div>
              )}

              {result && (
                <div className="output-card">
                  <div className="word-header">
                    <h3>Word: {result.word}</h3>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(result.word)}
                      title="Copy word"
                    >
                      {copiedText === result.word ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="meanings-list">
                    {result.meanings.map((meaning, index) => (
                      <div key={index} className="meaning-item">
                        <div className="meaning-header">
                          <span className="tone">{meaning.tone}</span>
                          <button 
                            className="copy-btn small"
                            onClick={() => copyToClipboard(meaning.tone)}
                            title="Copy tone"
                          >
                            {copiedText === meaning.tone ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <span className="definition">{meaning.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {homonyms.length > 0 && (
                <div className="homonyms-section">
                  <h3>Related Homonyms</h3>
                  <div className="homonyms-grid">
                    {homonyms.map((homonym, index) => (
                      <div 
                        key={index} 
                        className="homonym-card"
                        onClick={() => replaceHighlightedText(homonym.word)}
                      >
                        <div className="homonym-header">
                          <div className="homonym-word">{homonym.word}</div>
                          <button 
                            className="copy-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(homonym.word);
                            }}
                            title="Copy word"
                          >
                            {copiedText === homonym.word ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <div className="homonym-meanings">
                          {homonym.meanings.slice(0, 2).map((meaning, idx) => (
                            <div key={idx} className="homonym-meaning">
                              <div className="meaning-header">
                                <span className="tone">{meaning.tone}</span>
                                <button 
                                  className="copy-btn small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(meaning.tone);
                                  }}
                                  title="Copy tone"
                                >
                                  {copiedText === meaning.tone ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                              </div>
                              <span className="definition">{meaning.definition}</span>
                            </div>
                          ))}
                          {homonym.meanings.length > 2 && (
                            <div className="more-meanings">+{homonym.meanings.length - 2} more meanings</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message && <div className="message">{message}</div>}

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
       
      </Routes>
    </Router>
  );
}

export default App;