---
title: Comments guide
---
## Start with following bash commands:

## Navigate to <SwmPath>[comments/](/comments/)</SwmPath>

## Install packages

```bash
npm i
```

## Start the server

```bash
nodemon index.js
```

&nbsp;

<SwmSnippet path="/comments/index.js" line="10">

---

This stores the comments (for posts)

```javascript
let comments = []; // in-memory storage
```

---

</SwmSnippet>

&nbsp;

<SwmSnippet path="/comments/index.js" line="13">

---

POST method, sends data to event-bus

```javascript
app.post("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  const comment = { id: Date.now(), postId, text: text.trim() };
  comments.push(comment);

  axios
    .post("http://localhost:5003/events", { // Event Bus URL
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
```

---

</SwmSnippet>

&nbsp;

<SwmSnippet path="/comments/index.js" line="35">

---

GET method for a single comment via ID

```javascript
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;

  res.json(comments.filter((c) => c.postId === postId));
  console.log(comments);
});
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBaGFqdXNSYWtlbmR1czIwMjUlM0ElM0FwYWFua2F1cg==" repo-name="hajusRakendus2025"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
