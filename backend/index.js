const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_PATH = path.join(__dirname, 'dictionary.json');

// Read dictionary file
function readDictionary() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

// Write to dictionary file
function writeDictionary(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Get all words
app.get('/api/words', (req, res) => {
  const data = readDictionary();
  res.json(data);
});

// Add a new word
app.post('/api/words', (req, res) => {
  const newWord = req.body;
  const data = readDictionary();

  const exists = data.find(entry => entry.yoruba.toLowerCase() === newWord.yoruba.toLowerCase());
  if (exists) return res.status(400).json({ message: 'Word already exists.' });

  data.push(newWord);
  writeDictionary(data);
  res.json({ message: 'Word added successfully.' });
});

// Edit a word
app.put('/api/words/:yoruba', (req, res) => {
  const targetWord = req.params.yoruba.toLowerCase();
  const updatedData = req.body;
  const data = readDictionary();

  const index = data.findIndex(entry => entry.yoruba.toLowerCase() === targetWord);
  if (index === -1) return res.status(404).json({ message: 'Word not found.' });

  data[index] = updatedData;
  writeDictionary(data);
  res.json({ message: 'Word updated successfully.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
