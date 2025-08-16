require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const DictionarySchema = new mongoose.Schema({
  yoruba: { type: String, required: true, unique: true },
  igbo: { type: String, required: true },
  english: { type: String, required: true },
});

const Dictionary = mongoose.model("Dictionary", DictionarySchema);

// GET all words
app.get("/api/words", async (req, res) => {
  try {
    const words = await Dictionary.find();
    res.json(words);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch words" });
  }
});

// POST a new word
app.post("/api/words", async (req, res) => {
  try {
    const newWord = {
      yoruba: req.body.yoruba.toLowerCase(),
      igbo: req.body.igbo,
      english: req.body.english,
    };

    const exists = await Dictionary.findOne({ yoruba: newWord.yoruba });
    if (exists) {
      return res.status(400).json({ message: "Word already exists." });
    }

    const word = new Dictionary(newWord);
    await word.save();
    res.json({ message: "Word added successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to add word" });
  }
});

// PUT update a word
app.put("/api/words/:yoruba", async (req, res) => {
  try {
    const targetWord = req.params.yoruba.toLowerCase();
    const updatedData = {
      yoruba: req.body.yoruba?.toLowerCase() || targetWord,
      igbo: req.body.igbo,
      english: req.body.english,
    };

    const updatedWord = await Dictionary.findOneAndUpdate(
      { yoruba: targetWord },
      updatedData,
      { new: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: "Word not found." });
    }

    res.json({ message: "Word updated successfully.", word: updatedWord });
  } catch (err) {
    res.status(500).json({ error: "Failed to update word" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
