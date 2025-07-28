import React from 'react';

interface Props {
  input: string;
  setInput: (val: string) => void;
  onSubmit: () => void;
}

const InputForm: React.FC<Props> = ({ input, setInput, onSubmit }) => {
  return (
    <div className="input-form">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter Yoruba word"
      />
      <button onClick={onSubmit}>Translate</button>
    </div>
  );
};

export default InputForm;
