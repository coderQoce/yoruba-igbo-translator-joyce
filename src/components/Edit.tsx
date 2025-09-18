import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Copy, Check, Delete, Keyboard, Space, Search, Save } from 'lucide-react';

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

interface Meaning {
  tone: string;
  definition: string;
}

interface YorubaWord {
  _id?: string;
  word: string;
  meanings: Meaning[];
}

interface ActiveInput {
  type: 'search' | 'tone' | 'definition';
  index?: number;
}

const EditWord = ({ backendUrl }: Props) => {
  const [searchWord, setSearchWord] = useState('');
  const [result, setResult] = useState<YorubaWord | null>(null);
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<ActiveInput | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const toneInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const definitionInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Search Yoruba word
  const handleSearch = async () => {
    if (!searchWord.trim()) {
      setMessage('⚠️ Please enter a Yoruba word to search');
      return;
    }

    try {
      // For demo purposes, using sample data
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
        }
      ];

      const match = sampleData.find(word => word.word.toLowerCase() === searchWord.toLowerCase());
      
      // Uncomment when backend is ready:
      // const res = await axios.get<YorubaWord[]>(`${backendUrl}/api/yoruba-words`);
      // const match = res.data.find(word => word.word.toLowerCase() === searchWord.toLowerCase());
      
      if (match) {
        setResult({ ...match });
        setMessage('');
      } else {
        setResult(null);
        setMessage('❌ Word not found');
      }
    } catch {
      setMessage('❌ Error fetching dictionary');
    }
  };

  // Update word
  const handleUpdate = async () => {
    if (!result) return;
    try {
      // Filter out empty meanings
      const validMeanings = result.meanings.filter(m => m.tone.trim() && m.definition.trim());
      
      if (validMeanings.length === 0) {
        setMessage('❌ Please keep at least one meaning');
        return;
      }

      // For demo purposes - in real app, this would call your API
      console.log('Updating word:', { ...result, meanings: validMeanings });
      
      // Uncomment when backend is ready:
      // await axios.put(`${backendUrl}/api/yoruba-words/${result._id}`, {
      //   ...result,
      //   meanings: validMeanings
      // });
      
      setMessage('✅ Word updated successfully');
    } catch {
      setMessage('❌ Error updating word');
    }
  };

  // Add a new meaning field
  const addMeaning = () => {
    if (result) {
      setResult({
        ...result,
        meanings: [...result.meanings, { tone: '', definition: '' }]
      });
    }
  };

  // Remove a meaning field
  const removeMeaning = (index: number) => {
    if (result && result.meanings.length > 1) {
      setResult({
        ...result,
        meanings: result.meanings.filter((_, i) => i !== index)
      });
    }
  };

  // Update a meaning field
  const updateMeaning = (index: number, field: keyof Meaning, value: string) => {
    if (result) {
      const newMeanings = [...result.meanings];
      newMeanings[index][field] = value;
      setResult({
        ...result,
        meanings: newMeanings
      });
    }
  };

  // Set active input when focusing on any field
  const handleInputFocus = (type: 'search' | 'tone' | 'definition', index?: number) => {
    setActiveInput({ type, index });
  };

  // Keyboard actions
  const handleKeyboardInput = (key: string) => {
    if (!activeInput) return;

    if (key === 'delete') {
      handleDelete();
    } else if (key === 'space') {
      handleInput(' ');
    } else if (key === 'toggle') {
      setIsUppercase(prev => !prev);
    } else {
      handleInput(key);
    }
  };

  const handleInput = (key: string) => {
    if (!activeInput) return;

    if (activeInput.type === 'search') {
      setSearchWord(prev => prev + key);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (activeInput.type === 'tone' && activeInput.index !== undefined && result) {
      updateMeaning(activeInput.index, 'tone', result.meanings[activeInput.index].tone + key);
      if (toneInputRefs.current[activeInput.index]) {
        toneInputRefs.current[activeInput.index]?.focus();
      }
    } else if (activeInput.type === 'definition' && activeInput.index !== undefined && result) {
      updateMeaning(activeInput.index, 'definition', result.meanings[activeInput.index].definition + key);
      if (definitionInputRefs.current[activeInput.index]) {
        definitionInputRefs.current[activeInput.index]?.focus();
      }
    }
  };

  const handleDelete = () => {
    if (!activeInput) return;

    if (activeInput.type === 'search') {
      setSearchWord(prev => prev.slice(0, -1));
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (activeInput.type === 'tone' && activeInput.index !== undefined && result) {
      const currentTone = result.meanings[activeInput.index].tone;
      updateMeaning(activeInput.index, 'tone', currentTone.slice(0, -1));
      if (toneInputRefs.current[activeInput.index]) {
        toneInputRefs.current[activeInput.index]?.focus();
      }
    } else if (activeInput.type === 'definition' && activeInput.index !== undefined && result) {
      const currentDefinition = result.meanings[activeInput.index].definition;
      updateMeaning(activeInput.index, 'definition', currentDefinition.slice(0, -1));
      if (definitionInputRefs.current[activeInput.index]) {
        definitionInputRefs.current[activeInput.index]?.focus();
      }
    }
  };

  // Set ref callback for tone inputs
  const setToneRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    toneInputRefs.current[index] = el;
  }, []);

  // Set ref callback for definition inputs
  const setDefinitionRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    definitionInputRefs.current[index] = el;
  }, []);

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Yoruba Word</h2>

      <div className="input-group">
        <label htmlFor="search-word">Search Yoruba Word</label>
        <div className="input-with-copy">
          <input
            id="search-word"
            ref={searchInputRef}
            type="text"
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
            onFocus={() => handleInputFocus('search')}
            placeholder="Enter Yoruba word to edit (e.g., Iro, Oko)"
            className="form-input"
          />
          {searchWord && (
            <button 
              type="button"
              className="copy-btn"
              onClick={() => copyToClipboard(searchWord)}
              title="Copy search term"
            >
              {copiedText === searchWord ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleSearch} className="form-button primary">
          <Search size={18} /> Search
        </button>
        
        <button
          className="toggle-keyboard-btn"
          onClick={() => setShowKeyboard(prev => !prev)}
        >
          {showKeyboard ? 'Hide Keyboard' : 'Show Yoruba Keyboard'}
        </button>
      </div>

      {showKeyboard && (
        <div className="keyboard">
          <div className="keyboard-active-info">
            {activeInput ? (
              activeInput.type === 'search' ? 'Typing in: Search field' :
              activeInput.type === 'tone' && activeInput.index !== undefined ? `Typing in: Tone ${activeInput.index + 1}` :
              activeInput.type === 'definition' && activeInput.index !== undefined ? `Typing in: Definition ${activeInput.index + 1}` :
              'Click on any field to type'
            ) : 'Click on any field to type'}
          </div>
          
          {(isUppercase ? uppercaseKeys : lowercaseKeys).map((row, i) => (
            <div className="keyboard-row" key={i}>
              {row.map(key => (
                <button
                  key={key}
                  className="keyboard-key"
                  onClick={() => handleKeyboardInput(key)}
                  type="button"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
          <div className="keyboard-row">
            <button 
              className="key special-key" 
              onClick={() => handleKeyboardInput('delete')}
              type="button"
            >
              <Delete size={18} />
            </button>
            <button 
              className="key space-key" 
              onClick={() => handleKeyboardInput('space')}
              type="button"
            >
              <Space size={18} /> Space
            </button>
            <button 
              className="key special-key" 
              onClick={() => handleKeyboardInput('toggle')}
              type="button"
            >
              <Keyboard size={18} />
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="edit-fields">
          <div className="word-header">
            <h3>Editing: {result.word}</h3>
            <button 
              className="copy-btn"
              onClick={() => copyToClipboard(result.word)}
              title="Copy word"
            >
              {copiedText === result.word ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <div className="meanings-section">
            <div className="section-header">
              <h4>Meanings</h4>
              <button type="button" onClick={addMeaning} className="add-meaning-btn">
                + Add Meaning
              </button>
            </div>
            
            {result.meanings.map((meaning, index) => (
              <div key={index} className="meaning-input-group">
                <div className="meaning-inputs">
                  <div className="input-group">
                    <label>Tone</label>
                    <div className="input-with-copy">
                      <input
                        ref={setToneRef(index)}
                        value={meaning.tone}
                        onChange={e => updateMeaning(index, 'tone', e.target.value)}
                        onFocus={() => handleInputFocus('tone', index)}
                        placeholder="Tone (e.g., Ìró)"
                        className="form-input"
                      />
                      {meaning.tone && (
                        <button 
                          type="button"
                          className="copy-btn small"
                          onClick={() => copyToClipboard(meaning.tone)}
                          title="Copy tone"
                        >
                          {copiedText === meaning.tone ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <label>Definition</label>
                    <input
                      ref={setDefinitionRef(index)}
                      value={meaning.definition}
                      onChange={e => updateMeaning(index, 'definition', e.target.value)}
                      onFocus={() => handleInputFocus('definition', index)}
                      placeholder="Definition (e.g., News)"
                      className="form-input"
                    />
                  </div>
                </div>
                
                {result.meanings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeaning(index)}
                    className="remove-meaning-btn"
                    title="Remove meaning"
                  >
                    <Delete size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={handleUpdate} className="form-button primary">
            <Save size={18} /> Update Word
          </button>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default EditWord;