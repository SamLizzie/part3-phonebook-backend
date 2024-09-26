const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] :response-time :body")
);
app.use(express.static('dist'))

app.use(cors());

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const lenPersons = persons.length;
  const dateNow = Date();
  response.send(
    "<div><p>Phonebook has info for " +
      lenPersons +
      " people</p><p>" +
      dateNow +
      "</p></div>"
  );

  morgan.token("body", (request) => JSON.stringify(""));

});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person === undefined) {
    response.status(404).end();
  } else {
    console.log(person);
    response.json(person);
  }

  morgan.token("body", (request) => JSON.stringify(""));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons.filter((person) => person.id !== id);

  response.status(204).end();
});

morgan.token("body", (request) => JSON.stringify(""));

const generateRandomId = () => {
  return Math.floor(Math.random() * 200);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const idGenerated = generateRandomId();

  const nameFound = persons.find((person) => {
    return person.name === body.name;
  });

  if (!body.name) {
    return response.status(400).json({ error: "Name must not be emptied" });
  } else if (nameFound !== undefined) {
    return response.status(400).json({ error: "Name must be unique" });
  } else if (!body.number) {
    return response.status(400).json({ error: "Number must not be emptied" });
  }

  const person = {
    id: idGenerated.toString(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  morgan.token("body", (request) => JSON.stringify(request.body));

  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
