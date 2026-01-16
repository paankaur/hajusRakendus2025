import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

const allowedOrigins = [
  "https://blog.local",
  "http://blog.local",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let comments = []; // in-memory storage

// Add comment to a post
app.post("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  const comment = { id: Date.now(), postId, text: text.trim() };
  comments.push(comment);

  axios
    .post("http://event-bus-srv:5003/events", { // Event Bus URL
      type: "CommentCreated",
      data: comment,
    })
    .then(() => {
      console.log("Event emitted: CommentC-C-Created");
    })
    .catch((err) => {
      console.error("Failed to emit CommentCreated event:", err.message);
    });
  res.json(comment);
});

//see comments for a post
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;

  res.json(comments.filter((c) => c.postId === postId));
  console.log(comments);
});

// Delete all comments
app.delete("/comments", (req, res) => {
  comments = [];
  console.log("All comments deleted");
  res.sendStatus(200);
});

// Receive events
app.post("/events", (req, res) => {
  console.log("Received Event:", req.body);

  // Handle other event types if needed

  res.json({});
});

const PORT = 5002;
app.listen(PORT, () => console.log(`Comments Server running on port ${PORT}`));
