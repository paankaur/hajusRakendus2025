---
title: Posts Service Guide
---
## Overview

The Posts service manages blog posts and emits events to the Event Bus when posts are created or deleted.

## Local Development

### Navigate to posts directory

```bash
cd posts
```

### Install dependencies

```bash
npm install
```

### Start the development server

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

POST method `/posts/new` that creates a post and forwards event to event-bus

```javascript
app.post("/posts/new", async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Post text is required" });

  const newPost = { id: Date.now(), text: text.trim(), comments: [] };
  posts.push(newPost);

  try {
    const resp = await axios.post(
      "http://event-bus-srv:5003/events", // Event Bus service in Kubernetes
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

DELETE method `/posts/delete` to clear all posts

```javascript
app.delete("/posts/delete", (req, res) => {
  posts = [];
  res.json({ message: "All posts cleared" });
});
```

---

</SwmSnippet>

## Kubernetes Deployment

### Build and push Docker image

```bash
docker build -t paankaur/posts:latest ./posts
docker push paankaur/posts:latest
```

### Deploy to Kubernetes

```bash
kubectl apply -f infra/k8s/posts-depl.yaml
```

### Service Details

- **Port**: 5001
- **Service Name**: `posts-srv`
- **Type**: NodePort (external access on port 30001)
- **Endpoints**:
  - `POST /posts/new` - Create a new post
  - `GET /posts` - Get all posts
  - `DELETE /posts/delete` - Delete all posts
  - `POST /events` - Receive events from Event Bus

### Access via Ingress

The service is accessible through the ingress at:
- `http://blog.local/posts/new` (POST)
- `http://blog.local/posts/delete` (DELETE)

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBaGFqdXNSYWtlbmR1czIwMjUlM0ElM0FwYWFua2F1cg==" repo-name="hajusRakendus2025"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
