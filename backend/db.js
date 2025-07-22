const mongoose = require ('mongoose');
const mongoURI = "mongodb://localhost:27017/Raaj"
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports =  connectToMongo;