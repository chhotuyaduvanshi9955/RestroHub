require('dotenv').config();
const mongoose = require('mongoose');
const Resturants = require('../modals/resturants');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/restruants';

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for image fix migration');

  const all = await Resturants.find({});
  console.log(`Found ${all.length} restaurants, scanning for missing/invalid images...`);

  let updated = 0;
  for (const r of all) {
    let cur = r.img;
    let candidate = null;

    if (typeof cur === 'string' && cur.trim()) {
      // valid string -> skip
      continue;
    }

    // If img is an object with url or path
    if (cur && typeof cur === 'object') {
      if (cur.url && typeof cur.url === 'string' && cur.url.trim()) candidate = cur.url;
      else if (cur.path && typeof cur.path === 'string' && cur.path.trim()) candidate = cur.path;
    }

    // Fallback to cuisine-based Unsplash image
    if (!candidate) {
      if (r.cuisine && typeof r.cuisine === 'string' && r.cuisine.trim()) {
        const term = encodeURIComponent(r.cuisine.trim() + ' food');
        candidate = `https://source.unsplash.com/800x600/?${term}`;
      } else {
        candidate = '/images/nature.jpg';
      }
    }

    // Update and save
    r.img = candidate;
    try {
      await r.save();
      updated++;
      console.log(`Updated ${r._id} -> ${candidate}`);
    } catch (err) {
      console.error(`Failed to update ${r._id}:`, err.message);
    }
  }

  console.log(`Migration complete. Updated ${updated} documents.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});