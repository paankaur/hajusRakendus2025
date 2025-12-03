---
title: Posts guide
---
## Start with following bash commands:

## Navigate to <SwmPath>[posts/](/posts/)</SwmPath>

```bash
cd posts
```

## a

```bash
npm i
```

## Start the server

```bash
nodemon index.js
```

<SwmSnippet path="/posts/index.js" line="64">

---

Server will start running on http://localhost:5001

```javascript
const PORT = 5001;
app.listen(PORT, () => console.log(`Posts Server running on port ${PORT}`));
```

---

</SwmSnippet>

## Methods:

&nbsp;

<SwmSnippet path="/posts/index.js" line="13">

---

Posts are stored inside an array:

```javascript
let posts = []; // in-memory storage
```

---

</SwmSnippet>

<SwmSnippet path="/posts/index.js" line="16">

---

GET method for getting all posts

```javascript
app.get("/posts", (req, res) => {
  res.json(posts);
});
```

---

</SwmSnippet>

<SwmSnippet path="/posts/index.js" line="21">

---

POST method that forwards to event-bus

```javascript
app.post("/posts", async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Post text is required" });

  const newPost = { id: Date.now(), text: text.trim(), comments: [] };
  posts.push(newPost);

  try {
    const resp = await axios.post(
      "http://localhost:5003/events", // Event Bus URL
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
```

---

</SwmSnippet>

<SwmSnippet path="/posts/index.js" line="59">

---

DELETE method

```javascript
app.delete("/posts", (req, res) => {
  posts = [];
  res.json({ message: "All posts cleared" });
});
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBaGFqdXNSYWtlbmR1czIwMjUlM0ElM0FwYWFua2F1cg==" repo-name="hajusRakendus2025"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
