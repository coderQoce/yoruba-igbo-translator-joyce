
const mongoose = require("mongoose");

const DictionarySchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  definition: { type: String, required: true }
});

module.exports = mongoose.model("Dictionary", DictionarySchema);
