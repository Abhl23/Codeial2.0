const env = require("./environment");

const mongoose = require("mongoose");

mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in connecting to the db"));

db.once("open", function () {
  console.log("Succesfully connected to the db");
});

module.exports = db;
