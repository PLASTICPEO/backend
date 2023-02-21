import express, { request } from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };

// const unknownEndpoint = (request, response) => {
//   if (request.body) {
//     response.status(200).send({ error: "unknown endpoint" });
//   }
// };

// app.use(requestLogger);
app.use(express.json());
// app.use(unknownEndpoint);
app.use(cors());

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

app.get("/", (request, response) => {
  response.send(`Hi from 3001 port`);
});

const currentDate = new Date();

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people
                <h3>${currentDate}</h3>`);
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const noteId = request.params.id;
  const note = persons.find((findNote) => {
    return findNote.id === Number(noteId);
  });

  if (note) {
    response.send(note);
  } else {
    response.send(`<h1>Id ${noteId} could not be found</h1>`);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.post(
  "/api/persons",
  morgan(
    "':method :url :status :res[content-length] - :response-time ms :body"
  ),
  (request, response) => {
    request.body.id = generateId();
    const person = request.body;

    const similarName = persons.find(
      (personName) => personName.name === person.name
    );

    if (similarName) {
      persons.push({ error: "name must be unique" });
      response.json({ error: "name must be unique" });
    } else {
      persons.push(person);
      response.json(person);
    }
  }
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
