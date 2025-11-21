// db.js - MongoDB connection
const mongoose = require('mongoose');

const uri = 'mongodb+srv://techbridgeUser:Goddid1%21@cluster0.4zehblv.mongodb.net/techbridgeDB?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
