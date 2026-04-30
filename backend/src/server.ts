import app from './app';
import mongoose from 'mongoose';
import env from './config/env';

const PORT = Number(env.PORT) || 5000;

async function main() {
  let connected = false;
  try {
    await mongoose.connect(env.MONGODB_URI);
    connected = true;
  } catch (err) {
    console.error('Warning: could not connect to MongoDB. Starting server without DB', err);
  }
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}${connected ? '' : ' (no DB)'}`);
  });
}

main();
