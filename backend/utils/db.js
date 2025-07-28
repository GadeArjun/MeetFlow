const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error({ error });
  }
};
