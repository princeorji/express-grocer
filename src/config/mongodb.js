const mongoose = require('mongoose');
const env = require('../utils/venv');

const mongoURI = env.DATABASE;

const connectdb = async () => {
  try {
    mongoose.connect(mongoURI);
    console.log('Connection established successfully 🥳');
  } catch (error) {
    console.error(error);
  }
};

// database connection
connectdb();
