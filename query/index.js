import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const posts = {};

app.get("/posts", (req, res) => {
 // res.json(posts);
   res.send(posts);
});

// Receive an event
app.post("/events", (req, res) => {
  if (req.body.type === "PostCreated") {
    const { id, text } = req.body.data;
    posts[id] = { id, text, comments: [] };
  } else if (req.body.type === "CommentCreated") {
    const { id, text, postId } = req.body.data;
    const post = posts[postId];
    if (post) {
      post.comments.push({ id, text });
    }
  }
  console.log(posts);
  res.json({});
});



const PORT = 5004;
app.listen(PORT, () => console.log(`Query Service running on port ${PORT}`));
