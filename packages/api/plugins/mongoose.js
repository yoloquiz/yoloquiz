import mongoose from 'mongoose';

export default async function mongoosePlugin(app, { mongoUri }) {
  mongoose.set('useCreateIndex', true);

  mongoose.model('Users').syncIndexes();

  await mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}
