import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongo connected, party started');
  } catch (error) {
    console.log('oops mongo failed: ', error);
    process.exit(1);
  }
};

export default connectDB;
