import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors(/* { origin: 'http://localhost:3000' } */));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const posts = {};

app.get("/posts", (req, res) => {
  res.json(posts);
});

// Convenience: return comments for a single post (read from Query's in-memory posts)
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const post = posts[postId];
  if (!post) return res.status(404).json([]);
  res.json(post.comments || []);
});

// Proxy create-comment to the comments service so the frontend can POST to Query
app.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const resp = await axios.post(
      `http://comments:5002/posts/${postId}/comments`,
      req.body,
      { headers: { "Content-Type": "application/json" }, timeout: 5000 }
    );
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error("Proxy to comments service failed:", err.message || err);
    const status = err.response?.status || 500;
    return res.status(status).json({ error: "Failed to create comment" });
  }
});

// Receive an event
app.post("/events", (req, res) => {
  const { type, data } = req.body || {};

  if (type === "PostCreated") {
    const { id } = data || {};
    const text = data?.text ?? data?.content ?? data?.body ?? "";
    posts[id] = { id, text, comments: [] };
  } else if (type === "CommentCreated") {
    const { id } = data || {};
    const postId = data?.postId ?? data?.post_id ?? data?.postID;
    const text = data?.text ?? data?.content ?? data?.body ?? "";
    const post = posts[postId];
    if (post) {
      if (!post.comments.find((c) => c.id === id)) {
        post.comments.push({ id, text, status: "pending" }); // add status field
      }
    } else {
      console.warn("Comment for unknown postId:", postId);
    }
  } else if (type === "CommentModerated") {
    const { id, postId, status } = data || {};
    const post = posts[postId];
    if (post) {
      const comment = post.comments.find((c) => c.id === id);
      if (comment) {
        comment.status = status; // update with approved/rejected
        console.log(`Comment ${id} marked as ${status}`);
      }
    } else {
      console.warn("Moderated comment for unknown postId:", postId);
    }
  }

  console.log("Query posts:", JSON.stringify(posts, null, 2));
  res.sendStatus(200);
});

app.delete("/posts", (req, res) => {
  Object.keys(posts).forEach((key) => delete posts[key]); // clear the posts map
  console.log("All posts and comments deleted from Query");
  res.sendStatus(200);
});

const PORT = 5004;
app.listen(PORT, () => console.log(`Query Service running on port ${PORT}`));
