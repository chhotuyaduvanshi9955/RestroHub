require('dotenv').config();
const mongoose = require('mongoose');
const Resturants = require('../modals/resturants');
const fs = require('fs');
const path = require('path');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/restruants';

async function checkUrl(url, timeoutMs = 6000) {
  try {
    if (!url || typeof url !== 'string') return { ok: false, reason: 'not-string' };
    url = url.trim();
    // Local path
    if (url.startsWith('/') || url.startsWith('images/')) {
      const rel = url.startsWith('/') ? url.slice(1) : url;
      const filePath = path.join(__dirname, '..', 'public', rel);
      if (fs.existsSync(filePath)) return { ok: true, local: true };
      return { ok: false, reason: 'local-missing', path: filePath };
    }

    if (!/^https?:\/\//i.test(url)) return { ok: false, reason: 'unsupported-scheme' };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, { method: 'GET', signal: controller.signal, headers: { Accept: 'image/*' } });
    clearTimeout(id);

    if (!res.ok) return { ok: false, status: res.status, statusText: res.statusText };

    const ct = res.headers.get('content-type') || '';
    if (!/^image\//i.test(ct)) {
      return { ok: false, reason: 'not-image', contentType: ct };
    }

    return { ok: true, status: res.status, contentType: ct };
  } catch (err) {
    return { ok: false, reason: 'fetch-error', message: err.message };
  }
}

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB for image verification');

  const all = await Resturants.find({});
  console.log(`Found ${all.length} restaurants; verifying images...`);

  let tested = 0;
  let updated = 0;
  let failures = 0;
  const details = [];

  for (const r of all) {
    tested++;
    const cur = r.img;
    let candidate = null;

    // Normalize current to string when possible
    let curStr = null;
    if (typeof cur === 'string') curStr = cur.trim();
    else if (cur && typeof cur === 'object') {
      if (cur.url && typeof cur.url === 'string') curStr = cur.url.trim();
      else if (cur.path && typeof cur.path === 'string') curStr = cur.path.trim();
    }

    const res = await checkUrl(curStr);

    if (res.ok) {
      details.push({ id: r._id, ok: true, url: curStr });
      continue;
    }

    failures++;

    // Determine fallback candidate
    if (r.cuisine && typeof r.cuisine === 'string' && r.cuisine.trim()) {
      const term = encodeURIComponent(r.cuisine.trim() + " food");
      candidate = `https://source.unsplash.com/800x600/?${term}`;
    } else {
      candidate = '/images/nature.jpg';
    }

    // Update doc using updateOne to avoid validation errors from incomplete docs
    try {
      const upd = await Resturants.updateOne({ _id: r._id }, { $set: { img: candidate } });
      if (upd.matchedCount || upd.modifiedCount) {
        updated++;
        details.push({ id: r._id, ok: false, url: curStr, replacedWith: candidate, reason: res.reason || res.status || res.message });
        console.log(`Updated ${r._id} -> ${candidate} (reason: ${res.reason || res.status || res.message})`);
      } else {
        console.error(`No match for ${r._id}, update not applied`);
        details.push({ id: r._id, ok: false, url: curStr, error: 'no-match' });
      }
    } catch (err) {
      console.error(`Failed to update ${r._id}: ${err.message}`);
      details.push({ id: r._id, ok: false, url: curStr, error: err.message });
    }
  }

  console.log('--- Verification Complete ---');
  console.log(`Tested: ${tested}, Failures: ${failures}, Updated: ${updated}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});