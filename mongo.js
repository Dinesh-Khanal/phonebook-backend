const mongoose = require("mongoose");

let req;
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
} else if (process.argv.length === 3) {
  req = "fetch";
} else if (process.argv.length === 5) {
  req = "post";
} else {
  console.log("Provide name and number as an argurmnt");
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://dinesh:${password}@nodejscluster.pt0ox.mongodb.net/phonebook-db?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);
mongoose
  .connect(url)
  .then((result) => {
    if (req === "post") {
      const person = new Person({
        name,
        number,
      });
      person.save().then((result) => {
        console.log(`added ${name} ${number} to phonebook.`);
        mongoose.connection.close();
      });
    } else if (req === "fetch") {
      Person.find({}).then((result) => {
        console.log("Phonebook:");
        result.forEach((p) => {
          console.log(`${p.name} ${p.number}`);
        });
        mongoose.connection.close();
      });
    }
  })
  .catch((err) => console.log(err));
