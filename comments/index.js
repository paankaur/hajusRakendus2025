import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
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
    .post("http://localhost:5003/events", {
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
// Receive events
app.post("/events", (req, res) => {
  console.log("Received Event:", req.body);

  // Handle other event types if needed

  res.json({});
});

const PORT = 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
