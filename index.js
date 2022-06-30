const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.static("build"));

morgan.token("reqbody", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :response-time ms :reqbody"));
app.use(express.json());

app.get("/info", (request, response) => {
  const entry = persons.length;
  const requestDate = new Date();
  response.send(
    `<div><p>Phonebook has info for ${entry} people</p><p>${requestDate}</p></div>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  let nameAlready = persons.find((p) => p.name === request.body.name);
  if (nameAlready) {
    response.status(400).json({ error: "name must be unique" }).end();
  } else if (!request.body.name || !request.body.number) {
    response.status(400).json({ error: "name or number is missing!" }).end();
  } else {
    let pid = Number((Math.random() * 1000000000).toFixed(0));
    const person = {
      id: pid,
      name: request.body.name,
      number: request.body.number,
    };
    persons.push(person);
    response.json(person);
  }
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
