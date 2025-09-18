/**
 * Usage:
 *   1. Put a words.json file in backend/data/words.json
 *   2. Run:  npm run import
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Word = require('../models/Word');

dotenv.config();

// ---- 1. Load JSON data ---------------------------------
const filePath = path.join(__dirname, '..', 'data', 'words.json');

if (!fs.existsSync(filePath)) {
  console.error('❌ words.json file not found at /data/words.json');
  process.exit(1);
}

let wordsData;
try {
  const raw = fs.readFileSync(filePath, 'utf-8');
  wordsData = JSON.parse(raw);
  if (!Array.isArray(wordsData)) throw new Error('JSON must be an array');
} catch (err) {
  console.error('❌ Failed to read or parse words.json:', err.message);
  process.exit(1);
}

// ---- 2. Connect to MongoDB ----------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // ---- 3. Clear and import ---------------------------
    await Word.deleteMany();
    console.log('🧹 Existing words removed');

    await Word.insertMany(wordsData);
    console.log(`📥 Imported ${wordsData.length} words successfully!`);

    mongoose.connection.close();
    process.exit();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
