import React from 'react';

interface Props {
  result: { igbo: string; english: string };
}

const OutputCard: React.FC<Props> = ({ result }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="output-card">
      <div>
        <strong>Igbo:</strong> {result.igbo}
        <button onClick={() => copyToClipboard(result.igbo)}>Copy</button>
      </div>
      <div>
        <strong>English:</strong> {result.english}
        <button onClick={() => copyToClipboard(result.english)}>Copy</button>
      </div>
    </div>
  );
};

export default OutputCard;
