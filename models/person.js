/* eslint-disable no-undef */
const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  // eslint-disable-next-line no-unused-vars
  .then((result) => {
    console.log("connected to MongoDb");
  })
  .catch((err) => {
    console.log("error connecting to MongoDb:", err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 3,
    unique: [true, "name should be unique"],
  },
  number: {
    type: String,
    require: true,
    minlength: [8, "Minimum length should be at least 8 character"],
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Person", personSchema);
