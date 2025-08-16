require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const DictionarySchema = new mongoose.Schema({
  yoruba: { type: String, required: true, unique: true },
  igbo: { type: String, required: true },
  english: { type: String, required: true },
});

const Dictionary = mongoose.model("Dictionary", DictionarySchema);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    const data = JSON.parse(fs.readFileSync("dictionary.json", "utf-8"));

    // Prepare bulk operations
    const bulkOps = data.map((entry) => ({
      updateOne: {
        filter: { yoruba: entry.yoruba.toLowerCase() },
        update: {
          $set: {
            yoruba: entry.yoruba.toLowerCase(),
            igbo: entry.igbo,
            english: entry.english,
          },
        },
        upsert: true, // Insert if not exists
      },
    }));

    try {
      await Dictionary.bulkWrite(bulkOps);
      console.log("📚 Words imported successfully! All duplicates overwritten.");
    } catch (err) {
      console.error("❌ Error importing words:", err.message);
    }

    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Connection error:", err));
