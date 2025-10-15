


//try next

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let posts = []; // in-memory storage

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Add a new post
app.post("/posts", (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Post text is required" });

  const newPost = { id: Date.now(), text: text.trim(), comments: [] };
  posts.push(newPost);
  res.json(newPost);
});

// Add comment to a post
app.post("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Comment text is required" });

  const comment = { id: Date.now(), text: text.trim() };
  post.comments.push(comment);
  res.json(comment);
});

//see comments for a post
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post.comments);
});

// Reset all posts
app.delete("/posts", (req, res) => {
  posts = [];
  res.json({ message: "All posts cleared" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
