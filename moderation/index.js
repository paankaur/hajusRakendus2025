import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Receive an event from the event bus
app.post("/events", async (req, res) => {
  const { type, data } = req.body || {};

  if (type === "CommentCreated") {
    const { id, postId, text } = data || {};

    // Check if comment contains "orange"
    const status = text && text.toLowerCase().includes("orange") ? "rejected" : "approved";

    console.log(`Comment ${id}: ${status} (text: "${text}")`);

    try {
      // Emit CommentModerated event back to event bus
      await axios.post("http://event-bus:5003/events", {
        type: "CommentModerated",
        data: { id, postId, status },
      });
    } catch (err) {
      console.error("Failed to emit CommentModerated event:", err.message);
    }
  }

  res.sendStatus(200);
});

const PORT = 5005;
app.listen(PORT, () => console.log(`Moderation service running on port ${PORT}`));