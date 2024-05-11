const mongoose = require("mongoose");


const dbConnect = () => {
    try {
      const  connection = mongoose.connect(process.env.MONGODB_URI);
      console.log("Database Connection is Successful!");
  } catch (error) {
    console.error(error)
  }
}

module.exports = dbConnect