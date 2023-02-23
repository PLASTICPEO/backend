import express, { request } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);
const unknownEndpoint = (request, response) => {
  if (request.body) {
    response.status(404).send("not found info");
  }
};

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  {
    content: "JavaScrip is very good programming language",
    important: true,
    id: 4,
  },
];

app.get("/", (request, response) => {
  response.send(`Hi from 3001 port`);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(
    `Phonebook has info for ${notes.length} people <h3>${currentDate}</h3>`
  );
});

app.get("/api/notes", (request, response) => {
  response.send(notes);
});

app.put("/api/notes/:id", (request, response) => {
  notes = notes.map((note) => {
    if (note.id == request.body.id) {
      return request.body;
    } else {
      return note;
    }
  });

  response.send(request.body);
});

app.get("/api/notes/:id", (request, response) => {
  const noteId = request.params.id;
  const note = notes.find((findNote) => {
    return findNote.id === Number(noteId);
  });

  if (note) {
    response.send(note);
  } else {
    response.send(`<h1>Id ${noteId} could not be found</h1>`);
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.post(
  "/api/notes",
  morgan(
    "':method :url :status :res[content-length] - :response-time ms :body"
  ),
  (request, response) => {
    request.body.id = generateId();
    const person = request.body;

    const similarName = notes.find(
      (personName) => personName.content === person.content
    );

    if (similarName) {
      notes.push({ error: "name must be unique" });
      response.json({ error: "name must be unique" });
    } else {
      notes.push(person);
      response.json(person);
    }
  }
);

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
