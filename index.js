const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(cors());
app.use(express.static("build"));

// eslint-disable-next-line no-unused-vars
morgan.token("reqbody", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :response-time ms :reqbody"));
app.use(express.json());

app.get("/info", (request, response) => {
  Person.find().then((persons) => {
    const entry = persons.length;
    const requestDate = new Date();
    response.send(
      `<div><p>Phonebook has info for ${entry} people</p><p>${requestDate}</p></div>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find().then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response
      .status(400)
      .json({ error: "name or number is missing!" })
      .end();
  }
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  person
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById({ _id: request.params.id })
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove({ _id: request.params.id })
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
