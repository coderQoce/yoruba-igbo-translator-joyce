import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

interface Props {
  result: { igbo: string; english: string };
}

const OutputCard = ({ result }: Props) => {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="output-card">
      <div className="output-item">
        <span className="output-label">Igbo:</span>
        <span className="output-text">{result.igbo}</span>
        <button
          className="copy-btn"
          onClick={() => copyToClipboard(result.igbo, 'Igbo')}
          title="Copy Igbo"
        >
          <FiCopy size={18} />
        </button>
      </div>
      <div className="output-item">
        <span className="output-label">English:</span>
        <span className="output-text">{result.english}</span>
        <button
          className="copy-btn"
          onClick={() => copyToClipboard(result.english, 'English')}
          title="Copy English"
        >
          <FiCopy size={18} />
        </button>
      </div>
      {copied && <div className="copied-message">{copied} copied!</div>}
    </div>
  );
};

export default OutputCard;
