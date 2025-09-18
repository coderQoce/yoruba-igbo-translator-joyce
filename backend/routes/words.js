const express = require('express');
const router = express.Router();
const Word = require('../models/Word');

// -------------------- GET all words --------------------
router.get('/', async (req, res) => {
  try {
    const words = await Word.find().sort({ word: 1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- GET single word by text --------------------
router.get('/:word', async (req, res) => {
  try {
    const word = await Word.findOne({
      word: req.params.word.toLowerCase(),
    });

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json(word);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- Search words --------------------
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const words = await Word.find({
      $or: [
        { word: { $regex: query, $options: 'i' } },
        { 'meanings.tone': { $regex: query, $options: 'i' } },
      ],
    }).sort({ word: 1 });

    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- POST new word --------------------
router.post('/', async (req, res) => {
  try {
    const { word, meanings } = req.body;

    // Validate required fields
    if (!word || !meanings || !Array.isArray(meanings) || meanings.length === 0) {
      return res.status(400).json({
        message: 'Word and at least one meaning are required',
      });
    }

    // Validate each meaning
    for (const meaning of meanings) {
      if (!meaning.tone || !meaning.definition) {
        return res.status(400).json({
          message: 'Each meaning must have both tone and definition',
        });
      }
    }

    const newWord = new Word({
      word: word.toLowerCase(),
      meanings,
    });

    const savedWord = await newWord.save();
    res.status(201).json(savedWord);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Word already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// -------------------- PUT update word --------------------
router.put('/:id', async (req, res) => {
  try {
    const { word, meanings } = req.body;

    if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
      return res.status(400).json({
        message: 'At least one meaning is required',
      });
    }

    const updatedWord = await Word.findByIdAndUpdate(
      req.params.id,
      {
        ...(word && { word: word.toLowerCase() }),
        meanings,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json(updatedWord);
  } catch (error) {
    // ✅ Complete the error handling
    res.status(500).json({ message: error.message });
  }
});

// -------------------- DELETE word --------------------
router.delete('/:id', async (req, res) => {
  try {
    const deletedWord = await Word.findByIdAndDelete(req.params.id);
    if (!deletedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
