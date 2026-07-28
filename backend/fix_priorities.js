const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Theme = require('./models/Theme');

dotenv.config();

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const res1 = await Theme.updateMany({ priority: 0 }, { priority: 999 });
  const res2 = await Theme.updateMany({ priority: { $exists: false } }, { priority: 999 });
  console.log('Updated themes (was 0):', res1.modifiedCount);
  console.log('Updated themes (missing):', res2.modifiedCount);
  process.exit(0);
}
fix();
