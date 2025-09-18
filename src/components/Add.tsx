import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Copy, Check, Delete, Keyboard, Space } from 'lucide-react';

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
  ['á', 'à', 'ā', 'é', 'è', 'ē', 'ẹ́', 'ẹ̀', 'Ẹ̄', 'í', 'ì', 'ī'],
  ['ó', 'ò', 'ō', 'ọ́', 'ọ̀', 'ọ̄', 'ú', 'ù', 'ū']
];

interface Meaning {
  tone: string;
  definition: string;
}

interface ActiveInput {
  type: 'word' | 'tone' | 'definition';
  index?: number;
}

const AddWord = ({ backendUrl }: Props) => {
  const [word, setWord] = useState('');
  const [meanings, setMeanings] = useState<Meaning[]>([{ tone: '', definition: '' }]);
  const [message, setMessage] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<ActiveInput | null>(null);
  
  const wordInputRef = useRef<HTMLInputElement>(null);
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

  // Submit new word
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty meanings
      const validMeanings = meanings.filter(m => m.tone.trim() && m.definition.trim());
      
      if (validMeanings.length === 0) {
        setMessage('❌ Please add at least one meaning');
        return;
      }

      await axios.post(`${backendUrl}/api/yoruba-words`, {
        word: word.trim(),
        meanings: validMeanings
      });
      setMessage('✅ Word added successfully');
      setWord('');
      setMeanings([{ tone: '', definition: '' }]);
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Error adding word');
    }
  };

  // Add a new meaning field
  const addMeaning = () => {
    setMeanings([...meanings, { tone: '', definition: '' }]);
  };

  // Remove a meaning field
  const removeMeaning = (index: number) => {
    if (meanings.length > 1) {
      setMeanings(meanings.filter((_, i) => i !== index));
    }
  };

  // Update a meaning field
  const updateMeaning = (index: number, field: keyof Meaning, value: string) => {
    const newMeanings = [...meanings];
    newMeanings[index][field] = value;
    setMeanings(newMeanings);
  };

  //  active input when focusing on any field
  const handleInputFocus = (type: 'word' | 'tone' | 'definition', index?: number) => {
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

    if (activeInput.type === 'word') {
      setWord(prev => prev + key);
      if (wordInputRef.current) {
        wordInputRef.current.focus();
      }
    } else if (activeInput.type === 'tone' && activeInput.index !== undefined) {
      updateMeaning(activeInput.index, 'tone', meanings[activeInput.index].tone + key);
      if (toneInputRefs.current[activeInput.index]) {
        toneInputRefs.current[activeInput.index]?.focus();
      }
    } else if (activeInput.type === 'definition' && activeInput.index !== undefined) {
      updateMeaning(activeInput.index, 'definition', meanings[activeInput.index].definition + key);
      if (definitionInputRefs.current[activeInput.index]) {
        definitionInputRefs.current[activeInput.index]?.focus();
      }
    }
  };

  const handleDelete = () => {
    if (!activeInput) return;

    if (activeInput.type === 'word') {
      setWord(prev => prev.slice(0, -1));
      if (wordInputRef.current) {
        wordInputRef.current.focus();
      }
    } else if (activeInput.type === 'tone' && activeInput.index !== undefined) {
      const currentTone = meanings[activeInput.index].tone;
      updateMeaning(activeInput.index, 'tone', currentTone.slice(0, -1));
      if (toneInputRefs.current[activeInput.index]) {
        toneInputRefs.current[activeInput.index]?.focus();
      }
    } else if (activeInput.type === 'definition' && activeInput.index !== undefined) {
      const currentDefinition = meanings[activeInput.index].definition;
      updateMeaning(activeInput.index, 'definition', currentDefinition.slice(0, -1));
      if (definitionInputRefs.current[activeInput.index]) {
        definitionInputRefs.current[activeInput.index]?.focus();
      }
    }
  };

  // callback for tone inputs
  const setToneRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    toneInputRefs.current[index] = el;
  }, []);

  // callback for definition inputs
  const setDefinitionRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    definitionInputRefs.current[index] = el;
  }, []);

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Yoruba Word</h2>
      <form onSubmit={handleAdd} className="word-form">
        <div className="input-group">
          <label htmlFor="yoruba-word">Yoruba Word</label>
          <div className="input-with-copy">
            <input
              id="yoruba-word"
              ref={wordInputRef}
              value={word}
              onChange={e => setWord(e.target.value)}
              onFocus={() => handleInputFocus('word')}
              placeholder="Enter Yoruba word (e.g., Iro, Oko)"
              required
              className="form-input"
            />
            {word && (
              <button 
                type="button"
                className="copy-btn"
                onClick={() => copyToClipboard(word)}
                title="Copy word"
              >
                {copiedText === word ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>

        <div className="meanings-section">
          <div className="section-header">
            <h3>Meanings</h3>
            <button type="button" onClick={addMeaning} className="add-meaning-btn">
              + Add Meaning
            </button>
          </div>
          
          {meanings.map((meaning, index) => (
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
              
              {meanings.length > 1 && (
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

        <button type="submit" className="form-button primary">Add Word</button>
      </form>

      <div className="button-group">
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
              activeInput.type === 'word' ? 'Typing in: Word field' :
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
              <Space size={18} /> 
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

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AddWord;