import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let posts = []; // in-memory storage

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Add a new post
app.post("/posts/new", async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Post text is required" });

  const newPost = { id: Date.now(), text: text.trim(), comments: [] };
  posts.push(newPost);

  try {
    const resp = await axios.post(
      "http://event-bus-srv:5003/events", // Event Bus URL
      {
        type: "PostCreated",
        data: newPost,
      },
      { timeout: 3000 }
    );
    console.log("Event emitted: PostCreated, status:", resp.status);
  } catch (err) {
    // more detailed logging so you actually see why it failed
    console.error(
      "Failed to emit PostCreated event:",
      err.response ? `status=${err.response.status}` : err.message
    );
  }

  res.status(201).json(newPost);
});

app.post("/events", (req, res) => {
  console.log("Receiiiiiiiiiiiiiived Event:", req.body);

  // Handle other event types if needed

  res.json({});
});

// Reset all posts
app.delete("/posts/delete", (req, res) => {
  posts = [];
  res.json({ message: "All posts cleared" });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Posts Server running on port ${PORT}`));
