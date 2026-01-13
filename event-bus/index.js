import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let events = []; // in-memory storage

// Receive an event
app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);
  console.log("Received Event:", event.type);

  try {
    await axios.post("http://posts-srv:5001/events", event); // posts service
    await axios.post("http://comments-srv:5002/events", event); // comments service
    await axios.post("http://query-srv:5004/events", event); // query service
    await axios.post("http://moderation-srv:5005/events", event); // moderation service
  } catch (err) {
    console.error("Error broadcasting event:", err.message);
  }

  res.json({ status: "Event received and broadcast" });
});

// Get all events
app.get("/events", (req, res) => {
  res.json(events);
});

const PORT = 5003;                                            // Event Bus port
app.listen(PORT, () => console.log(`Event Bus running on port ${PORT}`));
